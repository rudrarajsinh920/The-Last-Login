import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  FolderOpen,
  Sparkles,
  Layers,
  ScrollText,
  Lock,
  ArrowRight,
  Heart,
  CheckCircle2,
  HardDrive,
  Compass
} from 'lucide-react';
import { CandleGlow } from '../components/CandleGlow';
import { PapelPicadoBanner } from '../components/PapelPicadoBanner';
import { OnboardingModal } from '../components/OnboardingModal';
import { api } from '../services/api';

interface LandingPageProps {
  navigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleLoadDemoAndEnter = async () => {
    try {
      await api.loadMarisolDemo();
    } catch (e) {
      // Continue anyway
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-parchment-200 text-olive-900 flex flex-col justify-between selection:bg-marigold-200">
      {/* Top Papel Picado Accent */}
      <PapelPicadoBanner />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20 w-full">
        {/* Navigation bar */}
        <header className="flex items-center justify-between pb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-olive-900 flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5 text-marigold-400" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-olive-900 block leading-tight">
                The Last Login
              </span>
              <span className="text-[11px] font-mono tracking-widest text-olive-700 uppercase">
                Private AI Digital Estate Planner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-olive-800 hover:text-olive-950 bg-parchment-100 hover:bg-parchment-300 border border-parchment-300 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
            >
              <Compass className="w-3.5 h-3.5 text-marigold-600" />
              <span>Onboarding Tour</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden xs:inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-olive-900 hover:text-olive-700 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleLoadDemoAndEnter}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs sm:text-sm font-medium shadow-md transition-all hover:shadow-glow-marigold focus-visible:ring-2 focus-visible:ring-marigold-500"
            >
              <span className="hidden sm:inline">Explore Marisol Demo</span>
              <span className="sm:hidden">Explore Demo</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-marigold-400" />
            </button>
          </div>
        </header>

        {/* Central Hero Card (Inspired by Media 2, 5 & Digital Ofrenda) */}
        <div className="relative rounded-3xl bg-olive-900 text-parchment-100 p-8 md:p-14 shadow-elevated border border-olive-800 overflow-hidden mb-16">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-marigold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-olive-800/80 text-marigold-300 border border-olive-700">
              <span className="w-2 h-2 rounded-full bg-marigold-400 animate-pulse"></span>
              THE DIGITAL OFRENDA ARCHITECTURE
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-parchment-50 leading-[1.15]">
              Your memories. <br />
              Your wishes. <br />
              <span className="italic text-marigold-400">Your control.</span>
            </h1>

            <p className="text-base sm:text-lg text-parchment-300 font-sans leading-relaxed">
              A private, local-first space where technology meets memory and reverence. 
              Organize your digital belongings, preserve meaningful family heirlooms, 
              and seal a cryptographically authenticated legacy archive for those you choose.
            </p>

            {/* Core Principle Badge */}
            <div className="p-4 rounded-2xl bg-olive-950/70 border border-olive-800 text-xs sm:text-sm text-parchment-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-marigold-500/20 text-marigold-400 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-parchment-50 font-serif">Core Principle: </strong>
                <span>AI assists with reflection and sorting. <strong>The user makes every final decision.</strong></span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleLoadDemoAndEnter}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-400 hover:to-marigold-500 text-olive-950 rounded-xl font-semibold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Flame className="w-4 h-4 text-olive-950" />
                <span>Launch Fictional Demo (Marisol)</span>
              </button>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-2 px-5 py-3.5 bg-olive-800 hover:bg-olive-700 text-parchment-100 rounded-xl font-medium text-sm border border-olive-700 transition-colors"
              >
                <Compass className="w-4 h-4 text-marigold-400" />
                <span>Take Onboarding Tour</span>
              </button>

              <button
                onClick={() => navigate('/inventory')}
                className="flex items-center gap-2 px-5 py-3.5 bg-olive-900/60 hover:bg-olive-800 text-parchment-200 rounded-xl font-medium text-sm border border-olive-700/80 transition-colors"
              >
                <FolderOpen className="w-4 h-4 text-sage-300" />
                <span>Start Fresh Inventory</span>
              </button>
            </div>
          </div>

          {/* Candle cluster illustration on right */}
          <div className="hidden lg:flex absolute right-12 bottom-12 items-end gap-5 opacity-90">
            <CandleGlow size="sm" active={true} />
            <CandleGlow size="lg" active={true} />
            <CandleGlow size="md" active={true} />
          </div>
        </div>

        {/* 4 Pillars of Privacy & Trust */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl font-bold text-olive-900 text-center mb-2">
            Built for Privacy, Not Commercial Monetization
          </h2>
          <p className="text-sm text-olive-700 text-center max-w-xl mx-auto mb-10">
            Digital estate planning requires absolute privacy and emotional safety. We reject cloud surveillance and synthetic resurrection.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-parchment-100 border border-parchment-300 shadow-soft-card">
              <HardDrive className="w-6 h-6 text-sage-600 mb-3" />
              <h3 className="font-serif font-bold text-base text-olive-900 mb-1">Local Storage Only</h3>
              <p className="text-xs text-olive-700 leading-relaxed">
                Files remain on your local machine. No silent drive scans, no telemetry, and 0 bytes transmitted to any third party.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-parchment-100 border border-parchment-300 shadow-soft-card">
              <Sparkles className="w-6 h-6 text-marigold-600 mb-3" />
              <h3 className="font-serif font-bold text-base text-olive-900 mb-1">Local Private AI</h3>
              <p className="text-xs text-olive-700 leading-relaxed">
                Connects to your local Ollama runtime (or offline embedded heuristics). Never sends your memories to cloud APIs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-parchment-100 border border-parchment-300 shadow-soft-card">
              <Lock className="w-6 h-6 text-terracotta-600 mb-3" />
              <h3 className="font-serif font-bold text-base text-olive-900 mb-1">Authenticated AES-GCM</h3>
              <p className="text-xs text-olive-700 leading-relaxed">
                Sealed Ofrenda packages are encrypted with PBKDF2-SHA256 and AES-256-GCM. Zero-knowledge by design.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-parchment-100 border border-parchment-300 shadow-soft-card">
              <Heart className="w-6 h-6 text-olive-800 mb-3" />
              <h3 className="font-serif font-bold text-base text-olive-900 mb-1">Reverence & Dignity</h3>
              <p className="text-xs text-olive-700 leading-relaxed">
                No simulated dead people, fake voices, or automated release. Living people making conscious decisions for loved ones.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-olive-900">
                Core Journey
              </h2>
              <p className="text-sm text-olive-700">
                From chaotic digital clutter to an intentional, sealed legacy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Inventory */}
            <div 
              onClick={() => navigate('/inventory')}
              className="p-6 rounded-2xl bg-parchment-100 border border-parchment-300 hover:border-sage-400 hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-sage-200 text-olive-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FolderOpen className="w-5 h-5 text-olive-800" />
              </div>
              <h3 className="font-serif text-lg font-bold text-olive-900 mb-1">
                1. Life Inventory
              </h3>
              <p className="text-xs text-olive-700 leading-relaxed mb-4">
                Select photos, recipes, deeds, voice notes, and creative code. Filter, preview, and review local storage metadata.
              </p>
              <span className="text-xs font-semibold text-sage-700 group-hover:text-sage-900 flex items-center gap-1">
                Explore Inventory &rarr;
              </span>
            </div>

            {/* Step 2: Living Séance */}
            <div 
              onClick={() => navigate('/seance')}
              className="p-6 rounded-2xl bg-parchment-100 border border-parchment-300 hover:border-marigold-400 hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-marigold-200 text-olive-950 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-marigold-700" />
              </div>
              <h3 className="font-serif text-lg font-bold text-olive-900 mb-1">
                2. Living Séance
              </h3>
              <p className="text-xs text-olive-700 leading-relaxed mb-4">
                A private, guided interview helping you uncover the human stories behind files. Never rushed, fully editable, and local.
              </p>
              <span className="text-xs font-semibold text-marigold-700 group-hover:text-marigold-900 flex items-center gap-1">
                Begin Guided Reflection &rarr;
              </span>
            </div>

            {/* Step 3: Sealed Ofrenda */}
            <div 
              onClick={() => navigate('/sealed-ofrenda')}
              className="p-6 rounded-2xl bg-parchment-100 border border-parchment-300 hover:border-terracotta-400 hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-terracotta-200 text-olive-950 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5 text-terracotta-700" />
              </div>
              <h3 className="font-serif text-lg font-bold text-olive-900 mb-1">
                3. Sealed Ofrenda
              </h3>
              <p className="text-xs text-olive-700 leading-relaxed mb-4">
                Encrypt approved keeps and releases into a single verifiable <code className="font-mono text-xs">.ofrenda</code> container with physical key recovery instructions.
              </p>
              <span className="text-xs font-semibold text-terracotta-700 group-hover:text-terracotta-900 flex items-center gap-1">
                Create Vault &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-parchment-300 bg-parchment-100/60 py-8 px-6 text-center text-xs text-olive-600 font-sans">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            <strong>The Last Login</strong> — A Private Digital Estate Planner. Open source & local-first.
          </p>
          <p className="font-mono text-[11px] text-olive-500">
            Día de los Muertos heritage inspired • AI assists. The user decides.
          </p>
        </div>
      </footer>

      {/* Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => {
          setIsOnboardingOpen(false);
          handleLoadDemoAndEnter();
        }}
      />
    </div>
  );
};
