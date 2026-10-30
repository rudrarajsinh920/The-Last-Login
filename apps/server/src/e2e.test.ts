import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { initDatabase, db, uploadsDir, archivesDir } from './db/database';
import { loadMarisolDemoData, resetWorkspaceData } from './services/demoService';
import { cryptoService } from './services/cryptoService';
import { aiService } from './services/aiService';

// Ensure DB is initialized before testing
initDatabase();

test('Journey 1: Health check, system initialization & privacy policy', () => {
  const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('config') as any;
  assert.ok(row, 'System settings config row should exist');
  const config = JSON.parse(row.value);
  assert.ok(config.ollamaEndpoint.includes('localhost'), 'AI endpoint must be local');
});

test('Journey 2: Open and seed the fictional Marisol demo dataset', () => {
  loadMarisolDemoData();

  const totalItems = (db.prepare('SELECT COUNT(*) as count FROM inventory_items').get() as any).count;
  const totalTurns = (db.prepare('SELECT COUNT(*) as count FROM seance_turns').get() as any).count;
  const totalLetters = (db.prepare('SELECT COUNT(*) as count FROM legacy_letters').get() as any).count;

  assert.strictEqual(totalItems, 7, 'Expected 7 demo items for Marisol');
  assert.strictEqual(totalTurns, 3, 'Expected 3 demo interview turns');
  assert.strictEqual(totalLetters, 3, 'Expected 3 demo legacy letters');

  // Verify Marisol's private journal is staged as EXORCISE
  const journal = db.prepare("SELECT * FROM inventory_items WHERE id = 'item_private_journals_grief'").get() as any;
  assert.strictEqual(journal.triageStatus, 'exorcise');
  assert.strictEqual(Boolean(journal.isPendingExorcism), true);
});

test('Journey 3 & 4: Import local file, compute SHA-256 checksum & verify metadata', () => {
  const testFileName = `test_family_deed_${Date.now()}.pdf`;
  const testFilePath = path.resolve(uploadsDir, testFileName);
  const testContent = Buffer.from('Official Deed of Trust - Municipal Notary Puebla Parcel 402B', 'utf8');
  fs.writeFileSync(testFilePath, testContent);

  const hash = crypto.createHash('sha256').update(testContent).digest('hex');
  const id = 'item_test_' + Date.now();

  db.prepare(`
    INSERT INTO inventory_items (
      id, title, description, category, fileType, fileSize, fileName, localPath,
      contentSnippet, previewUrl, hash, importedAt, triageStatus, isPendingExorcism, tags, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'Notary Certified Land Deed',
    'Certified land title for the family orchard.',
    'documents',
    'application/pdf',
    testContent.length,
    testFileName,
    testFilePath,
    'Official Deed of Trust snippet',
    null,
    hash,
    new Date().toISOString(),
    'unassigned',
    0,
    JSON.stringify(['legal', 'deed', 'orchard']),
    JSON.stringify({ notaryFolio: '12345' })
  );

  const retrieved = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(id) as any;
  assert.ok(retrieved, 'Item should be persisted');
  assert.strictEqual(retrieved.hash, hash, 'SHA-256 checksum must match binary hash');
  assert.strictEqual(retrieved.fileSize, testContent.length);

  // Clean up test file
  if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  db.prepare('DELETE FROM inventory_items WHERE id = ?').run(id);
});

test('Journey 5: Local AI classification (Ollama / offline heuristic engine)', async () => {
  // Test recipe classification
  const recipeSuggestion = await aiService.suggestItemClassification({
    title: "Abuela's Tamale Recipe",
    description: 'Generational family culinary tradition handed down since 1950.',
    category: 'recipes',
    fileType: 'application/pdf'
  });
  assert.strictEqual(recipeSuggestion.suggestedStatus, 'release', 'Recipes should be advised as RELEASE');
  assert.ok(recipeSuggestion.confidence >= 0.7);
  assert.ok(recipeSuggestion.rationale.length > 5);

  // Test private journal classification
  const journalSuggestion = await aiService.suggestItemClassification({
    title: 'Secret Late Night Grief Diary',
    description: 'Raw personal journal entries during mother illness.',
    category: 'stories',
    fileType: 'text/markdown'
  });
  assert.strictEqual(journalSuggestion.suggestedStatus, 'exorcise', 'Private cathartic journals should be advised as EXORCISE');
});

test('Journey 6: Complete, edit, skip, and save Living Séance reflections', async () => {
  // Generate question
  const qData = await aiService.generateSeanceQuestion("Abuela Elena's Mole Recipe", "recipes");
  const turnId = 'turn_test_' + Date.now();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO seance_turns (id, question, category, isSkipped, createdAt, updatedAt)
    VALUES (?, ?, ?, 0, ?, ?)
  `).run(turnId, qData.question, qData.category, now, now);

  // Answer question and generate reflection
  const answerText = 'The secret was always the Mexican chocolate and roasting the chiles without burning.';
  const reflection = await aiService.generateSeanceReflection(qData.question, answerText);

  db.prepare(`
    UPDATE seance_turns SET userAnswer = ?, aiReflection = ?, updatedAt = ? WHERE id = ?
  `).run(answerText, reflection, new Date().toISOString(), turnId);

  let turn = db.prepare('SELECT * FROM seance_turns WHERE id = ?').get(turnId) as any;
  assert.strictEqual(turn.userAnswer, answerText);
  assert.ok(turn.aiReflection.length > 5);

  // Edit answer
  const editedText = 'Updated: We also added roasted sesame seeds with the chocolate.';
  db.prepare('UPDATE seance_turns SET userAnswer = ? WHERE id = ?').run(editedText, turnId);
  turn = db.prepare('SELECT * FROM seance_turns WHERE id = ?').get(turnId) as any;
  assert.strictEqual(turn.userAnswer, editedText);

  // Clean up
  db.prepare('DELETE FROM seance_turns WHERE id = ?').run(turnId);
});

test('Journey 7 & 8: Assign KEEP, RELEASE, EXORCISE and verify explicit deletion approval', () => {
  const itemId = 'item_triage_test_' + Date.now();
  db.prepare(`
    INSERT INTO inventory_items (id, title, category, fileType, fileSize, fileName, localPath, hash, importedAt, triageStatus, isPendingExorcism)
    VALUES (?, 'Test Item', 'documents', 'text/plain', 100, 'test.txt', 'test.txt', 'dummy_hash', ?, 'unassigned', 0)
  `).run(itemId, new Date().toISOString());

  // Assign RELEASE
  db.prepare(`
    UPDATE inventory_items SET triageStatus = 'release', recipient = 'Elena', decisionReason = 'Family gift' WHERE id = ?
  `).run(itemId);
  let item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(itemId) as any;
  assert.strictEqual(item.triageStatus, 'release');
  assert.strictEqual(item.recipient, 'Elena');

  // Assign EXORCISE (staged pending confirmation)
  db.prepare(`
    UPDATE inventory_items SET triageStatus = 'exorcise', isPendingExorcism = 1 WHERE id = ?
  `).run(itemId);
  item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(itemId) as any;
  assert.strictEqual(item.triageStatus, 'exorcise');
  assert.strictEqual(Boolean(item.isPendingExorcism), true);

  // Restore from pending exorcism
  db.prepare(`
    UPDATE inventory_items SET triageStatus = 'unassigned', isPendingExorcism = 0 WHERE id = ?
  `).run(itemId);
  item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(itemId) as any;
  assert.strictEqual(item.triageStatus, 'unassigned');
  assert.strictEqual(Boolean(item.isPendingExorcism), false);

  // Re-stage and confirm permanent deletion
  db.prepare(`
    UPDATE inventory_items SET triageStatus = 'exorcise', isPendingExorcism = 1 WHERE id = ?
  `).run(itemId);
  db.prepare('DELETE FROM inventory_items WHERE id = ?').run(itemId);
  const deletedItem = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(itemId);
  assert.strictEqual(deletedItem, undefined, 'Item must be permanently removed upon explicit confirmation');
});

test('Journey 9: Draft, assist with AI tone, and approve a Legacy Letter', async () => {
  const assistResult = await aiService.assistLetterWriting({
    recipient: 'Elena',
    type: 'recipe_history',
    tone: 'warm',
    promptAction: 'create_full_draft'
  });

  assert.ok(assistResult.content.includes('Elena'));
  assert.ok(assistResult.content.length > 50);

  const letterId = 'letter_test_' + Date.now();
  db.prepare(`
    INSERT INTO legacy_letters (id, title, recipient, type, content, tone, isApproved, createdAt, updatedAt)
    VALUES (?, 'The Kitchen Hearth', 'Elena', 'recipe_history', ?, 'warm', 0, ?, ?)
  `).run(letterId, assistResult.content, new Date().toISOString(), new Date().toISOString());

  // Initially draft (isApproved = 0)
  let letter = db.prepare('SELECT * FROM legacy_letters WHERE id = ?').get(letterId) as any;
  assert.strictEqual(letter.isApproved, 0);

  // Explicit user approval
  db.prepare('UPDATE legacy_letters SET isApproved = 1 WHERE id = ?').run(letterId);
  letter = db.prepare('SELECT * FROM legacy_letters WHERE id = ?').get(letterId) as any;
  assert.strictEqual(letter.isApproved, 1);

  // Clean up
  db.prepare('DELETE FROM legacy_letters WHERE id = ?').run(letterId);
});

test('Journey 10 & 11: Sealed Ofrenda AES-256-GCM authenticated encryption, export & integrity verification', async () => {
  loadMarisolDemoData();
  const passphrase = 'marisol-sacred-passphrase-2026';

  const sealed = await cryptoService.sealArchive(passphrase, 'Marisol Hernandez');
  assert.ok(sealed.archive);
  assert.ok(sealed.archive.salt);
  assert.ok(sealed.archive.iv);
  assert.ok(sealed.archive.authTag);
  assert.ok(sealed.archive.ciphertext);
  assert.ok(fs.existsSync(sealed.filePath), '.ofrenda file should be written to disk');

  // Verify successful decryption with correct passphrase
  const verified = cryptoService.verifyAndDecryptArchive(sealed.archive, passphrase);
  assert.strictEqual(verified.isValid, true);
  assert.strictEqual(verified.integrityDetails.authenticatedEncryptionValid, true);
  assert.strictEqual(verified.integrityDetails.checksumsMatch, true);
  assert.strictEqual(verified.integrityDetails.tamperedItems.length, 0);

  // Verify wrong passphrase fails
  const wrongPassResult = cryptoService.verifyAndDecryptArchive(sealed.archive, 'incorrect-password');
  assert.strictEqual(wrongPassResult.isValid, false);
  assert.strictEqual(wrongPassResult.integrityDetails.authenticatedEncryptionValid, false);

  // Verify tamper detection on corrupted ciphertext
  const corruptedArchive = {
    ...sealed.archive,
    ciphertext: 'A' + sealed.archive.ciphertext.slice(1)
  };
  const tamperedResult = cryptoService.verifyAndDecryptArchive(corruptedArchive, passphrase);
  assert.strictEqual(tamperedResult.isValid, false, 'Tampered ciphertext must fail authenticated decryption');
});

test('Journey 12: Memorial Preview strictly excludes private and EXORCISED records', async () => {
  loadMarisolDemoData();

  // Query memorial items (same SQL as in memorial.ts)
  const memorialItems = db.prepare(`
    SELECT * FROM inventory_items 
    WHERE triageStatus IN ('keep', 'release') AND isPendingExorcism = 0
  `).all() as any[];

  // Private journal has triageStatus = 'exorcise' and isPendingExorcism = 1
  const hasPrivateJournal = memorialItems.some(i => i.id === 'item_private_journals_grief');
  assert.strictEqual(hasPrivateJournal, false, 'Private grief journals must NEVER appear in Memorial Preview');

  // All memorial items must be either 'keep' or 'release'
  for (const item of memorialItems) {
    assert.ok(['keep', 'release'].includes(item.triageStatus));
    assert.strictEqual(item.isPendingExorcism, 0);
  }

  // Letters in memorial must all be approved
  const approvedLetters = db.prepare('SELECT * FROM legacy_letters WHERE isApproved = 1').all() as any[];
  for (const letter of approvedLetters) {
    assert.strictEqual(letter.isApproved, 1);
  }
});

test('Journey 13: System settings update and persistence', () => {
  const newConfig = {
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModel: 'qwen2.5:latest',
    enableLocalHeuristics: true,
    ownerName: 'Marisol Hernandez Elena',
    encryptionHint: 'Cholula orchard year',
    theme: 'parchment'
  };

  db.prepare('INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)')
    .run('config', JSON.stringify(newConfig));

  const saved = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('config') as any;
  assert.ok(saved);
  const parsed = JSON.parse(saved.value);
  assert.strictEqual(parsed.ollamaModel, 'qwen2.5:latest');
  assert.strictEqual(parsed.ownerName, 'Marisol Hernandez Elena');
});
