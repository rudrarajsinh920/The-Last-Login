import express from 'express';
import cors from 'cors';
import path from 'path';
import { db, initDatabase, uploadsDir } from './db/database';
import { loadMarisolDemoData } from './services/demoService';
import inventoryRoutes from './routes/inventory';
import seanceRoutes from './routes/seance';
import lettersRoutes from './routes/letters';
import archiveRoutes from './routes/archive';
import memorialRoutes from './routes/memorial';
import settingsRoutes from './routes/settings';
import metricsRoutes from './routes/metrics';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory (read-only for previewing local files)
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/seance', seanceRoutes);
app.use('/api/letters', lettersRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/memorial', memorialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', metricsRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'The Last Login Local Server',
    privacy: 'Local storage only, zero cloud leakage'
  });
});

// Initialize database and seed Marisol demo data if empty
initDatabase();
const count = (db.prepare('SELECT COUNT(*) as count FROM inventory_items').get() as any).count;
if (count === 0) {
  console.log('Seeding initial fictional demo dataset for Marisol Hernandez...');
  loadMarisolDemoData();
}

app.listen(PORT, () => {
  console.log(`🕯️ The Last Login server running locally on http://localhost:${PORT}`);
  console.log(`🔒 Privacy guarantee: All storage is local at ${uploadsDir}`);
});

export default app;
