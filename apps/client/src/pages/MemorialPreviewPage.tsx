import React, { useState, useEffect } from 'react';
import {
  Flame,
  Heart,
  Volume2,
  Utensils,
  Image,
  ScrollText,
  Code,
  FolderLock,
  Sparkles,
  Share2,
  Calendar,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { clientStore } from '../services/clientStore';
import { CandleGlow } from '../components/CandleGlow';
import { PapelPicadoBanner } from '../components/PapelPicadoBanner';
import { ItemThumbnail } from '../components/ItemThumbnail';
import { InventoryItem, LegacyLetter, SeanceTurn } from '@the-last-login/shared';

const getInitialMemorial = () => {
  const mem = clientStore.getMemorialItems();
  return {
    ownerName: 'Marisol Hernandez',
    tagline: 'A life rooted in family, flora, and shared memories.',
    totalPreservedItems: mem.items.length,
    totalLetters: mem.letters.length,
    totalReflections: mem.turns.length,
    sections: {
      photos: mem.items.filter(i => i.category === 'photos'),
      recipes: mem.items.filter(i => i.category === 'recipes'),
      audio: mem.items.filter(i => i.category === 'audio'),
      creative: mem.items.filter(i => i.category === 'creative'),
      stories: mem.items.filter(i => i.category === 'stories'),
      documents: mem.items.filter(i => i.category === 'documents')
    },
    letters: mem.letters,
    reflections: mem.turns
  };
};

export const MemorialPreviewPage: React.FC = () => {
  const [memorial, setMemorial] = useState<any>(() => getInitialMemorial());
  const [loading, setLoading] = useState(false);
  const [candleMode, setCandleMode] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadMemorial();
  }, []);

  const loadMemorial = async () => {
    try {
      const data = await api.getMemorial();
      if (data) setMemorial(data);
    } catch (e) {
      console.error(e);
      setMemorial(getInitialMemorial());
    } finally {
      setLoading(false);
    }
  };

  if (loading || !memorial) {
    return (
      <div className="flex-1 p-8 text-center text-sm font-serif italic text-olive-800">
        Preparing sacred memory ofrenda...
      </div>
    );
  }

  const { sections, letters, reflections, totalPreservedItems } = memorial;

  return (
    <div className={`flex-1 min-h-screen transition-colors duration-700 w-full min-w-0 ${candleMode ? 'bg-[#121B17] text-parchment-100' : 'bg-parchment-200 text-olive-900'}`}>
      {/* Top authentic Papel Picado lace border */}
      <PapelPicadoBanner className="opacity-90" showGhost={false} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-fade-in w-full min-w-0">
        {/* Controls & Sensitive Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-marigold-500 animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest uppercase text-marigold-400 font-semibold">
              MEMORIAL OFRENDA TRIBUTE • CURATED LEGACY
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCandleMode(!candleMode)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all bg-white/10 hover:bg-white/20 text-parchment-100"
            >
              <Flame className={`w-3.5 h-3.5 ${candleMode ? 'text-marigold-400' : 'text-olive-400'}`} />
              <span>{candleMode ? 'Candlelight Glow: ON' : 'Parchment Glow: ON'}</span>
            </button>
          </div>
        </div>

        {/* Altar Centerpiece Header (Inspired by Media 2 & Media 5) */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Candle Trio */}
          <div className="flex justify-center items-end gap-6 pb-2">
            <CandleGlow size="sm" active={candleMode} />
            <CandleGlow size="lg" active={candleMode} />
            <CandleGlow size="md" active={candleMode} />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-parchment-50">
            {memorial.ownerName}
          </h2>

          <p className="font-serif italic text-lg sm:text-xl text-marigold-300">
            "{memorial.tagline}"
          </p>

          <p className="text-xs text-parchment-300 font-sans leading-relaxed">
            Preserving <strong>{totalPreservedItems} curated possessions</strong> and <strong>{letters.length} legacy letters</strong> for those she loved. 
            All private and excluded records have been safely laid to rest.
          </p>
        </div>

        {/* TIER 1: FEATURED PHOTOGRAPHS & PORTRAITS (Media 2 Altar Framing) */}
        {sections.photos.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-serif text-2xl font-bold flex items-center gap-2.5 text-parchment-50">
                <Image className="w-5 h-5 text-marigold-400" />
                <span>Cherished Photographs & Portraits</span>
              </h3>
              <span className="text-xs font-mono text-sage-300">{sections.photos.length} Archived Scans</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.photos.map((item: InventoryItem) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 bg-white/5 border border-white/10 shadow-elevated space-y-3 group hover:border-marigold-400/60 transition-all"
                >
                  <ItemThumbnail item={item} heightClass="h-60" />

                  <div>
                    <h4 className="font-serif text-lg font-bold text-parchment-50 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-parchment-300 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-sage-300">
                    <span>{item.recipient || 'Preserved for Family'}</span>
                    <span>KEEP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIER 2: APPROVED LEGACY LETTERS */}
        {letters.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-serif text-2xl font-bold flex items-center gap-2.5 text-parchment-50">
                <ScrollText className="w-5 h-5 text-marigold-400" />
                <span>Sealed Legacy Letters</span>
              </h3>
              <span className="text-xs font-mono text-sage-300">{letters.length} Approved Letters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {letters.map((letter: LegacyLetter) => (
                <div
                  key={letter.id}
                  className="rounded-2xl p-6 bg-parchment-100 text-olive-950 border border-parchment-400 shadow-elevated space-y-4 font-serif"
                >
                  <div className="flex items-center justify-between border-b border-olive-900/15 pb-2">
                    <span className="text-xs font-mono text-sage-700 uppercase font-semibold">
                      For: {letter.recipient}
                    </span>
                    <span className="text-[10px] font-mono bg-sage-200 text-sage-900 px-2 py-0.5 rounded-full font-bold">
                      Authenticated
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-olive-950">
                    "{letter.title}"
                  </h4>

                  <p className="text-sm text-olive-900 leading-relaxed whitespace-pre-line font-serif italic">
                    {letter.content}
                  </p>

                  <div className="pt-2 border-t border-olive-900/15 text-right text-xs text-olive-700 font-mono">
                    — Written by Marisol Hernandez
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIER 3: FAMILY RECIPES & CULINARY HEIRLOOMS */}
        {sections.recipes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-serif text-2xl font-bold flex items-center gap-2.5 text-parchment-50">
                <Utensils className="w-5 h-5 text-marigold-400" />
                <span>Generational Recipes & Kitchen Traditions</span>
              </h3>
              <span className="text-xs font-mono text-sage-300">RELEASED TO FAMILY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.recipes.map((item: InventoryItem) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-soft-card space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-marigold-400 uppercase font-bold">
                      Gifted to {item.recipient}
                    </span>
                    <span className="text-xs font-mono text-sage-300">Culinary Heirloom</span>
                  </div>

                  <ItemThumbnail item={item} heightClass="h-44" />

                  <h4 className="font-serif text-xl font-bold text-parchment-50">
                    {item.title}
                  </h4>

                  {item.contentSnippet && (
                    <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs text-parchment-200 font-mono leading-relaxed">
                      {item.contentSnippet}
                    </div>
                  )}

                  <p className="text-xs text-parchment-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIER 4: SOUNDSCAPES & OPEN-SOURCE CREATIVE LEGACY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Voice & Soundscapes */}
          {sections.audio.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2 text-parchment-50">
                  <Volume2 className="w-4 h-4 text-marigold-400" />
                  <span>Audio & Voice Memories</span>
                </h3>
              </div>

              <div className="space-y-3">
                {sections.audio.map((item: InventoryItem) => (
                  <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-parchment-50">{item.title}</span>
                      <span className="text-[10px] font-mono text-sage-300">Binaural Audio</span>
                    </div>
                    <p className="text-xs text-parchment-300 leading-relaxed">{item.description}</p>
                    <div className="w-full h-8 bg-black/40 rounded-lg flex items-center justify-center text-xs font-mono text-marigold-400 border border-white/10">
                      ▶ 34:00 • Oaxaca Courtyard Rain Soundscape
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creative & Open Source Projects */}
          {sections.creative.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2 text-parchment-50">
                  <Code className="w-4 h-4 text-marigold-400" />
                  <span>Creative & Code Legacy</span>
                </h3>
              </div>

              <div className="space-y-3">
                {sections.creative.map((item: InventoryItem) => (
                  <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-parchment-50">{item.title}</span>
                      <span className="text-[10px] font-mono text-marigold-400">Open Source Handover</span>
                    </div>
                    <ItemThumbnail item={item} heightClass="h-32" />
                    <p className="text-xs text-parchment-300 leading-relaxed">{item.description}</p>
                    {item.contentSnippet && (
                      <pre className="p-2.5 rounded-lg bg-black/50 text-[11px] font-mono text-sage-300 overflow-x-auto border border-white/10">
                        {item.contentSnippet}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TIER 5: DOCUMENTED LIVING SÉANCE REFLECTIONS */}
        {reflections.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-white/10">
            <h3 className="font-serif text-2xl font-bold text-parchment-50 flex items-center gap-2">
              <Heart className="w-5 h-5 text-marigold-400" />
              <span>Living Reflections & Family Oral Histories</span>
            </h3>

            <div className="space-y-4">
              {reflections.map((turn: SeanceTurn) => (
                <div key={turn.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-marigold-400 font-bold tracking-wider">
                    {turn.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-parchment-100">
                    "{turn.question}"
                  </h4>
                  <p className="text-sm text-parchment-200 font-serif italic leading-relaxed pl-3 border-l-2 border-marigold-500">
                    "{turn.userAnswer}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sacred Guard Notice */}
        <div className="text-center py-6 border-t border-white/10 text-xs text-parchment-400 font-mono space-y-1">
          <p>
            🔒 Privacy Verified: Only approved KEEP & RELEASE items are presented on this ofrenda.
          </p>
          <p className="text-sage-400">
            Private journals, tax files, and exorcised possessions are strictly excluded from display.
          </p>
        </div>
      </div>
    </div>
  );
};
