import { Router } from 'express';
import { db } from '../db/database';
import { InventoryItem, LegacyLetter, SeanceTurn } from '@the-last-login/shared';

const router = Router();

// GET /api/memorial - curated preview of only approved KEEP & RELEASE memories
router.get('/', (_req, res) => {
  try {
    // Strictly filter out anything unassigned, exorcised, or pending exorcism
    const rawItems = db.prepare(`
      SELECT * FROM inventory_items 
      WHERE triageStatus IN ('keep', 'release') AND isPendingExorcism = 0
      ORDER BY 
        CASE category 
          WHEN 'photos' THEN 1 
          WHEN 'recipes' THEN 2 
          WHEN 'stories' THEN 3 
          WHEN 'audio' THEN 4 
          WHEN 'creative' THEN 5 
          ELSE 6 
        END, importedAt ASC
    `).all() as any[];

    const items: InventoryItem[] = rawItems.map(row => ({
      ...row,
      isPendingExorcism: false,
      tags: JSON.parse(row.tags || '[]'),
      metadata: JSON.parse(row.metadata || '{}')
    }));

    // Approved letters only
    const rawLetters = db.prepare(`
      SELECT * FROM legacy_letters WHERE isApproved = 1 ORDER BY createdAt ASC
    `).all() as any[];

    const letters: LegacyLetter[] = rawLetters.map(row => ({
      ...row,
      isApproved: true,
      associatedItemIds: JSON.parse(row.associatedItemIds || '[]')
    }));

    // Completed reflections only (Living Séance)
    const rawTurns = db.prepare(`
      SELECT * FROM seance_turns 
      WHERE isSkipped = 0 AND userAnswer IS NOT NULL AND userAnswer != ''
      ORDER BY createdAt ASC
    `).all() as any[];

    const seanceReflections: SeanceTurn[] = rawTurns.map(row => ({
      ...row,
      isSkipped: false
    }));

    // Categorized groups for the tribute view
    const photos = items.filter(i => i.category === 'photos');
    const recipes = items.filter(i => i.category === 'recipes');
    const audio = items.filter(i => i.category === 'audio');
    const creative = items.filter(i => i.category === 'creative');
    const stories = items.filter(i => i.category === 'stories');
    const documents = items.filter(i => i.category === 'documents');

    res.json({
      memorial: {
        ownerName: 'Marisol Hernandez',
        tagline: 'A life rooted in family, flora, and shared memories.',
        totalPreservedItems: items.length,
        totalLetters: letters.length,
        totalReflections: seanceReflections.length,
        sections: {
          photos,
          recipes,
          audio,
          creative,
          stories,
          documents
        },
        letters,
        reflections: seanceReflections
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
