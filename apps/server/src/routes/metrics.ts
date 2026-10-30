import { Router } from 'express';
import { db } from '../db/database';
import { loadMarisolDemoData, resetWorkspaceData } from '../services/demoService';
import { DashboardMetrics } from '@the-last-login/shared';

const router = Router();

// GET /api/metrics - dashboard numbers
router.get('/', (_req, res) => {
  try {
    const totalItems = (db.prepare('SELECT COUNT(*) as count FROM inventory_items').get() as any).count;
    const keepItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'keep'").get() as any).count;
    const releaseItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'release'").get() as any).count;
    const exorciseItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'exorcise'").get() as any).count;
    const unassignedItems = (db.prepare("SELECT COUNT(*) as count FROM inventory_items WHERE triageStatus = 'unassigned'").get() as any).count;

    const totalInterviews = (db.prepare('SELECT COUNT(*) as count FROM seance_turns').get() as any).count;
    const completedInterviews = (db.prepare("SELECT COUNT(*) as count FROM seance_turns WHERE isSkipped = 0 AND userAnswer != ''").get() as any).count;

    const approvedLetters = (db.prepare('SELECT COUNT(*) as count FROM legacy_letters WHERE isApproved = 1').get() as any).count;
    const draftLetters = (db.prepare('SELECT COUNT(*) as count FROM legacy_letters WHERE isApproved = 0').get() as any).count;

    const decidedItems = keepItems + releaseItems + exorciseItems;
    const archiveStatusPercent = totalItems === 0 ? 0 : Math.round((decidedItems / totalItems) * 100);

    const latestAct = db.prepare('SELECT timestamp FROM activity_logs ORDER BY timestamp DESC LIMIT 1').get() as any;
    const lastActivityAt = latestAct ? latestAct.timestamp : new Date().toISOString();

    const metrics: DashboardMetrics = {
      totalItems,
      keepItems,
      releaseItems,
      exorciseItems,
      unassignedItems,
      completedInterviews,
      totalInterviews,
      approvedLetters,
      draftLetters,
      archiveStatusPercent,
      lastActivityAt
    };

    res.json({ metrics });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/activity - recent activity feed
router.get('/activity', (_req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 30').all() as any[];
    res.json({
      activity: logs.map(l => ({
        ...l,
        metadata: JSON.parse(l.metadata || '{}')
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/demo/marisol - load scenario
router.post('/demo/marisol', (_req, res) => {
  try {
    loadMarisolDemoData();
    res.json({ success: true, message: 'Fictional demo scenario for Marisol Hernandez loaded.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/demo/reset - clean state
router.post('/demo/reset', (_req, res) => {
  try {
    resetWorkspaceData();
    res.json({ success: true, message: 'Workspace reset to empty state.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
