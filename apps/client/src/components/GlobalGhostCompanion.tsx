import React, { useState } from 'react';
import { useGhost } from '../context/GhostContext';
import { FriendlyGhost } from './FriendlyGhost';

interface GlobalGhostCompanionProps {
  currentRoute: string;
  onOpenOnboarding?: () => void;
}

const COMFORT_THOUGHTS = [
  'Your memories are sacred and safe.',
  'Private & stored 100% on your machine.',
  'You have full authority over every decision.',
  'A peaceful sanctuary for your living legacy.',
  'Preserving the love, wisdom, and recipes.'
];

export const GlobalGhostCompanion: React.FC<GlobalGhostCompanionProps> = ({ currentRoute, onOpenOnboarding }) => {
  const { state, message, ghostCelebrating } = useGhost();
  const [clickCount, setClickCount] = useState(0);

  // If on landing page, the ghost is already prominently featured in the top ofrenda banner!
  if (currentRoute === '/') {
    return null;
  }

  const handleClick = () => {
    // Every 5th click, offer to open the onboarding tour if available
    if (clickCount > 0 && clickCount % 5 === 4 && onOpenOnboarding) {
      setClickCount(prev => prev + 1);
      ghostCelebrating('Need a refresher? Reopening Onboarding Guide...');
      setTimeout(() => {
        onOpenOnboarding();
      }, 900);
      return;
    }

    const nextMsg = COMFORT_THOUGHTS[clickCount % COMFORT_THOUGHTS.length];
    setClickCount(prev => prev + 1);
    ghostCelebrating(nextMsg);
  };

  return (
    <aside
      aria-label="Friendly Ghost Companion"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end pointer-events-none"
    >
      {/* Speech / Action Feedback Toast Bubble */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mb-2 max-w-[240px] px-3.5 py-1.5 rounded-2xl bg-olive-900/95 text-parchment-100 border border-marigold-500/50 shadow-elevated text-xs font-serif leading-snug animate-fade-in pointer-events-auto"
        >
          <div className="flex items-start gap-1.5">
            <span className="text-marigold-400 font-sans font-bold text-xs shrink-0">✦</span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Floating Ghost Badge */}
      <div
        className="pointer-events-auto p-1.5 rounded-2xl bg-parchment-100/80 backdrop-blur-md border border-parchment-300 hover:border-marigold-400 shadow-soft-card hover:shadow-glow-marigold transition-all duration-300 transform hover:scale-105"
        title="Friendly Memory Guardian — click for guidance"
      >
        <FriendlyGhost
          size="sm"
          state={state}
          showTooltip={false}
          showFlower={true}
          onClick={handleClick}
        />
      </div>
    </aside>
  );
};
