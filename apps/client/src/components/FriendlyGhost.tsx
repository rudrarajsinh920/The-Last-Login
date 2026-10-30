import React, { useState } from 'react';

interface FriendlyGhostProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const FriendlyGhost: React.FC<FriendlyGhostProps> = ({
  className = '',
  size = 'md',
  showTooltip = true
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Responsive scale dimensions
  const dimensions = {
    sm: { width: 44, height: 52, scale: 0.75 },
    md: { width: 56, height: 66, scale: 0.95 },
    lg: { width: 72, height: 84, scale: 1.15 }
  }[size];

  return (
    <div
      className={`relative inline-flex flex-col items-center pointer-events-auto select-none group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(prev => !prev)}
      role="img"
      aria-label="Friendly Memory Guardian Ghost"
      tabIndex={0}
    >
      {/* Interactive Floating Ghost SVG */}
      <div className="relative animate-ghost-float transition-transform duration-300 group-hover:scale-105 cursor-pointer">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible filter drop-shadow-[0_6px_12px_rgba(217,154,53,0.22)] transition-all duration-300 group-hover:drop-shadow-[0_8px_16px_rgba(217,154,53,0.4)]"
        >
          <defs>
            {/* Soft watercolor body gradient */}
            <linearGradient id="ghostBodyGrad" x1="50" y1="10" x2="50" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#FBF7EE" />
              <stop offset="85%" stopColor="#F2E6CE" />
              <stop offset="100%" stopColor="#E5D3B3" />
            </linearGradient>

            {/* Subtle luminous edge contour */}
            <linearGradient id="ghostShadingGrad" x1="15" y1="20" x2="85" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#C4B08F" stopOpacity="0.45" />
            </linearGradient>

            {/* Rosy peach watercolor cheek blur */}
            <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E58B6F" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#EFA78F" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EFA78F" stopOpacity="0" />
            </radialGradient>

            {/* Marigold cempasúchil flower accent gradient */}
            <linearGradient id="flowerPetalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E4B45A" />
              <stop offset="50%" stopColor="#D99A35" />
              <stop offset="100%" stopColor="#B96F54" />
            </linearGradient>
          </defs>

          {/* Ghost Body Silhouette with Soft Watercolor Drapery Folds */}
          <path
            d="M 22 88
               C 21 54, 26 15, 52 15
               C 78 15, 83 54, 82 88
               C 82 95, 76 99, 72 94
               C 68 89, 64 99, 58 95
               C 53 91, 48 99, 43 94
               C 38 89, 34 99, 29 95
               C 25 91, 22 93, 22 88 Z"
            fill="url(#ghostBodyGrad)"
            stroke="#DCD0BC"
            strokeWidth="1.2"
            className="animate-ghost-skirt origin-bottom"
          />

          {/* Inner watercolor drapery shading creases */}
          <path
            d="M 33 82 Q 35 92 36 94"
            stroke="#C9B695"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M 48 80 Q 50 91 51 94"
            stroke="#C9B695"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 64 81 Q 65 91 66 94"
            stroke="#C9B695"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Left Cheek Blush */}
          <circle cx="34" cy="54" r="8" fill="url(#cheekBlush)" />

          {/* Right Cheek Blush */}
          <circle cx="70" cy="54" r="8" fill="url(#cheekBlush)" />

          {/* Expressive Eyes: Normal Round vs Hover Happy Curved Squint */}
          {isHovered ? (
            /* Joyful Smiling Eyes (^_^) */
            <g stroke="#18251F" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 34 47 Q 39 42 44 47" />
              <path d="M 60 47 Q 65 42 70 47" />
            </g>
          ) : (
            /* Soulful Big Round Eyes with White Light Reflection Dot */
            <g className="animate-ghost-blink origin-[52px_46px]">
              {/* Left Eye */}
              <circle cx="39" cy="46" r="5" fill="#18251F" />
              <circle cx="37.5" cy="44.5" r="1.6" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="65" cy="46" r="5" fill="#18251F" />
              <circle cx="63.5" cy="44.5" r="1.6" fill="#FFFFFF" />
            </g>
          )}

          {/* Sweet Upward Curved Smile */}
          <path
            d={isHovered ? "M 48 55 Q 52 61 56 55" : "M 49 54 Q 52 58 55 54"}
            stroke="#18251F"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tiny Marigold (Cempasúchil) Flower pinned on side */}
          <g transform="translate(68, 18) scale(0.85)">
            {/* Golden Petals */}
            <circle cx="0" cy="0" r="4.5" fill="url(#flowerPetalGrad)" />
            <circle cx="-4" cy="-2" r="3.2" fill="#E4B45A" opacity="0.9" />
            <circle cx="4" cy="-2" r="3.2" fill="#E4B45A" opacity="0.9" />
            <circle cx="-2.5" cy="4" r="3.2" fill="#D99A35" opacity="0.95" />
            <circle cx="2.5" cy="4" r="3.2" fill="#D99A35" opacity="0.95" />
            <circle cx="0" cy="-4.5" r="3" fill="#E4B45A" />
            {/* Flower Center */}
            <circle cx="0" cy="0" r="2.2" fill="#B96F54" />
          </g>
        </svg>

        {/* Soft ground ripple shadow */}
        <div className="w-8 h-2 mx-auto bg-olive-900/15 rounded-full blur-[2px] animate-ghost-shadow" />
      </div>

      {/* Tasteful Floating Hover Tooltip */}
      {showTooltip && (
        <div
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-mono tracking-tight bg-olive-900/95 text-parchment-100 border border-marigold-500/40 shadow-md transition-all duration-300 pointer-events-none z-30 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1'
          }`}
        >
          <span className="text-marigold-400 mr-1">✦</span>
          <span>Guardian of Memories</span>
        </div>
      )}
    </div>
  );
};
