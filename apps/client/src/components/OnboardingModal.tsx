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
  Heart
} from 'lucide-react';
import { CandleGlow } from './CandleGlow';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to The Last Login",
      subtitle: "A thoughtful, private space where technology meets memory and reverence.",
      icon: Heart,
      badge: "Core Philosophy",
      badgeColor: "bg-marigold-100 text-marigold-800 border-marigold-300",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-olive-800 leading-relaxed">
          <p>
            We live our lives across thousands of digital files—heirloom recipes, voice recordings, legal deeds, and creative projects.
          </p>
          <div className="p-4 rounded-xl bg-parchment-200 border border-parchment-300 font-serif text-base italic text-olive-950">
            "Your memories. Your wishes. Your control."
          </div>
          <p>
            This application helps living people organize their belongings, articulate their wishes, and seal an authenticated archive for those they choose.
          </p>
        </div>
      )
    },
    {
      title: "1. 100% Local Storage & Zero Cloud AI",
      subtitle: "Privacy is our core foundation, not a marketing promise.",
      icon: HardDrive,
      badge: "Absolute Privacy",
      badgeColor: "bg-sage-100 text-sage-800 border-sage-300",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-olive-800 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
              <strong className="block text-olive-950 font-serif text-sm mb-1">Local Files Only</strong>
              Files stay on your local disk. We never silently scan your drive or upload private data.
            </div>
            <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
              <strong className="block text-olive-950 font-serif text-sm mb-1">Zero Cloud AI Egress</strong>
              Local Ollama runtime or embedded offline heuristics. Zero prompts leave your computer.
            </div>
          </div>
          <p className="text-xs text-olive-600 font-mono pt-1">
            ✓ Audited: 0 bytes transmitted outside 127.0.0.1
          </p>
        </div>
      )
    },
    {
      title: "2. Living Séance: AI Assists, You Decide",
      subtitle: "Guided reflection to capture stories behind the files.",
      icon: Sparkles,
      badge: "Human Autonomy",
      badgeColor: "bg-marigold-100 text-marigold-800 border-marigold-300",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-olive-800 leading-relaxed">
          <p>
            Local AI helps prompt meaningful questions: What makes this item irreplaceable? What is the story behind this photograph?
          </p>
          <div className="p-3.5 rounded-xl bg-olive-900 text-parchment-100 font-serif text-xs leading-relaxed space-y-1">
            <span className="text-[10px] font-mono text-marigold-400 uppercase tracking-widest block font-bold">
              Strict Ethical Rule
            </span>
            <p>
              The AI never simulates deceased people or impersonates anyone. It exists solely to assist your reflection.
            </p>
          </div>
          <p>
            You can skip any question, edit past answers, or delete reflections anytime.
          </p>
        </div>
      )
    },
    {
      title: "3. Keep / Release / Exorcise",
      subtitle: "Intentional boundaries and safe deletion.",
      icon: Layers,
      badge: "Triage Decisions",
      badgeColor: "bg-terracotta-100 text-terracotta-800 border-terracotta-300",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-olive-800 leading-relaxed">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded font-bold text-[10px] font-mono bg-sage-200 text-sage-900 shrink-0">KEEP</span>
              <span>Preserve in your permanent digital estate vault for family archives.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded font-bold text-[10px] font-mono bg-marigold-200 text-marigold-950 shrink-0">RELEASE</span>
              <span>Transfer to a designated recipient (e.g. Elena, Mateo, or Public Open Source).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded font-bold text-[10px] font-mono bg-terracotta-200 text-terracotta-950 shrink-0">EXORCISE</span>
              <span>Safely exclude or delete private notes. Staged in a reversible queue before final confirmation.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "4. Sealed Ofrenda & Physical Key Escrow",
      subtitle: "Authenticated AES-256-GCM encryption with recovery sheets.",
      icon: Lock,
      badge: "Zero-Knowledge Vault",
      badgeColor: "bg-olive-800 text-parchment-50 border-olive-700",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-olive-800 leading-relaxed">
          <p>
            Approved belongings and letters are sealed into an encrypted <code className="font-mono bg-parchment-200 px-1 rounded">.ofrenda</code> container using PBKDF2 (100,000 iterations) and AES-256-GCM.
          </p>
          <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-olive-900 space-y-1">
            <strong>Physical Recovery Sheet:</strong>
            <p>
              Because zero-knowledge means there is no corporate backdoor, print your Emergency Passphrase Sheet and store it in a physical safe or with trusted counsel.
            </p>
          </div>
        </div>
      )
    }
  ];

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-olive-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="bg-parchment-100 border border-parchment-300 w-full max-w-lg rounded-2xl shadow-elevated flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-parchment-200 border-b border-parchment-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-olive-900 text-marigold-400 flex items-center justify-center shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close onboarding"
            className="p-1.5 rounded-lg text-olive-600 hover:text-olive-900 hover:bg-parchment-300 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with internal scrolling */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <h3 id="onboarding-modal-title" className="font-serif text-2xl font-bold text-olive-950 leading-tight">
              {current.title}
            </h3>
            <p className="text-xs text-olive-700 mt-0.5 font-sans">
              {current.subtitle}
            </p>
          </div>

          <div className="py-2">
            {current.content}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {steps.map((_, idx) => (
              <span
                key={idx}
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
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-parchment-200 border-t border-parchment-300 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-xs font-semibold text-olive-700 hover:text-olive-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98"
          >
            <span>{isLast ? 'Enter Estate Space' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-marigold-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
