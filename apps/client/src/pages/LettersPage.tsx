import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  Plus,
  Sparkles,
  CheckCircle,
  Eye,
  Trash2,
  Send,
  User,
  Heart,
  FileCheck,
  Feather,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { clientStore } from '../services/clientStore';
import { LegacyLetter, LetterTone, LetterType } from '@the-last-login/shared';

export const LettersPage: React.FC = () => {
  const initialList = clientStore.getLetters();
  const [letters, setLetters] = useState<LegacyLetter[]>(() => initialList);
  const [activeLetter, setActiveLetter] = useState<LegacyLetter | null>(() => initialList[0] || null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAssisting, setIsAssisting] = useState(false);
  const [aiNotes, setAiNotes] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form states
  const [title, setTitle] = useState(() => initialList[0]?.title || '');
  const [recipient, setRecipient] = useState(() => initialList[0]?.recipient || '');
  const [type, setType] = useState<LetterType>(() => initialList[0]?.type || 'personal');
  const [tone, setTone] = useState<LetterTone>(() => initialList[0]?.tone || 'reflective');
  const [content, setContent] = useState(() => initialList[0]?.content || '');

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const list = await api.getLetters();
      setLetters(list);
      if (list.length > 0 && !activeLetter) {
        selectLetter(list[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectLetter = (letter: LegacyLetter) => {
    setActiveLetter(letter);
    setIsCreating(false);
    setTitle(letter.title);
    setRecipient(letter.recipient);
    setType(letter.type);
    setTone(letter.tone);
    setContent(letter.content);
    setAiNotes(null);
  };

  const handleStartNew = () => {
    setActiveLetter(null);
    setIsCreating(true);
    setTitle('');
    setRecipient('');
    setType('personal');
    setTone('reflective');
    setContent('');
    setAiNotes(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !recipient.trim()) {
      alert('Please provide a Title and Recipient');
      return;
    }

    try {
      if (activeLetter) {
        await api.updateLetter(activeLetter.id, {
          title,
          recipient,
          type,
          tone,
          content
        });
        setLetters(prev => prev.map(l => l.id === activeLetter.id ? {
          ...l,
          title,
          recipient,
          type,
          tone,
          content
        } : l));
      } else {
        const created = await api.createLetter({
          title,
          recipient,
          type,
          tone,
          content
        });
        setLetters(prev => [created, ...prev]);
        setActiveLetter(created);
        setIsCreating(false);
      }
    } catch (e) {
      alert('Failed to save letter');
    }
  };

  const handleToggleApprove = async () => {
    if (!activeLetter) return;
    const newStatus = !activeLetter.isApproved;
    try {
      await api.approveLetter(activeLetter.id, newStatus);
      setActiveLetter({ ...activeLetter, isApproved: newStatus });
      setLetters(prev => prev.map(l => l.id === activeLetter.id ? { ...l, isApproved: newStatus } : l));
    } catch (e) {
      alert('Failed to toggle approval status');
    }
  };

  const handleDelete = async () => {
    if (!activeLetter) return;
    if (confirm(`Delete draft letter "${activeLetter.title}"?`)) {
      try {
        await api.deleteLetter(activeLetter.id);
        const remaining = letters.filter(l => l.id !== activeLetter.id);
        setLetters(remaining);
        if (remaining.length > 0) selectLetter(remaining[0]);
        else handleStartNew();
      } catch (e) {
        alert('Failed to delete letter');
      }
    }
  };

  const handleAIAssist = async (action: 'draft_opening' | 'deepen_memory' | 'polish_tone' | 'create_full_draft') => {
    setIsAssisting(true);
    try {
      const res = await api.assistLetter({
        recipient: recipient || 'Family',
        type,
        tone,
        promptAction: action,
        currentContent: content
      });

      if (action === 'create_full_draft' || !content.trim()) {
        setContent(res.content);
      } else {
        setContent(prev => `${prev}\n\n${res.content}`);
      }
      setAiNotes(res.notes);
    } catch (e) {
      alert('Local AI assistance failed');
    } finally {
      setIsAssisting(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto min-w-0 space-y-5 sm:space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-olive-900 tracking-tight">
            Legacy Letters
          </h2>
          <p className="text-xs sm:text-sm text-olive-700 mt-1">
            Compassionate writing workspace. AI assists with drafts; only user-approved letters enter the sealed archive.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="flex items-center gap-2 px-4 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-marigold-400" />
          <span>New Letter Draft</span>
        </button>
      </div>

      {/* Main Workspace Layout (Sidebar + Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
        {/* Left Column: Drafts List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-4 shadow-soft-card space-y-2">
            <span className="text-xs font-mono uppercase text-olive-600 font-semibold px-2">
              Your Written Letters ({letters.length})
            </span>

            <div className="space-y-1.5 max-h-[220px] lg:max-h-[600px] overflow-y-auto">
              {letters.map((letter) => {
                const isSelected = activeLetter?.id === letter.id && !isCreating;
                return (
                  <div
                    key={letter.id}
                    onClick={() => selectLetter(letter)}
                    className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-parchment-50 border-marigold-500 shadow-sm'
                        : 'bg-parchment-100 hover:bg-parchment-200 border-parchment-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono uppercase font-bold text-sage-700">
                        {letter.type.replace('_', ' ')}
                      </span>
                      {letter.isApproved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sage-200 text-sage-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-sage-700" />
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-parchment-300 text-olive-700">
                          Draft
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-sm text-olive-900 leading-snug truncate">
                      {letter.title}
                    </h4>
                    <p className="text-xs text-olive-600 truncate mt-0.5">
                      To: {letter.recipient}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Editor Workspace (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card space-y-6">
          {/* Header & Status Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-parchment-300">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-sage-700 font-semibold">
                {activeLetter ? (activeLetter.isApproved ? 'Approved Archive Letter' : 'Draft In Progress') : 'New Letter Workspace'}
              </span>
              <h3 className="font-serif text-2xl font-bold text-olive-900">
                {title || 'Untitled Letter'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-3 py-1.5 rounded-xl border border-parchment-300 text-xs font-medium text-olive-800 hover:bg-parchment-200 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{previewMode ? 'Edit Mode' : 'Preview Paper'}</span>
              </button>

              {activeLetter && (
                <button
                  onClick={handleToggleApprove}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeLetter.isApproved
                      ? 'bg-sage-600 text-parchment-50 shadow-md'
                      : 'bg-parchment-200 text-olive-800 hover:bg-sage-200'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{activeLetter.isApproved ? 'Sealed for Archive' : 'Approve for Archive'}</span>
                </button>
              )}
            </div>
          </div>

          {previewMode ? (
            /* Parchment Paper Preview Mode */
            <div className="bg-parchment-50 p-8 rounded-2xl border border-parchment-300 shadow-inner font-serif space-y-6 max-w-2xl mx-auto">
              <div className="border-b border-olive-900/15 pb-4">
                <span className="text-xs font-mono text-olive-600 uppercase block mb-1">
                  Recipient: {recipient}
                </span>
                <h2 className="text-3xl font-bold text-olive-950">
                  {title}
                </h2>
              </div>

              <div className="text-base sm:text-lg text-olive-950 leading-relaxed whitespace-pre-line font-serif">
                {content || '[ This letter draft is empty. ]'}
              </div>

              <div className="pt-6 border-t border-olive-900/15 text-right italic text-sm text-olive-800">
                — Preserved in The Last Login Digital Ofrenda
              </div>
            </div>
          ) : (
            /* Drafting Form */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                    Letter Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. To Elena: The Kitchen Altar"
                    className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500 font-serif font-bold text-olive-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                    Designated Recipient *
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. Elena (Daughter), Open Source Stewards"
                    className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500 text-olive-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                    Letter Theme
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as LetterType)}
                    className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-olive-900 focus:outline-none focus:ring-2 focus:ring-marigold-500 font-medium"
                  >
                    <option value="personal">Personal Letter to Loved One</option>
                    <option value="family_story">Family Story or Memory</option>
                    <option value="recipe_history">Recipe History & Culinary Heritage</option>
                    <option value="photo_reflection">Photograph Reflection</option>
                    <option value="project_handover">Project or Code Handover</option>
                    <option value="instructions">Final Instructions for Recipient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                    Tone of Voice
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as LetterTone)}
                    className="w-full px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-olive-900 focus:outline-none focus:ring-2 focus:ring-marigold-500 font-medium"
                  >
                    <option value="reflective">Reflective & Warm</option>
                    <option value="gentle">Gentle & Encouraging</option>
                    <option value="practical">Practical & Direct</option>
                    <option value="warm">Heartfelt & Loving</option>
                  </select>
                </div>
              </div>

              {/* Local AI Writing Assistant Pills */}
              <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-olive-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-marigold-600" />
                  Local AI Co-Writer:
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isAssisting}
                    onClick={() => handleAIAssist('draft_opening')}
                    className="px-2.5 py-1 bg-parchment-100 hover:bg-parchment-200 border border-sage-300 rounded-lg text-olive-900 font-medium transition-colors"
                  >
                    Brainstorm Opening
                  </button>
                  <button
                    type="button"
                    disabled={isAssisting}
                    onClick={() => handleAIAssist('deepen_memory')}
                    className="px-2.5 py-1 bg-parchment-100 hover:bg-parchment-200 border border-sage-300 rounded-lg text-olive-900 font-medium transition-colors"
                  >
                    Deepen Reflection
                  </button>
                  <button
                    type="button"
                    disabled={isAssisting}
                    onClick={() => handleAIAssist('create_full_draft')}
                    className="px-2.5 py-1 bg-marigold-500 hover:bg-marigold-400 text-olive-950 rounded-lg font-semibold transition-colors shadow-sm"
                  >
                    Generate Full Draft
                  </button>
                </div>
              </div>

              {aiNotes && (
                <p className="text-[11px] font-mono text-sage-800 italic px-1">
                  💡 {aiNotes}
                </p>
              )}

              {/* Textarea */}
              <div>
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your words here. Speak from the heart..."
                  className="w-full p-4 bg-parchment-50 border border-parchment-300 rounded-2xl text-sm text-olive-950 focus:outline-none focus:ring-2 focus:ring-marigold-500 leading-relaxed font-serif"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-parchment-300">
                {activeLetter ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 text-xs text-terracotta-700 hover:text-terracotta-900 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Draft</span>
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-98"
                >
                  Save Letter Draft
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
