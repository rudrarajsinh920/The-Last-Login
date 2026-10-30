import Database, { Database as DatabaseInstance } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(__dirname, '../../data');
const uploadsDir = path.resolve(dataDir, 'uploads');
const archivesDir = path.resolve(dataDir, 'archives');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(archivesDir)) {
  fs.mkdirSync(archivesDir, { recursive: true });
}

const dbPath = path.resolve(dataDir, 'the_last_login.db');
export const db: DatabaseInstance = new Database(dbPath);

// Enable WAL mode for performance & reliability
db.pragma('journal_mode = WAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT NOT NULL,
      fileType TEXT NOT NULL,
      fileSize INTEGER NOT NULL,
      fileName TEXT NOT NULL,
      localPath TEXT NOT NULL,
      contentSnippet TEXT,
      previewUrl TEXT,
      hash TEXT NOT NULL,
      importedAt TEXT NOT NULL,
      triageStatus TEXT DEFAULT 'unassigned',
      decisionReason TEXT,
      recipient TEXT,
      aiSuggestedStatus TEXT,
      aiConfidence REAL,
      aiRationale TEXT,
      isPendingExorcism INTEGER DEFAULT 0,
      tags TEXT DEFAULT '[]',
      metadata TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS seance_turns (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      category TEXT NOT NULL,
      associatedItemId TEXT,
      associatedItemTitle TEXT,
      aiPromptContext TEXT,
      userAnswer TEXT,
      isSkipped INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      aiReflection TEXT
    );

    CREATE TABLE IF NOT EXISTS legacy_letters (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      recipient TEXT NOT NULL,
      type TEXT DEFAULT 'personal',
      content TEXT NOT NULL,
      tone TEXT DEFAULT 'reflective',
      isApproved INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      associatedItemIds TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Try creating FTS5 virtual table for local search
  try {
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS inventory_fts USING fts5(
        id UNINDEXED,
        title,
        description,
        contentSnippet,
        tags,
        category
      );
    `);
  } catch (err) {
    console.warn('FTS5 virtual table already configured or fallback enabled:', err);
  }

  // Ensure default system settings exist
  const existingSettings = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('config');
  if (!existingSettings) {
    const defaultConfig = {
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'gemma2:latest',
      enableLocalHeuristics: true,
      ownerName: 'Marisol Hernandez',
      encryptionHint: 'Abuela birth year and birthplace',
      theme: 'parchment'
    };
    db.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)').run('config', JSON.stringify(defaultConfig));
  }
}

export function logActivity(action: string, description: string, metadata: Record<string, any> = {}) {
  const id = 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const timestamp = new Date().toISOString();
  db.prepare(`
    INSERT INTO activity_logs (id, timestamp, action, description, metadata)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, timestamp, action, description, JSON.stringify(metadata));
}

export { uploadsDir, archivesDir, dataDir };
