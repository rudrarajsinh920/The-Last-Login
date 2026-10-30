import React, { useState } from 'react';
import { GhostState } from '../context/GhostContext';

interface FriendlyGhostProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  state?: GhostState;
  message?: string | null;
  showTooltip?: boolean;
  showFlower?: boolean;
  onClick?: () => void;
}

export const FriendlyGhost: React.FC<FriendlyGhostProps> = ({
  className = '',
  size = 'md',
  state = 'idle',
  message = null,
  showTooltip = true,
  showFlower = true,
  onClick
}) => {
  const [internalHover, setInternalHover] = useState(false);

  // Responsive dimensions
  const dimensions = {
    sm: { width: 42, height: 48, scale: 0.72 },
    md: { width: 56, height: 66, scale: 0.95 },
    lg: { width: 72, height: 84, scale: 1.15 }
  }[size];

  // Active emotion: prop state takes precedence over hover state
  const effectiveState: GhostState = state !== 'idle' ? state : internalHover ? 'happy' : 'idle';

  // Animation class mapped to state
  const getAnimationClass = () => {
    switch (effectiveState) {
      case 'happy':
        return 'animate-ghost-happy';
      case 'celebrating':
        return 'animate-ghost-celebrating';
      case 'curious':
        return 'animate-ghost-curious';
      case 'thinking':
        return 'animate-ghost-thinking';
      case 'concerned':
        return 'animate-ghost-concerned';
      case 'welcoming':
        return 'animate-ghost-welcoming';
      case 'gentle-acknowledgement':
        return 'animate-ghost-acknowledge';
      case 'idle':
      default:
        return 'animate-ghost-float';
    }
  };

  const isJoyful = effectiveState === 'happy' || effectiveState === 'celebrating';

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none pointer-events-auto ${className}`}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      onClick={onClick}
      role="img"
      aria-label={`Friendly Memory Guardian Ghost (${effectiveState})`}
      tabIndex={0}
    >
      {/* Floating Sparkles when Celebrating or Happy */}
      {isJoyful && (
        <div className="absolute -top-3 -right-2 pointer-events-none animate-sparkle-pop z-30">
          <span className="text-marigold-400 font-serif text-sm drop-shadow-[0_2px_4px_rgba(217,154,53,0.6)]">✦</span>
        </div>
      )}
      {effectiveState === 'celebrating' && (
        <div className="absolute -top-4 -left-2 pointer-events-none animate-sparkle-pop z-30" style={{ animationDelay: '0.2s' }}>
          <span className="text-marigold-300 font-serif text-xs drop-shadow-[0_2px_4px_rgba(217,154,53,0.5)]">✧</span>
        </div>
      )}

      {/* Interactive Ghost SVG Body */}
      <div className={`relative ${getAnimationClass()} transition-transform duration-300 cursor-pointer`}>
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible filter drop-shadow-[0_6px_12px_rgba(217,154,53,0.2)] transition-all duration-300 hover:drop-shadow-[0_8px_16px_rgba(217,154,53,0.4)]"
        >
          <defs>
            {/* Soft watercolor ivory body gradient */}
            <linearGradient id="ghostBodyGrad2" x1="50" y1="10" x2="50" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#FBF7EE" />
              <stop offset="85%" stopColor="#F2E6CE" />
              <stop offset="100%" stopColor="#E5D3B3" />
            </linearGradient>

            {/* Rosy peach watercolor cheek blur */}
            <radialGradient id="cheekBlush2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E58B6F" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#EFA78F" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EFA78F" stopOpacity="0" />
            </radialGradient>

            {/* Flower Petal Gradient (Warm Gold & Marigold) */}
            <linearGradient id="flowerPetalGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E4B45A" />
              <stop offset="50%" stopColor="#D99A35" />
              <stop offset="100%" stopColor="#B96F54" />
            </linearGradient>
          </defs>

          {/* Ghost Body Silhouette with Draped Scalloped Folds */}
          <path
            d="M 22 88
               C 21 54, 26 15, 52 15
               C 78 15, 83 54, 82 88
               C 82 95, 76 99, 72 94
               C 68 89, 64 99, 58 95
               C 53 91, 48 99, 43 94
               C 38 89, 34 99, 29 95
               C 25 91, 22 93, 22 88 Z"
            fill="url(#ghostBodyGrad2)"
            stroke="#DCD0BC"
            strokeWidth="1.2"
            className="animate-ghost-skirt origin-bottom"
          />

          {/* Left Little Arm */}
          <path
            d="M 24 55 Q 16 62 21 68"
            stroke="#DCD0BC"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Arm holding flower or waving */}
          {showFlower ? (
            /* Arm lovingly holding the flower stem forward */
            <g>
              {/* Hand wrapping stem */}
              <path
                d="M 76 60 Q 84 66 79 72"
                stroke="#DCD0BC"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Green Flower Stem */}
              <path
                d="M 79 68 Q 83 52 87 40"
                stroke="#8C9A7A"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Green Leaf */}
              <path
                d="M 81 58 Q 74 54 78 50 Q 83 54 81 58"
                fill="#8C9A7A"
              />
              {/* Memory Blossom (Cempasúchil / Forget-Me-Not) */}
              <g transform="translate(87, 36) scale(0.9)">
                <circle cx="0" cy="-6" r="3.6" fill="url(#flowerPetalGrad2)" />
                <circle cx="6" cy="-2" r="3.6" fill="url(#flowerPetalGrad2)" />
                <circle cx="4" cy="5" r="3.6" fill="url(#flowerPetalGrad2)" />
                <circle cx="-4" cy="5" r="3.6" fill="url(#flowerPetalGrad2)" />
                <circle cx="-6" cy="-2" r="3.6" fill="url(#flowerPetalGrad2)" />
                {/* Flower center */}
                <circle cx="0" cy="0" r="3.2" fill="#B96F54" />
              </g>
            </g>
          ) : (
            <path
              d="M 78 55 Q 86 62 81 68"
              stroke="#DCD0BC"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Left Cheek Blush */}
          <circle cx="34" cy="54" r="8" fill="url(#cheekBlush2)" />

          {/* Right Cheek Blush */}
          <circle cx="70" cy="54" r="8" fill="url(#cheekBlush2)" />

          {/* Dynamic Expressions based on State */}
          {isJoyful ? (
            /* Joyful Smiling Eyes (^_^) */
            <g stroke="#18251F" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 34 47 Q 39 42 44 47" />
              <path d="M 60 47 Q 65 42 70 47" />
            </g>
          ) : effectiveState === 'curious' ? (
            /* Inquisitive Eyes (Head tilted, big questioning eyes) */
            <g>
              <circle cx="38" cy="45" r="5.5" fill="#18251F" />
              <circle cx="36.5" cy="43.5" r="2" fill="#FFFFFF" />
              <circle cx="66" cy="47" r="4.8" fill="#18251F" />
              <circle cx="64.5" cy="45.5" r="1.6" fill="#FFFFFF" />
            </g>
          ) : effectiveState === 'thinking' ? (
            /* Thinking / Contemplative Eyes (looking upward) */
            <g>
              <circle cx="39" cy="44" r="4.8" fill="#18251F" />
              <circle cx="38.5" cy="42.5" r="1.8" fill="#FFFFFF" />
              <circle cx="65" cy="44" r="4.8" fill="#18251F" />
              <circle cx="64.5" cy="42.5" r="1.8" fill="#FFFFFF" />
            </g>
          ) : effectiveState === 'concerned' ? (
            /* Empathetic / Reassuring Eyes */
            <g>
              <circle cx="39" cy="47" r="4.5" fill="#18251F" />
              <circle cx="38" cy="45.5" r="1.5" fill="#FFFFFF" />
              <circle cx="65" cy="47" r="4.5" fill="#18251F" />
              <circle cx="64" cy="45.5" r="1.5" fill="#FFFFFF" />
            </g>
          ) : (
            /* Peaceful Normal Soulful Eyes with Periodic Blink */
            <g className="animate-ghost-blink origin-[52px_46px]">
              <circle cx="39" cy="46" r="5" fill="#18251F" />
              <circle cx="37.5" cy="44.5" r="1.6" fill="#FFFFFF" />
              <circle cx="65" cy="46" r="5" fill="#18251F" />
              <circle cx="63.5" cy="44.5" r="1.6" fill="#FFFFFF" />
            </g>
          )}

          {/* Dynamic Mouth based on State */}
          {isJoyful ? (
            /* Big Happy Open Smile */
            <path
              d="M 47 55 Q 52 62 57 55"
              stroke="#18251F"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          ) : effectiveState === 'curious' ? (
            /* Curious Little O Mouth */
            <ellipse cx="52" cy="56" rx="2" ry="2.8" fill="#18251F" />
          ) : effectiveState === 'concerned' ? (
            /* Gentle Reassuring Line */
            <path
              d="M 49 56 Q 52 57 55 56"
              stroke="#18251F"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            /* Gentle Peaceful Smile */
            <path
              d="M 49 54 Q 52 58 55 54"
              stroke="#18251F"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Tiny Golden Marigold Crown Accent */}
          <g transform="translate(68, 16) scale(0.75)">
            <circle cx="0" cy="0" r="4.5" fill="url(#flowerPetalGrad2)" />
            <circle cx="-4" cy="-2" r="3.2" fill="#E4B45A" opacity="0.9" />
            <circle cx="4" cy="-2" r="3.2" fill="#E4B45A" opacity="0.9" />
            <circle cx="-2.5" cy="4" r="3.2" fill="#D99A35" opacity="0.95" />
            <circle cx="2.5" cy="4" r="3.2" fill="#D99A35" opacity="0.95" />
            <circle cx="0" cy="-4.5" r="3" fill="#E4B45A" />
            <circle cx="0" cy="0" r="2.2" fill="#B96F54" />
          </g>
        </svg>

        {/* Soft ground ripple shadow */}
        <div className="w-8 h-2 mx-auto bg-olive-900/15 rounded-full blur-[2px] animate-ghost-shadow" />
      </div>

      {/* Floating Reactive Dialogue / Tooltip Bubble */}
      {showTooltip && (message || internalHover) && (
        <div
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-mono tracking-tight bg-olive-900 text-parchment-100 border border-marigold-500/50 shadow-elevated z-40 animate-fade-in"
        >
          <span className="text-marigold-400 mr-1.5">✦</span>
          <span>{message || 'Guardian of Memories'}</span>
        </div>
      )}
    </div>
  );
};
