import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  SkipForward,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MessageSquare,
  HelpCircle,
  Shield,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { clientStore } from '../services/clientStore';
import { SeanceTurn, InventoryItem } from '@the-last-login/shared';
import { CandleGlow } from '../components/CandleGlow';
import { useGhost } from '../context/GhostContext';

interface SeancePageProps {
  initialItemId?: string;
}

export const SeancePage: React.FC<SeancePageProps> = ({ initialItemId }) => {
  const [turns, setTurns] = useState<SeanceTurn[]>(() => clientStore.getSeanceTurns());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => clientStore.getInventory());
  const [activeTurn, setActiveTurn] = useState<SeanceTurn | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTurnId, setEditingTurnId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId || '');
  const { ghostCurious, ghostCelebrating, ghostAcknowledge } = useGhost();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tList, iList] = await Promise.all([
        api.getSeanceTurns(),
        api.getInventory()
      ]);
      if (tList && tList.length > 0) setTurns(tList);
      if (iList && iList.length > 0) setInventory(iList);

      const currentList = (tList && tList.length > 0) ? tList : clientStore.getSeanceTurns();
      const unanswered = currentList.find(t => !t.isSkipped && (!t.userAnswer || t.userAnswer.trim() === ''));
      if (unanswered) {
        setActiveTurn(unanswered);
      }
    } catch (e) {
      console.error('Seance load error, using local store:', e);
      setTurns(clientStore.getSeanceTurns());
      setInventory(clientStore.getInventory());
    }
  };

  const handleAskNewQuestion = async (specificItemId?: string) => {
    ghostCurious('Reflective question evoked');
    try {
      const turn = await api.askSeanceQuestion(specificItemId || selectedItemId || undefined);
      setTurns(prev => [...prev, turn]);
      setActiveTurn(turn);
      setUserAnswer('');
    } catch {
      const fallbackTurn = clientStore.askSeanceQuestion(specificItemId || selectedItemId || undefined);
      setTurns(prev => [...prev, fallbackTurn]);
      setActiveTurn(fallbackTurn);
      setUserAnswer('');
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTurn || !userAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await api.answerSeanceQuestion(activeTurn.id, userAnswer.trim());
      setTurns(prev => prev.map(t => t.id === updated.id ? updated : t));
      setUserAnswer('');
      setActiveTurn(null);
      ghostCelebrating('Reflection lovingly documented');
    } catch {
      const updated = clientStore.answerSeanceQuestion(activeTurn.id, userAnswer.trim());
      setTurns(prev => prev.map(t => t.id === updated.id ? updated : t));
      setUserAnswer('');
      setActiveTurn(null);
      ghostCelebrating('Reflection lovingly documented');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipQuestion = async (turnId: string) => {
    try {
      await api.skipSeanceQuestion(turnId);
    } catch {
      clientStore.skipSeanceQuestion(turnId);
    }
    setTurns(prev => prev.map(t => t.id === turnId ? { ...t, isSkipped: true } : t));
    if (activeTurn?.id === turnId) {
      setActiveTurn(null);
    }
  };

  const handleStartEdit = (turn: SeanceTurn) => {
    setEditingTurnId(turn.id);
    setEditText(turn.userAnswer || '');
  };

  const handleSaveEdit = async (turnId: string) => {
    try {
      await api.editSeanceAnswer(turnId, editText);
    } catch {
      clientStore.editSeanceAnswer(turnId, editText);
    }
    setTurns(prev => prev.map(t => t.id === turnId ? { ...t, userAnswer: editText } : t));
    setEditingTurnId(null);
  };

  const handleDeleteTurn = async (turnId: string) => {
    if (confirm('Delete this interview reflection?')) {
      try {
        await api.deleteSeanceTurn(turnId);
      } catch {
        clientStore.deleteSeanceTurn(turnId);
      }
      setTurns(prev => prev.filter(t => t.id !== turnId));
      if (activeTurn?.id === turnId) setActiveTurn(null);
    }
  };

  const answeredTurns = turns.filter(t => !t.isSkipped && t.userAnswer && t.userAnswer.trim().length > 0);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto min-w-0 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header & Sensitive Guidance Banner */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-olive-900 tracking-tight">
                Living Séance
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-marigold-100 text-marigold-800 border border-marigold-300">
                Guided Reflection
              </span>
            </div>
            <p className="text-xs text-olive-700 mt-1">
              An AI-guided reflective interview. Uncover the human wisdom, recipes, and boundaries behind your files.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CandleGlow size="sm" active={true} />
            <button
              onClick={() => handleAskNewQuestion()}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-marigold-400" />
              <span>Prompt Next Reflection</span>
            </button>
          </div>
        </div>

        {/* Ethical Safety Pledge Box */}
        <div className="p-3.5 rounded-2xl bg-parchment-100 border border-parchment-300 text-xs text-olive-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Shield className="w-4 h-4 text-sage-600 shrink-0" />
            <span className="leading-snug">
              <strong>Ethical Rule:</strong> The local AI assists your reflection. It never impersonates anyone or simulates the deceased.
            </span>
          </div>
          <span className="font-mono text-[11px] text-sage-700 shrink-0">
            {answeredTurns.length} Reflections Documented
          </span>
        </div>
      </div>

      {/* Target a Specific Inventory Item dropdown */}
      <div className="p-4 rounded-2xl bg-parchment-100 border border-parchment-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-olive-900">
          Focus interview on a specific digital possession:
        </span>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="px-3 py-2 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-olive-900 focus:outline-none focus:ring-2 focus:ring-marigold-500 w-full sm:w-64"
          >
            <option value="">-- General Legacy Reflection --</option>
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.category})
              </option>
            ))}
          </select>
          <button
            onClick={() => handleAskNewQuestion(selectedItemId)}
            className="px-3.5 py-2 bg-sage-600 hover:bg-sage-500 text-parchment-50 rounded-xl font-medium shrink-0 transition-colors text-center focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            Ask About This
          </button>
        </div>
      </div>

      {/* Active Question Prompt Card (Inspired by Media 4 Chat) */}
      {activeTurn ? (
        <div className="rounded-3xl bg-olive-900 text-parchment-50 p-6 md:p-8 shadow-elevated border border-olive-800 space-y-6">
          <div className="flex items-center justify-between border-b border-olive-800/80 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-marigold-400">
              <Sparkles className="w-4 h-4" />
              <span>CURRENT REFLECTION PROMPT • {activeTurn.category.toUpperCase()}</span>
            </div>
            {activeTurn.associatedItemTitle && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-olive-800 text-sage-300 border border-olive-700">
                Item: {activeTurn.associatedItemTitle}
              </span>
            )}
          </div>

          {/* Question Text */}
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-parchment-50 leading-relaxed">
            "{activeTurn.question}"
          </h3>

          {/* Answer Form */}
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Take your time. Speak in your own voice, share the story, or explain what should happen to this..."
              className="w-full p-4 bg-olive-950/80 border border-olive-700 rounded-2xl text-sm text-parchment-50 placeholder-olive-400 focus:outline-none focus:ring-2 focus:ring-marigold-500 leading-relaxed"
              required
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleSkipQuestion(activeTurn.id)}
                className="flex items-center gap-1.5 text-xs text-parchment-400 hover:text-parchment-100 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip this question (No pressure)</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !userAnswer.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-marigold-500 hover:bg-marigold-400 text-olive-950 font-semibold rounded-xl text-sm shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Record Reflection'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-parchment-100 border border-parchment-300 space-y-3">
          <HeartHandshake className="w-8 h-8 mx-auto text-sage-600" />
          <h4 className="font-serif text-lg font-bold text-olive-900">
            All Current Questions Answered
          </h4>
          <p className="text-xs text-olive-700 max-w-md mx-auto">
            You have answered all prompted questions in this session. Feel free to generate another reflection prompt or review past answers below.
          </p>
          <button
            onClick={() => handleAskNewQuestion()}
            className="px-4 py-2 bg-olive-900 text-parchment-50 rounded-xl text-xs font-semibold"
          >
            Ask Another Question
          </button>
        </div>
      )}

      {/* Complete Interview Log / Transcript Mode */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-olive-900">
          Documented Legacy Reflections ({answeredTurns.length})
        </h3>

        {answeredTurns.length === 0 ? (
          <p className="text-xs text-olive-600 italic">No answered questions yet.</p>
        ) : (
          <div className="space-y-4">
            {answeredTurns.map((turn) => {
              const isEditing = editingTurnId === turn.id;
              return (
                <div
                  key={turn.id}
                  className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card space-y-4"
                >
                  {/* Category & Date */}
                  <div className="flex items-center justify-between text-xs font-mono text-olive-600">
                    <span className="uppercase font-semibold text-sage-700">
                      {turn.category}
                      {turn.associatedItemTitle && ` • ${turn.associatedItemTitle}`}
                    </span>
                    <span>{new Date(turn.updatedAt).toLocaleDateString()}</span>
                  </div>

                  {/* Question */}
                  <h4 className="font-serif font-bold text-base text-olive-900">
                    {turn.question}
                  </h4>

                  {/* User Answer or Editor */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 bg-parchment-50 border border-parchment-300 rounded-xl text-xs text-olive-900 focus:outline-none focus:ring-2 focus:ring-marigold-500"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingTurnId(null)}
                          className="px-3 py-1 text-xs text-olive-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(turn.id)}
                          className="px-4 py-1 bg-olive-900 text-parchment-50 rounded-lg text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-olive-900 leading-relaxed font-sans bg-parchment-50 p-4 rounded-xl border border-parchment-200">
                      {turn.userAnswer}
                    </p>
                  )}

                  {/* AI Empathetic Reflection */}
                  {turn.aiReflection && (
                    <div className="p-3 rounded-xl bg-sage-50 border border-sage-200 text-xs text-olive-800 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-marigold-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-olive-900 font-mono text-[10px] uppercase block">
                          AI Observation & Context
                        </span>
                        <p className="italic">{turn.aiReflection}</p>
                      </div>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="pt-2 flex items-center justify-end gap-3 text-xs text-olive-600 border-t border-parchment-200">
                    <button
                      onClick={() => handleStartEdit(turn)}
                      className="hover:text-olive-900 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Answer</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTurn(turn.id)}
                      className="hover:text-terracotta-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
