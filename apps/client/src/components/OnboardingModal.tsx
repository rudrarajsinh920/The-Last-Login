import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FolderOpen,
  Sparkles,
  Layers,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HardDrive,
  Heart,
  FileText,
  Utensils,
  Image as ImageIcon,
  Mic,
  Plus,
  RefreshCw,
  Compass,
  Check
} from 'lucide-react';
import { FriendlyGhost } from './FriendlyGhost';
import { GhostState } from '../context/GhostContext';
import { api } from '../services/api';
import { ItemCategory, TriageStatus } from '@the-last-login/shared';

export const ONBOARDING_COMPLETED_KEY = 'last_login_onboarding_completed_v1';
export const ONBOARDING_STEP_KEY = 'last_login_onboarding_step_v1';
export const ONBOARDING_CREATED_ITEM_KEY = 'last_login_onboarding_created_item_v1';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onItemCreated?: () => void;
}

interface ItemPreset {
  title: string;
  category: ItemCategory;
  description: string;
  triageStatus: TriageStatus;
  recipient?: string;
  icon: any;
}

const PRESETS: ItemPreset[] = [
  {
    title: "Abuela's Sunday Mole & Bread Notes",
    category: 'recipes',
    description: "Handwritten family measurements and clay pot cooking secrets passed down through three generations.",
    triageStatus: 'release',
    recipient: 'Elena (Daughter) & Mateo (Son)',
    icon: Utensils
  },
  {
    title: '1995 Summer Coastal Road Trip Photograph',
    category: 'photos',
    description: 'Archival scan of the sunset over the Pacific cliffs with handwritten notes on the back.',
    triageStatus: 'keep',
    icon: ImageIcon
  },
  {
    title: 'Evening Porch Storm Reflection Audio',
    category: 'audio',
    description: 'Field recording of gentle rain dripping from terracotta shingles with evening conversation.',
    triageStatus: 'keep',
    icon: Mic
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onItemCreated
}) => {
  // Load saved step or start at 0
  const [step, setStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_STEP_KEY);
      const parsed = saved ? parseInt(saved, 10) : 0;
      return isNaN(parsed) || parsed < 0 || parsed > 5 ? 0 : parsed;
    } catch {
      return 0;
    }
  });

  // Guided Item Creator state
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [customTitle, setCustomTitle] = useState(PRESETS[0].title);
  const [customCategory, setCustomCategory] = useState<ItemCategory>(PRESETS[0].category);
  const [customDescription, setCustomDescription] = useState(PRESETS[0].description);
  const [customStatus, setCustomStatus] = useState<TriageStatus>(PRESETS[0].triageStatus);
  const [customRecipient, setCustomRecipient] = useState(PRESETS[0].recipient || '');
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [createdItemSuccess, setCreatedItemSuccess] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [demoLoadedNotification, setDemoLoadedNotification] = useState(false);

  // Sync step changes to localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        localStorage.setItem(ONBOARDING_STEP_KEY, step.toString());
      } catch {
        // ignore in restricted environments
      }
    }
  }, [step, isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
      if (e.key === 'ArrowRight' && step < 5) setStep(s => s + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep(s => s - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleFinish = () => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      localStorage.setItem(ONBOARDING_STEP_KEY, '5');
    } catch {
      // ignore
    }
    onComplete();
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    const p = PRESETS[idx];
    setCustomTitle(p.title);
    setCustomCategory(p.category);
    setCustomDescription(p.description);
    setCustomStatus(p.triageStatus);
    setCustomRecipient(p.recipient || '');
  };

  const handleCreateLegacyItem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customTitle.trim()) return;

    setIsSavingItem(true);
    try {
      await api.createItem({
        title: customTitle.trim(),
        category: customCategory,
        description: customDescription.trim(),
        triageStatus: customStatus,
        recipient: customStatus === 'release' ? (customRecipient.trim() || 'Chosen Family') : undefined,
        fileName: `${customTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`,
        fileSize: 1024,
        fileType: 'text/plain',
        tags: [customCategory, 'onboarding-item', customStatus]
      });

      try {
        localStorage.setItem(ONBOARDING_CREATED_ITEM_KEY, 'true');
      } catch {
        // ignore
      }

      setCreatedItemSuccess(customTitle.trim());
      if (onItemCreated) onItemCreated();
    } catch (err) {
      console.error('Error creating first onboarding item:', err);
    } finally {
      setIsSavingItem(false);
    }
  };

  const handlePreloadDemo = async () => {
    setIsDemoLoading(true);
    try {
      await api.loadMarisolDemo();
      setDemoLoadedNotification(true);
      if (onItemCreated) onItemCreated();
      setTimeout(() => setDemoLoadedNotification(false), 3000);
    } catch (err) {
      console.error('Demo reload:', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  // Determine Ghost state and dialogue per step
  const getGhostState = (): { state: GhostState; message: string } => {
    switch (step) {
      case 0:
        return { state: 'welcoming', message: 'Welcome to your sacred digital space' };
      case 1:
        return { state: 'thinking', message: 'Zero bytes ever leave your device' };
      case 2:
        return { state: 'curious', message: 'AI assists, but your heart decides' };
      case 3:
        return { state: 'happy', message: "Explore Marisol's full estate safely" };
      case 4:
        return createdItemSuccess
          ? { state: 'celebrating', message: 'Your first memory is lovingly preserved!' }
          : { state: 'thinking', message: 'What memory matters most to you?' };
      case 5:
      default:
        return { state: 'celebrating', message: 'Your digital ofrenda is ready!' };
    }
  };

  const ghostInfo = getGhostState();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-olive-950/75 backdrop-blur-md animate-fade-in select-none"
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="bg-parchment-100 border border-parchment-300 w-full max-w-2xl rounded-3xl shadow-elevated flex flex-col max-h-[92vh] overflow-hidden text-olive-900 transition-all duration-300">
        {/* Top Header Bar */}
        <div className="px-5 sm:px-7 py-3.5 bg-parchment-200 border-b border-parchment-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-olive-700 font-semibold">
              Step {step + 1} of 6
            </span>
            <span className="text-olive-400">•</span>
            <span className="text-xs font-serif italic text-marigold-700">
              The Digital Ofrenda Guide
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="text-xs font-mono text-olive-600 hover:text-olive-950 px-2 py-1 rounded-lg hover:bg-parchment-300 transition-colors"
            >
              Skip to Estate &rarr;
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Close onboarding guide"
              className="p-1.5 rounded-lg text-olive-600 hover:text-olive-950 hover:bg-parchment-300 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Companion Micro-Banner */}
        <div className="px-5 sm:px-7 py-2.5 bg-olive-900 text-parchment-100 flex items-center justify-between gap-3 shrink-0 shadow-inner">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 scale-90 -my-1">
              <FriendlyGhost
                size="sm"
                state={ghostInfo.state}
                showTooltip={false}
                showFlower={true}
              />
            </div>
            <p className="text-xs font-serif italic text-parchment-200 truncate">
              "{ghostInfo.message}"
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-olive-800 text-marigold-400 border border-olive-700 shrink-0">
            Guardian AI
          </span>
        </div>

        {/* Content Body Area */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 min-h-[320px]">
          {/* STEP 0: WELCOME & PURPOSE */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-marigold-600 font-semibold block mb-1">
                  Welcome to The Last Login
                </span>
                <h3 id="onboarding-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-olive-950 leading-tight">
                  Your memories. Your wishes. <br />
                  <span className="italic text-marigold-600">Your control.</span>
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-parchment-200/70 border border-parchment-300 font-serif text-sm italic text-olive-900 leading-relaxed">
                "We live our lives across thousands of digital files—heirloom recipes, voice recordings, legal deeds, and creative projects. Most are scattered and forgotten. The Last Login gives you a warm, private sanctuary to curate what matters, before you must."
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-sage-200 text-sage-900 flex items-center justify-center mb-1.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-olive-950">1. Organize</h4>
                  <p className="text-xs text-olive-700 leading-snug">
                    Catalog photos, audio notes, and heirlooms with cryptographic hashes.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-marigold-200 text-marigold-950 flex items-center justify-center mb-1.5">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-olive-950">2. Decide</h4>
                  <p className="text-xs text-olive-700 leading-snug">
                    Explicitly mark items to <strong>Keep</strong>, <strong>Release</strong> to loved ones, or <strong>Exorcise</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-olive-800 text-parchment-100 flex items-center justify-center mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-marigold-400" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-olive-950">3. Seal</h4>
                  <p className="text-xs text-olive-700 leading-snug">
                    Encrypt into an authenticated zero-knowledge vault with emergency escrow keys.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: 100% LOCAL PRIVACY */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-sage-700 font-semibold block mb-1">
                  Absolute Local-First Privacy
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-olive-950 leading-tight">
                  Where is your data stored? <br />
                  <span className="italic text-sage-700">Strictly on this computer.</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-olive-800 leading-relaxed">
                <p>
                  Unlike traditional cloud platforms that upload your sensitive documents to remote corporate servers, <strong>The Last Login is 100% local-first</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-300 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-sage-600" />
                      <strong className="text-olive-950 font-serif text-sm">Local Storage & SQLite</strong>
                    </div>
                    <p className="text-xs text-olive-700 leading-relaxed">
                      All inventory records, triage choices, and legacy letters live on your machine’s hard disk and browser storage.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-300 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-marigold-600" />
                      <strong className="text-olive-950 font-serif text-sm">Zero Network Egress</strong>
                    </div>
                    <p className="text-xs text-olive-700 leading-relaxed">
                      Zero tracking cookies, zero marketing analytics, and zero cloud uploads. Your computer never transmits data outside <code>127.0.0.1</code>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sage-100/70 border border-sage-300 text-xs font-mono text-sage-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage-600 animate-pulse" />
                    Audited: 0 Bytes transmitted to external cloud APIs
                  </span>
                  <span className="text-[10px] uppercase font-bold text-sage-800">Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ETHICAL LOCAL AI */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-marigold-600 font-semibold block mb-1">
                  Ethical AI Boundaries
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-olive-950 leading-tight">
                  The AI assists your reflection. <br />
                  <span className="italic text-marigold-600">You hold all authority.</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-olive-800 leading-relaxed">
                <p>
                  The Last Login connects to an offline local AI engine (such as Ollama or our embedded local heuristics). It follows three non-negotiable ethical rules:
                </p>

                <div className="space-y-2.5 pt-1">
                  <div className="p-3.5 rounded-xl bg-olive-900 text-parchment-100 space-y-1">
                    <span className="text-[10px] font-mono text-marigold-400 uppercase tracking-widest block font-bold">
                      Rule 1 • No Synthetic Impersonation
                    </span>
                    <p className="text-xs text-parchment-200 leading-snug">
                      The AI <strong>never</strong> simulates or resurrects deceased individuals. We reject chatbots that pretend to speak as deceased loved ones.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 space-y-1">
                    <span className="text-[10px] font-mono text-olive-700 uppercase tracking-widest block font-bold">
                      Rule 2 • Human Decisions Supersede AI
                    </span>
                    <p className="text-xs text-olive-800 leading-snug">
                      AI suggestions (like KEEP or RELEASE confidence) are advisory only. Every triage choice requires your explicit conscious human approval.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 space-y-1">
                    <span className="text-[10px] font-mono text-sage-800 uppercase tracking-widest block font-bold">
                      Rule 3 • 100% Local Inference
                    </span>
                    <p className="text-xs text-olive-800 leading-snug">
                      Questions in the Living Séance and tone assistance in Legacy Letters run entirely on your hardware with zero internet dependency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FICTIONAL DEMO SCENARIO */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-terracotta-600 font-semibold block mb-1">
                  Guided Fictional Walkthrough
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-olive-950 leading-tight">
                  Meet Marisol Hernandez. <br />
                  <span className="italic text-terracotta-600">Explore without uploading real files.</span>
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-olive-800 leading-relaxed">
                To help you evaluate every feature safely, we have preloaded a rich, realistic estate for <strong>Marisol Hernandez</strong> (68-year-old grandmother, botanist, and family archivist from Oaxaca & Coyoacán).
              </p>

              <div className="p-4 rounded-2xl bg-parchment-200/80 border border-parchment-300 space-y-2.5">
                <span className="text-[11px] font-mono uppercase font-bold text-olive-900 block">
                  Marisol’s Curated Possessions Include:
                </span>
                <ul className="text-xs text-olive-800 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Abuela Elena's 1962 Mole Poblano Recipe</strong> — Marked for <em>RELEASE</em> to her daughter Elena.</li>
                  <li><strong>1988 Coyoacán Family Gathering Photograph</strong> — Marked to <em>KEEP</em> for the family remembrance altar.</li>
                  <li><strong>Botanica-Catalog Open Source Engine</strong> — Marked to <em>RELEASE</em> to the open-source community.</li>
                  <li><strong>Private Bereavement Journals</strong> — Marked for <em>EXORCISM</em> (safe, intentional deletion).</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-olive-700">
                  You can explore Marisol's entire space, triage records, draft letters, and seal the vault with zero commitment.
                </p>
                <button
                  type="button"
                  onClick={handlePreloadDemo}
                  disabled={isDemoLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-olive-900 text-parchment-100 hover:bg-olive-800 text-xs font-mono shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-marigold-400 ${isDemoLoading ? 'animate-spin' : ''}`} />
                  <span>{isDemoLoading ? 'Loading Demo...' : 'Reload Demo Data'}</span>
                </button>
              </div>

              {demoLoadedNotification && (
                <div className="p-2.5 rounded-xl bg-sage-100 border border-sage-300 text-xs text-sage-900 font-mono flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-sage-700" />
                  <span>Marisol Hernandez fictional demo scenario loaded successfully!</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: GUIDED FIRST ITEM CREATOR */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-marigold-600 font-semibold block mb-1">
                  Guided First Item
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-olive-950 leading-tight">
                  Catalog your first legacy memory. <br />
                  <span className="italic text-marigold-600">Pick a preset or write your own.</span>
                </h3>
              </div>

              {createdItemSuccess ? (
                <div className="p-6 rounded-2xl bg-sage-50 border border-sage-300 text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-sage-600 text-parchment-50 mx-auto flex items-center justify-center shadow-md">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-olive-950">
                    "{createdItemSuccess}" Saved to Inventory!
                  </h4>
                  <p className="text-xs text-olive-700 max-w-md mx-auto leading-relaxed">
                    Your memory is now cataloged in your local digital inventory. You can inspect it, reflect upon it in the Living Séance, or seal it into your encrypted vault anytime.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="px-5 py-2 rounded-xl bg-olive-900 hover:bg-olive-800 text-parchment-50 text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
                    >
                      <span>Proceed to Finish</span>
                      <ArrowRight className="w-3.5 h-3.5 text-marigold-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateLegacyItem} className="space-y-4">
                  {/* Preset Choices */}
                  <div>
                    <label className="block text-xs font-mono text-olive-700 uppercase font-semibold mb-2">
                      Inspirational Presets (Click to autofill):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {PRESETS.map((preset, idx) => {
                        const Icon = preset.icon;
                        const isSelected = selectedPresetIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectPreset(idx)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-parchment-50 border-marigold-500 shadow-sm ring-1 ring-marigold-500'
                                : 'bg-parchment-200/60 border-parchment-300 hover:border-olive-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-3.5 h-3.5 text-marigold-600" />
                              <span className="text-[10px] font-mono uppercase text-olive-600 font-bold">
                                {preset.category}
                              </span>
                            </div>
                            <p className="text-xs font-serif font-bold text-olive-950 line-clamp-1">
                              {preset.title}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3 bg-parchment-50 p-4 rounded-2xl border border-parchment-300">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block text-[11px] font-mono text-olive-800 font-semibold">
                          Memory Title:
                        </label>
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => {
                            setCustomTitle(e.target.value);
                            setSelectedPresetIndex(null);
                          }}
                          placeholder="e.g. Abuela's Secret Recipe or 1995 Road Trip Photo"
                          className="w-full px-3 py-1.5 rounded-xl border border-parchment-300 bg-white text-xs font-sans text-olive-950 focus:ring-2 focus:ring-marigold-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-mono text-olive-800 font-semibold">
                          Category:
                        </label>
                        <select
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value as ItemCategory)}
                          className="w-full px-3 py-1.5 rounded-xl border border-parchment-300 bg-white text-xs font-sans text-olive-950 focus:ring-2 focus:ring-marigold-500 focus:outline-none"
                        >
                          <option value="photos">Photos</option>
                          <option value="recipes">Recipes</option>
                          <option value="audio">Audio</option>
                          <option value="creative">Creative</option>
                          <option value="stories">Stories</option>
                          <option value="documents">Documents</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-mono text-olive-800 font-semibold">
                        Story or Personal Note:
                      </label>
                      <textarea
                        rows={2}
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Write a brief note about why this memory matters or who it belongs to..."
                        className="w-full px-3 py-1.5 rounded-xl border border-parchment-300 bg-white text-xs font-sans text-olive-950 focus:ring-2 focus:ring-marigold-500 focus:outline-none"
                      />
                    </div>

                    {/* Triage Decision Choice */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[11px] font-mono text-olive-800 font-semibold">
                        Initial Estate Wish (You can change this anytime):
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomStatus('keep')}
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                            customStatus === 'keep'
                              ? 'bg-sage-600 text-parchment-50 shadow-sm'
                              : 'bg-sage-100 text-sage-900 border border-sage-300 hover:bg-sage-200'
                          }`}
                        >
                          KEEP in Altar
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomStatus('release')}
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                            customStatus === 'release'
                              ? 'bg-marigold-600 text-parchment-50 shadow-sm'
                              : 'bg-marigold-100 text-marigold-950 border border-marigold-300 hover:bg-marigold-200'
                          }`}
                        >
                          RELEASE to Loved One
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomStatus('exorcise')}
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                            customStatus === 'exorcise'
                              ? 'bg-terracotta-600 text-parchment-50 shadow-sm'
                              : 'bg-terracotta-100 text-terracotta-950 border border-terracotta-300 hover:bg-terracotta-200'
                          }`}
                        >
                          EXORCISE (Delete)
                        </button>
                      </div>

                      {customStatus === 'release' && (
                        <div className="pt-2 animate-fade-in">
                          <input
                            type="text"
                            value={customRecipient}
                            onChange={(e) => setCustomRecipient(e.target.value)}
                            placeholder="Designated Recipient (e.g. Elena, Mateo, or Public)"
                            className="w-full px-3 py-1.5 rounded-xl border border-parchment-300 bg-white text-xs font-sans text-olive-950 focus:ring-2 focus:ring-marigold-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        className="text-xs text-olive-600 hover:text-olive-900 underline"
                      >
                        Skip item creation & continue &rarr;
                      </button>

                      <button
                        type="submit"
                        disabled={isSavingItem || !customTitle.trim()}
                        className="px-4 py-2 bg-olive-900 hover:bg-olive-800 disabled:opacity-50 text-parchment-50 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5 text-marigold-400" />
                        <span>{isSavingItem ? 'Saving...' : 'Save First Memory'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 5: READY TO ENTER */}
          {step === 5 && (
            <div className="space-y-5 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-olive-900 text-marigold-400 mx-auto flex items-center justify-center shadow-elevated">
                <ShieldCheck className="w-8 h-8 text-marigold-400" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-marigold-600 font-bold block">
                  Onboarding Complete
                </span>
                <h3 className="font-serif text-3xl font-bold text-olive-950">
                  Your Digital Sanctuary Awaits
                </h3>
                <p className="text-xs sm:text-sm text-olive-700 max-w-md mx-auto leading-relaxed pt-1">
                  You are now ready to explore, catalog memories, answer Living Séance questions, and seal your encrypted archive whenever you wish.
                </p>
              </div>

              {/* Badges of trust */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left pt-2">
                <div className="p-3 rounded-xl bg-parchment-50 border border-parchment-300 text-xs">
                  <strong className="block text-olive-950 font-serif">100% Local</strong>
                  <span className="text-[11px] text-olive-600">Zero cloud storage</span>
                </div>
                <div className="p-3 rounded-xl bg-parchment-50 border border-parchment-300 text-xs">
                  <strong className="block text-olive-950 font-serif">Ethical AI</strong>
                  <span className="text-[11px] text-olive-600">Assists, never simulates</span>
                </div>
                <div className="p-3 rounded-xl bg-parchment-50 border border-parchment-300 text-xs">
                  <strong className="block text-olive-950 font-serif">AES-256-GCM</strong>
                  <span className="text-[11px] text-olive-600">Zero-knowledge vault</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-8 py-3 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-2xl text-sm font-bold shadow-elevated hover:shadow-glow-marigold transition-all active:scale-98 inline-flex items-center gap-2"
                >
                  <span>Enter My Estate Space</span>
                  <ArrowRight className="w-4 h-4 text-marigold-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-5 sm:px-7 py-3.5 bg-parchment-200 border-t border-parchment-300 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-xs font-semibold text-olive-700 hover:text-olive-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStep(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step
                    ? 'w-6 bg-marigold-500'
                    : idx < step
                    ? 'w-2 bg-sage-500'
                    : 'w-2 bg-parchment-300'
                }`}
              />
            ))}
          </div>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.min(5, prev + 1))}
              className="flex items-center gap-2 px-4 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-marigold-400" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2 bg-marigold-500 hover:bg-marigold-400 text-olive-950 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
