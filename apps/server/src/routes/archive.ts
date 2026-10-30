import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { db, archivesDir } from '../db/database';
import { cryptoService } from '../services/cryptoService';
import { VaultArchive } from '@the-last-login/shared';

const router = Router();
const upload = multer({ dest: path.resolve(archivesDir, 'tmp') });

// GET /api/archive/status - readiness checklist
router.get('/status', (_req, res) => {
  try {
    const totalItems = (db.prepare('SELECT COUNT(*) as count FROM inventory_items').get() as any).count;
    const keepItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'keep'").get() as any).count;
    const releaseItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'release'").get() as any).count;
    const exorciseItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'exorcise'").get() as any).count;
    const unassignedItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'unassigned'").get() as any).count;

    const approvedLetters = (db.prepare('SELECT COUNT(*) as count FROM legacy_letters WHERE isApproved = 1').get() as any).count;
    const draftLetters = (db.prepare('SELECT COUNT(*) as count FROM legacy_letters WHERE isApproved = 0').get() as any).count;

    const completedInterviews = (db.prepare("SELECT COUNT(*) as count FROM seance_turns WHERE isSkipped = 0 AND userAnswer != ''").get() as any).count;

    const approvedTotal = keepItems + releaseItems;
    const readyPercentage = totalItems === 0 ? 0 : Math.round((approvedTotal / totalItems) * 100);

    // List of recent archives in archive directory
    const archiveFiles = fs.readdirSync(archivesDir)
      .filter(f => f.endsWith('.ofrenda'))
      .map(f => {
        const stats = fs.statSync(path.resolve(archivesDir, f));
        return {
          fileName: f,
          sizeBytes: stats.size,
          createdAt: stats.birthtime.toISOString()
        };
      });

    res.json({
      totalItems,
      keepItems,
      releaseItems,
      exorciseItems,
      unassignedItems,
      approvedLetters,
      draftLetters,
      completedInterviews,
      approvedTotal,
      readyPercentage,
      archiveFiles
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/archive/seal - create encrypted archive
router.post('/seal', async (req, res) => {
  try {
    const { passphrase, ownerName } = req.body;
    if (!passphrase || passphrase.length < 6) {
      return res.status(400).json({ error: 'Passphrase must be at least 6 characters long.' });
    }

    const result = await cryptoService.sealArchive(passphrase, ownerName);
    res.json({
      success: true,
      archive: result.archive,
      fileName: result.fileName,
      downloadUrl: `/api/archive/download/${result.fileName}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/archive/verify - test decryption and verify SHA-256 integrity
router.post('/verify', (req, res) => {
  try {
    const { archiveData, passphrase } = req.body;
    if (!archiveData || !passphrase) {
      return res.status(400).json({ error: 'archiveData and passphrase are required' });
    }

    const verification = cryptoService.verifyAndDecryptArchive(archiveData as VaultArchive, passphrase);
    res.json(verification);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/archive/upload-verify - upload an .ofrenda file to inspect and verify
router.post('/upload-verify', upload.single('archiveFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No archive file uploaded' });
    }
    const passphrase = req.body.passphrase;
    if (!passphrase) {
      return res.status(400).json({ error: 'Passphrase is required for decryption' });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    fs.unlinkSync(req.file.path); // remove temp file

    const archiveData = JSON.parse(fileContent);
    const verification = cryptoService.verifyAndDecryptArchive(archiveData as VaultArchive, passphrase);
    res.json(verification);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/archive/download/:filename
router.get('/download/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.resolve(archivesDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archive file not found' });
    }

    res.download(filePath, filename);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
