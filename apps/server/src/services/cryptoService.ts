import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { archivesDir, db, logActivity } from '../db/database';
import { InventoryItem, LegacyLetter, SeanceTurn, VaultArchive } from '@the-last-login/shared';

export interface ArchiveManifest {
  archiveId: string;
  version: string;
  createdAt: string;
  ownerName: string;
  totalItems: number;
  totalLetters: number;
  totalInterviews: number;
  iterations?: number;
  itemChecksums: Record<string, string>; // itemId -> sha256
  overallChecksumSha256: string;
}

export interface DecryptedVaultPayload {
  manifest: ArchiveManifest;
  approvedItems: InventoryItem[];
  approvedLetters: LegacyLetter[];
  seanceTurns: SeanceTurn[];
  recoveryNotice: string;
}

export interface VerificationResult {
  isValid: boolean;
  archiveId: string;
  createdAt: string;
  ownerName: string;
  manifestSummary: {
    totalItems: number;
    totalLetters: number;
    totalInterviews: number;
  };
  integrityDetails: {
    authenticatedEncryptionValid: boolean;
    checksumsMatch: boolean;
    verifiedItemsCount: number;
    tamperedItems: string[];
  };
  payload?: DecryptedVaultPayload;
  errorMessage?: string;
}

export class CryptoService {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly PBKDF2_ITERATIONS = 100000;
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly SALT_LENGTH = 32; // 256 bits
  private readonly IV_LENGTH = 12; // 96 bits for GCM

  deriveKey(passphrase: string, salt: Buffer, iterations: number = this.PBKDF2_ITERATIONS): Buffer {
    const safeIterations = Math.min(Math.max(iterations, 10000), 2000000);
    return crypto.pbkdf2Sync(
      passphrase,
      salt,
      safeIterations,
      this.KEY_LENGTH,
      'sha256'
    );
  }

  async sealArchive(passphrase: string, ownerName?: string): Promise<{
    archive: VaultArchive;
    filePath: string;
    fileName: string;
  }> {
    if (!passphrase || passphrase.length < 6) {
      throw new Error('Passphrase must be at least 6 characters for adequate key security.');
    }

    // Retrieve approved items (KEEP and RELEASE, definitely excluding EXORCISED)
    const rawItems = db.prepare(`
      SELECT * FROM inventory_items 
      WHERE triageStatus IN ('keep', 'release') AND isPendingExorcism = 0
    `).all() as any[];

    const approvedItems: InventoryItem[] = rawItems.map(row => ({
      ...row,
      isPendingExorcism: Boolean(row.isPendingExorcism),
      tags: JSON.parse(row.tags || '[]'),
      metadata: JSON.parse(row.metadata || '{}')
    }));

    // Retrieve approved letters
    const rawLetters = db.prepare(`
      SELECT * FROM legacy_letters WHERE isApproved = 1
    `).all() as any[];

    const approvedLetters: LegacyLetter[] = rawLetters.map(row => ({
      ...row,
      isApproved: Boolean(row.isApproved),
      associatedItemIds: JSON.parse(row.associatedItemIds || '[]')
    }));

    // Retrieve completed seance turns (non-skipped)
    const rawTurns = db.prepare(`
      SELECT * FROM seance_turns WHERE isSkipped = 0 AND userAnswer IS NOT NULL AND userAnswer != ''
    `).all() as any[];

    const seanceTurns: SeanceTurn[] = rawTurns.map(row => ({
      ...row,
      isSkipped: Boolean(row.isSkipped)
    }));

    const archiveId = 'ofrenda_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const createdAt = new Date().toISOString();

    // Calculate individual item checksums
    const itemChecksums: Record<string, string> = {};
    for (const item of approvedItems) {
      const itemContent = JSON.stringify(item);
      itemChecksums[item.id] = crypto.createHash('sha256').update(itemContent).digest('hex');
    }

    // Overall checksum of payload
    const payloadHash = crypto.createHash('sha256')
      .update(JSON.stringify({ approvedItems, approvedLetters, seanceTurns }))
      .digest('hex');

    const manifest: ArchiveManifest = {
      archiveId,
      version: '1.0.0',
      createdAt,
      ownerName: ownerName || 'Marisol Hernandez',
      totalItems: approvedItems.length,
      totalLetters: approvedLetters.length,
      totalInterviews: seanceTurns.length,
      iterations: this.PBKDF2_ITERATIONS,
      itemChecksums,
      overallChecksumSha256: payloadHash
    };

    const payload: DecryptedVaultPayload = {
      manifest,
      approvedItems,
      approvedLetters,
      seanceTurns,
      recoveryNotice: 'This is a sealed digital estate archive created with The Last Login. Decrypted using zero-knowledge client authentication.'
    };

    // Authenticated encryption setup
    const salt = crypto.randomBytes(this.SALT_LENGTH);
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const key = this.deriveKey(passphrase, salt);

    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');

    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const vaultArchive: VaultArchive = {
      version: '1.0.0',
      createdAt,
      archiveId,
      ownerName: manifest.ownerName,
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      ciphertext: ciphertext.toString('base64'),
      manifestSummary: {
        totalItems: approvedItems.length,
        totalLetters: approvedLetters.length,
        totalInterviews: seanceTurns.length,
        checksumSha256: payloadHash
      }
    };

    const fileName = `${archiveId}.ofrenda`;
    const filePath = path.resolve(archivesDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(vaultArchive, null, 2), 'utf8');

    logActivity('archive', `Sealed and encrypted digital archive ${archiveId}`, {
      itemsCount: approvedItems.length,
      lettersCount: approvedLetters.length,
      interviewsCount: seanceTurns.length
    });

    return {
      archive: vaultArchive,
      filePath,
      fileName
    };
  }

  verifyAndDecryptArchive(archiveData: VaultArchive, passphrase: string): VerificationResult {
    try {
      if (!archiveData || !archiveData.salt || !archiveData.iv || !archiveData.authTag || !archiveData.ciphertext) {
        throw new Error('Malformed archive: missing required cryptographic components (salt, iv, authTag, or ciphertext).');
      }

      const salt = Buffer.from(archiveData.salt, 'hex');
      const iv = Buffer.from(archiveData.iv, 'hex');
      const authTag = Buffer.from(archiveData.authTag, 'hex');
      const ciphertext = Buffer.from(archiveData.ciphertext, 'base64');

      if (salt.length !== this.SALT_LENGTH) {
        throw new Error(`Invalid salt length: expected ${this.SALT_LENGTH} bytes, got ${salt.length}`);
      }
      if (iv.length !== this.IV_LENGTH) {
        throw new Error(`Invalid IV length: expected ${this.IV_LENGTH} bytes, got ${iv.length}`);
      }
      if (authTag.length !== 16) {
        throw new Error(`Invalid authTag length: expected 16 bytes, got ${authTag.length}`);
      }

      const iterations = Number((archiveData as any).iterations) || Number((archiveData.manifestSummary as any)?.iterations) || this.PBKDF2_ITERATIONS;
      const key = this.deriveKey(passphrase, salt, iterations);
      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      const payload = JSON.parse(decrypted.toString('utf8')) as DecryptedVaultPayload;

      // Verify item checksums
      const tamperedItems: string[] = [];
      let verifiedCount = 0;

      for (const item of payload.approvedItems) {
        const expectedChecksum = payload.manifest.itemChecksums[item.id];
        const actualChecksum = crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex');
        if (expectedChecksum && actualChecksum === expectedChecksum) {
          verifiedCount++;
        } else {
          tamperedItems.push(item.id);
        }
      }

      const overallActual = crypto.createHash('sha256')
        .update(JSON.stringify({
          approvedItems: payload.approvedItems,
          approvedLetters: payload.approvedLetters,
          seanceTurns: payload.seanceTurns
        }))
        .digest('hex');

      const checksumsMatch = (overallActual === payload.manifest.overallChecksumSha256) && tamperedItems.length === 0;

      return {
        isValid: true,
        archiveId: archiveData.archiveId,
        createdAt: archiveData.createdAt,
        ownerName: archiveData.ownerName,
        manifestSummary: archiveData.manifestSummary,
        integrityDetails: {
          authenticatedEncryptionValid: true,
          checksumsMatch,
          verifiedItemsCount: verifiedCount,
          tamperedItems
        },
        payload
      };
    } catch (err: any) {
      return {
        isValid: false,
        archiveId: archiveData.archiveId || 'unknown',
        createdAt: archiveData.createdAt || '',
        ownerName: archiveData.ownerName || '',
        manifestSummary: archiveData.manifestSummary || { totalItems: 0, totalLetters: 0, totalInterviews: 0, checksumSha256: '' },
        integrityDetails: {
          authenticatedEncryptionValid: false,
          checksumsMatch: false,
          verifiedItemsCount: 0,
          tamperedItems: []
        },
        errorMessage: err.message === 'Unsupported state or unable to authenticate data'
          ? 'Decryption failed: Incorrect passphrase or archive has been modified/corrupted.'
          : `Decryption error: ${err.message}`
      };
    }
  }
}

export const cryptoService = new CryptoService();
