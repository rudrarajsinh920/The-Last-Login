import { Router } from 'express';
import { db, logActivity } from '../db/database';
import { aiService } from '../services/aiService';
import { LegacyLetter } from '@the-last-login/shared';

const router = Router();

// GET /api/letters - list all letters
router.get('/', (_req, res) => {
  try {
    const raw = db.prepare('SELECT * FROM legacy_letters ORDER BY updatedAt DESC').all() as any[];
    const letters: LegacyLetter[] = raw.map(row => ({
      ...row,
      isApproved: Boolean(row.isApproved),
      associatedItemIds: JSON.parse(row.associatedItemIds || '[]')
    }));
    res.json({ letters });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/letters/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM legacy_letters WHERE id = ?').get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: 'Letter not found' });
    const letter: LegacyLetter = {
      ...row,
      isApproved: Boolean(row.isApproved),
      associatedItemIds: JSON.parse(row.associatedItemIds || '[]')
    };
    res.json({ letter });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/letters - create new letter
router.post('/', (req, res) => {
  try {
    const { title, recipient, type, content, tone, associatedItemIds } = req.body;
    const id = 'letter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const now = new Date().toISOString();

    const letter: LegacyLetter = {
      id,
      title: title || 'Untitled Letter',
      recipient: recipient || 'Family',
      type: type || 'personal',
      content: content || '',
      tone: tone || 'reflective',
      isApproved: false,
      createdAt: now,
      updatedAt: now,
      associatedItemIds: Array.isArray(associatedItemIds) ? associatedItemIds : []
    };

    db.prepare(`
      INSERT INTO legacy_letters (
        id, title, recipient, type, content, tone, isApproved, createdAt, updatedAt, associatedItemIds
      ) VALUES (
        @id, @title, @recipient, @type, @content, @tone, 0, @createdAt, @updatedAt, @associatedItemIds
      )
    `).run({
      ...letter,
      isApproved: 0,
      associatedItemIds: JSON.stringify(letter.associatedItemIds)
    });

    logActivity('letter', `Created new draft letter "${letter.title}" for ${letter.recipient}`);

    res.status(201).json({ letter });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/letters/:id - update draft
router.put('/:id', (req, res) => {
  try {
    const { title, recipient, type, content, tone, associatedItemIds } = req.body;
    const updatedAt = new Date().toISOString();

    db.prepare(`
      UPDATE legacy_letters
      SET title = ?, recipient = ?, type = ?, content = ?, tone = ?, updatedAt = ?, associatedItemIds = ?
      WHERE id = ?
    `).run(
      title,
      recipient,
      type,
      content,
      tone,
      updatedAt,
      JSON.stringify(associatedItemIds || []),
      req.params.id
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/letters/:id/approve - toggle approval
router.post('/:id/approve', (req, res) => {
  try {
    const { isApproved } = req.body;
    const row = db.prepare('SELECT title FROM legacy_letters WHERE id = ?').get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: 'Letter not found' });

    db.prepare('UPDATE legacy_letters SET isApproved = ? WHERE id = ?')
      .run(isApproved ? 1 : 0, req.params.id);

    logActivity('letter', `${isApproved ? 'Approved' : 'Un-approved'} letter "${row.title}" for archive inclusion.`);

    res.json({ success: true, isApproved: Boolean(isApproved) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/letters/:id
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM legacy_letters WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/letters/assist - AI writing assistant
router.post('/assist', async (req, res) => {
  try {
    const { recipient, type, tone, promptAction, currentContent } = req.body;
    const result = await aiService.assistLetterWriting({
      recipient: recipient || 'Loved Ones',
      type: type || 'personal',
      tone: tone || 'reflective',
      promptAction: promptAction || 'create_full_draft',
      currentContent
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
