import { Router } from 'express';
import { db, logActivity } from '../db/database';
import { aiService } from '../services/aiService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('config') as any;
    const config = row ? JSON.parse(row.value) : {};
    const aiStatus = await aiService.checkStatus();

    res.json({
      config,
      aiStatus,
      privacyPolicy: {
        cloudStorageEnabled: false,
        telemetryEnabled: false,
        localOnly: true,
        networkActivity: 'Localhost only (127.0.0.1)'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', (req, res) => {
  try {
    const newConfig = req.body;
    db.prepare('INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)')
      .run('config', JSON.stringify(newConfig));

    logActivity('system', 'Updated system preferences and local AI configuration.');

    res.json({ success: true, config: newConfig });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai/test', async (_req, res) => {
  try {
    const status = await aiService.checkStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
