import { Router } from 'express';
import { db, logActivity } from '../db/database';
import { aiService } from '../services/aiService';
import { SeanceTurn } from '@the-last-login/shared';

const router = Router();

// GET /api/seance - get interview turns
router.get('/', (_req, res) => {
  try {
    const raw = db.prepare('SELECT * FROM seance_turns ORDER BY createdAt ASC').all() as any[];
    const turns: SeanceTurn[] = raw.map(row => ({
      ...row,
      isSkipped: Boolean(row.isSkipped)
    }));
    res.json({ turns });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/seance/ask - generate next question or ask about a specific item
router.post('/ask', async (req, res) => {
  try {
    const { itemId } = req.body;
    let itemTitle: string | undefined;
    let itemCategory: string | undefined;

    if (itemId) {
      const item = db.prepare('SELECT title, category FROM inventory_items WHERE id = ?').get(itemId) as any;
      if (item) {
        itemTitle = item.title;
        itemCategory = item.category;
      }
    }

    const qData = await aiService.generateSeanceQuestion(itemTitle, itemCategory);
    const id = 'seance_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const now = new Date().toISOString();

    const turn: SeanceTurn = {
      id,
      question: qData.question,
      category: qData.category,
      associatedItemId: itemId || undefined,
      associatedItemTitle: itemTitle || undefined,
      aiPromptContext: qData.aiPromptContext,
      isSkipped: false,
      createdAt: now,
      updatedAt: now
    };

    db.prepare(`
      INSERT INTO seance_turns (
        id, question, category, associatedItemId, associatedItemTitle,
        aiPromptContext, isSkipped, createdAt, updatedAt
      ) VALUES (
        @id, @question, @category, @associatedItemId, @associatedItemTitle,
        @aiPromptContext, 0, @createdAt, @updatedAt
      )
    `).run(turn);

    res.status(201).json({ turn });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/seance/:id/answer - submit answer and generate reflection
router.post('/:id/answer', async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer || typeof answer !== 'string') {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const row = db.prepare('SELECT * FROM seance_turns WHERE id = ?').get(req.params.id) as any;
    if (!row) {
      return res.status(404).json({ error: 'Interview question not found' });
    }

    const aiReflection = await aiService.generateSeanceReflection(row.question, answer);
    const updatedAt = new Date().toISOString();

    db.prepare(`
      UPDATE seance_turns
      SET userAnswer = ?, isSkipped = 0, updatedAt = ?, aiReflection = ?
      WHERE id = ?
    `).run(answer, updatedAt, aiReflection, req.params.id);

    logActivity('interview', `Recorded reflection for question "${row.question.substring(0, 40)}..."`);

    res.json({
      success: true,
      turn: {
        ...row,
        userAnswer: answer,
        isSkipped: false,
        updatedAt,
        aiReflection
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/seance/:id/skip - skip question
router.post('/:id/skip', (req, res) => {
  try {
    const updatedAt = new Date().toISOString();
    db.prepare(`
      UPDATE seance_turns
      SET isSkipped = 1, updatedAt = ?
      WHERE id = ?
    `).run(updatedAt, req.params.id);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/seance/:id - edit answer
router.put('/:id', (req, res) => {
  try {
    const { answer } = req.body;
    const updatedAt = new Date().toISOString();
    db.prepare(`
      UPDATE seance_turns
      SET userAnswer = ?, updatedAt = ?
      WHERE id = ?
    `).run(answer, updatedAt, req.params.id);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/seance/:id - delete interview turn
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM seance_turns WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
