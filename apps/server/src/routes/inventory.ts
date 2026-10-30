import { Router } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { db, logActivity, uploadsDir } from '../db/database';
import { aiService } from '../services/aiService';
import { InventoryItem, InventoryItemSchema } from '@the-last-login/shared';

const router = Router();

const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.msi', '.dll',
  '.com', '.scr', '.jar', '.cpl', '.reg', '.wsf', '.hta'
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, uniqueSuffix + '-' + sanitized);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`File type rejected: Executable files (${ext}) are not permitted for security.`));
    }
    cb(null, true);
  }
});

// GET /api/inventory - list items with filtering & search
router.get('/', (req, res) => {
  try {
    const { category, triageStatus, search } = req.query;
    let query = 'SELECT * FROM inventory_items WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (triageStatus && triageStatus !== 'all') {
      query += ' AND triageStatus = ?';
      params.push(triageStatus);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)';
      params.push(term, term, term);
    }

    query += ' ORDER BY importedAt DESC';

    const raw = db.prepare(query).all(...params) as any[];
    const items: InventoryItem[] = raw.map(row => ({
      ...row,
      isPendingExorcism: Boolean(row.isPendingExorcism),
      tags: JSON.parse(row.tags || '[]'),
      metadata: JSON.parse(row.metadata || '{}')
    }));

    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inventory/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id) as any;
    if (!row) {
      return res.status(404).json({ error: 'Item not found' });
    }
    const item: InventoryItem = {
      ...row,
      isPendingExorcism: Boolean(row.isPendingExorcism),
      tags: JSON.parse(row.tags || '[]'),
      metadata: JSON.parse(row.metadata || '{}')
    };
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory - create item manually or from catalog
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = body.id || 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const hash = body.hash || crypto.createHash('sha256').update(id + (body.title || '')).digest('hex');
    const importedAt = body.importedAt || new Date().toISOString();

    // AI Classification Suggestion
    const aiSuggestion = await aiService.suggestItemClassification({
      title: body.title,
      description: body.description,
      category: body.category,
      fileType: body.fileType
    });

    const newItem: InventoryItem = {
      id,
      title: body.title,
      description: body.description || '',
      category: body.category || 'other',
      fileType: body.fileType || 'text/plain',
      fileSize: Number(body.fileSize) || 0,
      fileName: body.fileName || `${body.title}.txt`,
      localPath: body.localPath || `local://${body.fileName || 'file'}`,
      contentSnippet: body.contentSnippet || '',
      previewUrl: body.previewUrl || '',
      hash,
      importedAt,
      triageStatus: body.triageStatus || 'unassigned',
      decisionReason: body.decisionReason || '',
      recipient: body.recipient || '',
      aiSuggestedStatus: aiSuggestion.suggestedStatus,
      aiConfidence: aiSuggestion.confidence,
      aiRationale: aiSuggestion.rationale,
      isPendingExorcism: body.isPendingExorcism || false,
      tags: Array.isArray(body.tags) ? body.tags : [],
      metadata: body.metadata || {}
    };

    db.prepare(`
      INSERT INTO inventory_items (
        id, title, description, category, fileType, fileSize, fileName, localPath,
        contentSnippet, previewUrl, hash, importedAt, triageStatus, decisionReason,
        recipient, aiSuggestedStatus, aiConfidence, aiRationale, isPendingExorcism,
        tags, metadata
      ) VALUES (
        @id, @title, @description, @category, @fileType, @fileSize, @fileName, @localPath,
        @contentSnippet, @previewUrl, @hash, @importedAt, @triageStatus, @decisionReason,
        @recipient, @aiSuggestedStatus, @aiConfidence, @aiRationale, @isPendingExorcism,
        @tags, @metadata
      )
    `).run({
      ...newItem,
      isPendingExorcism: newItem.isPendingExorcism ? 1 : 0,
      tags: JSON.stringify(newItem.tags),
      metadata: JSON.stringify(newItem.metadata)
    });

    logActivity('import', `Added "${newItem.title}" to Life Inventory`, { itemId: id });

    res.status(201).json({ item: newItem });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory/upload - local file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileBuffer = fs.readFileSync(file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    let category: any = 'other';
    const mime = file.mimetype;
    if (mime.startsWith('image/')) category = 'photos';
    else if (mime.startsWith('audio/')) category = 'audio';
    else if (mime.includes('pdf') || mime.includes('word') || mime.includes('text')) category = 'documents';
    else if (mime.includes('zip') || file.originalname.endsWith('.ts') || file.originalname.endsWith('.py')) category = 'creative';

    const id = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const importedAt = new Date().toISOString();

    const title = req.body.title || file.originalname.replace(/\.[^/.]+$/, '');
    const description = req.body.description || `Locally imported file: ${file.originalname}`;

    // AI Classification Suggestion
    const aiSuggestion = await aiService.suggestItemClassification({
      title,
      description,
      category,
      fileType: mime
    });

    const newItem: InventoryItem = {
      id,
      title,
      description,
      category,
      fileType: mime,
      fileSize: file.size,
      fileName: file.originalname,
      localPath: path.relative(process.cwd(), file.path),
      contentSnippet: `Imported local binary: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)`,
      previewUrl: mime.startsWith('image/') ? `/uploads/${path.basename(file.path)}` : undefined,
      hash,
      importedAt,
      triageStatus: 'unassigned',
      aiSuggestedStatus: aiSuggestion.suggestedStatus,
      aiConfidence: aiSuggestion.confidence,
      aiRationale: aiSuggestion.rationale,
      isPendingExorcism: false,
      tags: [category, file.originalname.split('.').pop() || 'file'],
      metadata: { originalName: file.originalname, encoding: file.encoding }
    };

    db.prepare(`
      INSERT INTO inventory_items (
        id, title, description, category, fileType, fileSize, fileName, localPath,
        contentSnippet, previewUrl, hash, importedAt, triageStatus, decisionReason,
        recipient, aiSuggestedStatus, aiConfidence, aiRationale, isPendingExorcism,
        tags, metadata
      ) VALUES (
        @id, @title, @description, @category, @fileType, @fileSize, @fileName, @localPath,
        @contentSnippet, @previewUrl, @hash, @importedAt, @triageStatus, @decisionReason,
        @recipient, @aiSuggestedStatus, @aiConfidence, @aiRationale, @isPendingExorcism,
        @tags, @metadata
      )
    `).run({
      ...newItem,
      isPendingExorcism: 0,
      tags: JSON.stringify(newItem.tags),
      metadata: JSON.stringify(newItem.metadata)
    });

    logActivity('import', `Uploaded and registered "${newItem.title}" into Life Inventory`, { itemId: id });

    res.status(201).json({ item: newItem });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory/:id/triage - set KEEP, RELEASE, or EXORCISE
router.post('/:id/triage', (req, res) => {
  try {
    const { triageStatus, decisionReason, recipient } = req.body;
    if (!['unassigned', 'keep', 'release', 'exorcise'].includes(triageStatus)) {
      return res.status(400).json({ error: 'Invalid triage status' });
    }

    const isPendingExorcism = triageStatus === 'exorcise' ? 1 : 0;

    db.prepare(`
      UPDATE inventory_items
      SET triageStatus = ?, decisionReason = ?, recipient = ?, isPendingExorcism = ?
      WHERE id = ?
    `).run(triageStatus, decisionReason || '', recipient || '', isPendingExorcism, req.params.id);

    logActivity('triage', `Decided ${triageStatus.toUpperCase()} on item ${req.params.id}`, {
      status: triageStatus,
      recipient
    });

    res.json({ success: true, triageStatus, isPendingExorcism: Boolean(isPendingExorcism) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inventory/:id - update item metadata
router.put('/:id', (req, res) => {
  try {
    const { title, description, category, recipient, decisionReason, tags } = req.body;
    const row = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id) as any;
    if (!row) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare(`
      UPDATE inventory_items
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          recipient = COALESCE(?, recipient),
          decisionReason = COALESCE(?, decisionReason),
          tags = COALESCE(?, tags)
      WHERE id = ?
    `).run(
      title || null,
      description !== undefined ? description : null,
      category || null,
      recipient !== undefined ? recipient : null,
      decisionReason !== undefined ? decisionReason : null,
      tags ? JSON.stringify(tags) : null,
      req.params.id
    );

    logActivity('import', `Updated metadata for possession "${title || row.title}"`, { itemId: req.params.id });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory/:id/confirm-exorcise - irreversible deletion
router.post('/:id/confirm-exorcise', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id) as any;
    if (!row) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Physical file deletion from disk if within uploadsDir to prevent stranded data
    if (row.localPath) {
      const fullPath = path.isAbsolute(row.localPath)
        ? row.localPath
        : path.resolve(process.cwd(), row.localPath);

      if (fullPath.startsWith(uploadsDir) && fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (fileErr) {
          console.warn('Failed to delete physical file during exorcism:', fileErr);
        }
      }
    }

    db.prepare('DELETE FROM inventory_items WHERE id = ?').run(req.params.id);
    try {
      db.prepare('DELETE FROM inventory_fts WHERE id = ?').run(req.params.id);
    } catch (e) {
      // ignore
    }

    logActivity('triage', `Permanently EXORCISED and deleted "${row.title}" from storage upon explicit user confirmation.`);

    res.json({ success: true, message: 'Item safely deleted from estate inventory.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory/:id/restore-exorcise - unstage from exorcism
router.post('/:id/restore-exorcise', (req, res) => {
  try {
    db.prepare(`
      UPDATE inventory_items
      SET triageStatus = 'unassigned', isPendingExorcism = 0
      WHERE id = ?
    `).run(req.params.id);

    logActivity('triage', `Restored item ${req.params.id} from pending exorcism back to unassigned.`);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory/:id/analyze - re-run AI suggestion
router.post('/:id/analyze', async (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: 'Item not found' });

    const aiSuggestion = await aiService.suggestItemClassification({
      title: row.title,
      description: row.description,
      category: row.category,
      fileType: row.fileType
    });

    db.prepare(`
      UPDATE inventory_items
      SET aiSuggestedStatus = ?, aiConfidence = ?, aiRationale = ?
      WHERE id = ?
    `).run(aiSuggestion.suggestedStatus, aiSuggestion.confidence, aiSuggestion.rationale, req.params.id);

    res.json({ success: true, aiSuggestion });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
