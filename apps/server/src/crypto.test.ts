import test from 'node:test';
import assert from 'node:assert';
import { cryptoService } from './services/cryptoService';
import { initDatabase, db } from './db/database';
import { loadMarisolDemoData } from './services/demoService';

test('Database initializes and loads Marisol demo dataset', () => {
  initDatabase();
  loadMarisolDemoData();

  const count = (db.prepare('SELECT COUNT(*) as count FROM inventory_items').get() as any).count;
  assert.ok(count >= 7, `Expected at least 7 demo items, got ${count}`);

  const privateJournal = db.prepare("SELECT * FROM inventory_items WHERE id = 'item_private_journals_grief'").get() as any;
  assert.strictEqual(privateJournal.triageStatus, 'exorcise');
  assert.strictEqual(Boolean(privateJournal.isPendingExorcism), true);
});

test('Cryptographic Sealed Ofrenda: AES-256-GCM encryption & integrity verification', async () => {
  const passphrase = 'test-secret-passphrase-2026';
  const sealed = await cryptoService.sealArchive(passphrase, 'Test Marisol');

  assert.ok(sealed.archive.ciphertext.length > 50);
  assert.ok(sealed.archive.salt.length === 64); // 32 bytes hex
  assert.ok(sealed.archive.iv.length === 24); // 12 bytes hex
  assert.ok(sealed.archive.authTag.length === 32); // 16 bytes hex

  // Verify correct passphrase decrypts and validates checksums
  const verified = cryptoService.verifyAndDecryptArchive(sealed.archive, passphrase);
  assert.strictEqual(verified.isValid, true);
  assert.strictEqual(verified.integrityDetails.authenticatedEncryptionValid, true);
  assert.strictEqual(verified.integrityDetails.checksumsMatch, true);
  assert.ok(verified.payload?.approvedItems.length! > 0);

  // Verify that an EXORCISED item is NEVER included in the decrypted vault payload
  const hasExorcisedItem = verified.payload?.approvedItems.some(item => item.triageStatus === 'exorcise');
  assert.strictEqual(hasExorcisedItem, false, 'Exorcised items must never be included in the sealed archive!');

  // Verify wrong passphrase fails gracefully
  const badVerification = cryptoService.verifyAndDecryptArchive(sealed.archive, 'wrong-password-fail');
  assert.strictEqual(badVerification.isValid, false);
  assert.strictEqual(badVerification.integrityDetails.authenticatedEncryptionValid, false);
});
