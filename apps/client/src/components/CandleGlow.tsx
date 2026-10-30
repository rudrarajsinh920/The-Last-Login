import React from 'react';

export const CandleGlow: React.FC<{ size?: 'sm' | 'md' | 'lg'; active?: boolean }> = ({
  size = 'md',
  active = true
}) => {
  const sizeMap = {
    sm: { flame: 'w-2 h-4', glow: 'w-6 h-6', base: 'w-3 h-5' },
    md: { flame: 'w-3 h-6', glow: 'w-10 h-10', base: 'w-4 h-8' },
    lg: { flame: 'w-4 h-8', glow: 'w-14 h-14', base: 'w-6 h-12' },
  };

  const { flame, glow, base } = sizeMap[size];

  return (
    <div className="relative inline-flex flex-col items-center justify-end select-none">
      {/* Halo glow */}
      {active && (
        <div
          className={`absolute -top-3 ${glow} rounded-full bg-marigold-400/25 blur-md pointer-events-none transition-all duration-700 animate-flicker`}
        />
      )}

      {/* Flame */}
      {active ? (
        <div
          className={`${flame} rounded-full bg-gradient-to-t from-marigold-600 via-marigold-400 to-amber-100 shadow-glow-marigold animate-flicker origin-bottom`}
        />
      ) : (
        <div className="w-0.5 h-2 bg-olive-700 rounded-t" />
      )}

      {/* Wick */}
      <div className="w-0.5 h-1.5 bg-olive-950" />

      {/* Wax Pillar */}
      <div
        className={`${base} bg-gradient-to-b from-parchment-100 to-parchment-300 rounded-t-sm border border-olive-900/10 shadow-sm`}
      />
    </div>
  );
};
