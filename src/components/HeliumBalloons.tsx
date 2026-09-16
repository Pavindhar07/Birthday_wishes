import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

export type BalloonColor = 'burgundy' | 'gold' | 'rose' | 'champagne' | 'ruby';

export interface BalloonConfig {
  id: string;
  color: BalloonColor;
  left: string; // e.g. '5%', '18%', '85%'
  size: number; // width in pixels (e.g. 60 - 110)
  duration: number; // seconds to rise from bottom to top (e.g. 11 - 20)
  delay: number; // negative delay in seconds to start mid-flight immediately
  swayDuration: number; // seconds for gentle rocking (e.g. 3.5 - 5.5)
  swayDistance: number; // px horizontal drift (e.g. 12 - 24)
  rotationDeg: number; // degrees of natural tilt (e.g. 3 - 6)
  zIndex: number;
  opacity: number;
  hasRibbonTag?: boolean;
  tagText?: string;
}

const BALLOON_PRESETS: BalloonConfig[] = [
  // Left side cluster
  {
    id: 'b1',
    color: 'burgundy',
    left: '3%',
    size: 86,
    duration: 15,
    delay: -4,
    swayDuration: 4.2,
    swayDistance: 16,
    rotationDeg: 5,
    zIndex: 15,
    opacity: 0.95,
    hasRibbonTag: true,
    tagText: '♥',
  },
  {
    id: 'b2',
    color: 'gold',
    left: '10%',
    size: 72,
    duration: 18,
    delay: -11,
    swayDuration: 5.1,
    swayDistance: -18,
    rotationDeg: -4,
    zIndex: 12,
    opacity: 0.9,
  },
  {
    id: 'b3',
    color: 'rose',
    left: '17%',
    size: 94,
    duration: 13.5,
    delay: -7.5,
    swayDuration: 3.8,
    swayDistance: 14,
    rotationDeg: 6,
    zIndex: 16,
    opacity: 0.95,
  },
  {
    id: 'b4',
    color: 'champagne',
    left: '7%',
    size: 64,
    duration: 21,
    delay: -16,
    swayDuration: 4.8,
    swayDistance: -12,
    rotationDeg: -5,
    zIndex: 5,
    opacity: 0.8,
  },

  // Mid-left background accents
  {
    id: 'b5',
    color: 'ruby',
    left: '26%',
    size: 78,
    duration: 16.5,
    delay: -2,
    swayDuration: 4.5,
    swayDistance: 15,
    rotationDeg: 4,
    zIndex: 4,
    opacity: 0.75,
  },
  {
    id: 'b6',
    color: 'gold',
    left: '34%',
    size: 58,
    duration: 22,
    delay: -14,
    swayDuration: 5.5,
    swayDistance: -10,
    rotationDeg: -3,
    zIndex: 2,
    opacity: 0.65,
  },

  // Center-right background gentle floats
  {
    id: 'b7',
    color: 'champagne',
    left: '64%',
    size: 60,
    duration: 20,
    delay: -9,
    swayDuration: 5.2,
    swayDistance: 12,
    rotationDeg: 3,
    zIndex: 2,
    opacity: 0.65,
  },
  {
    id: 'b8',
    color: 'rose',
    left: '72%',
    size: 76,
    duration: 17,
    delay: -5,
    swayDuration: 4.4,
    swayDistance: -16,
    rotationDeg: -5,
    zIndex: 4,
    opacity: 0.75,
  },

  // Right side cluster
  {
    id: 'b9',
    color: 'burgundy',
    left: '81%',
    size: 96,
    duration: 14,
    delay: -8,
    swayDuration: 4.0,
    swayDistance: 18,
    rotationDeg: 5,
    zIndex: 16,
    opacity: 0.95,
  },
  {
    id: 'b10',
    color: 'gold',
    left: '89%',
    size: 82,
    duration: 16,
    delay: -3,
    swayDuration: 4.7,
    swayDistance: -15,
    rotationDeg: -4,
    zIndex: 14,
    opacity: 0.92,
    hasRibbonTag: true,
    tagText: '✨',
  },
  {
    id: 'b11',
    color: 'ruby',
    left: '94%',
    size: 70,
    duration: 19,
    delay: -13,
    swayDuration: 5.0,
    swayDistance: 14,
    rotationDeg: 4,
    zIndex: 12,
    opacity: 0.88,
  },
  {
    id: 'b12',
    color: 'champagne',
    left: '84%',
    size: 65,
    duration: 23,
    delay: -18,
    swayDuration: 5.4,
    swayDistance: -12,
    rotationDeg: -3,
    zIndex: 5,
    opacity: 0.8,
  },
];

export const HeliumBalloons: React.FC = () => {
  const [poppedMap, setPoppedMap] = useState<Record<string, boolean>>({});
  const [extraBalloons, setExtraBalloons] = useState<BalloonConfig[]>([]);

  const handleBalloonClick = (balloon: BalloonConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playSuccessChime();

    // Trigger celebratory confetti burst around clicked balloon
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const colorPalette = {
      burgundy: ['#5c061d', '#8b1538', '#d4af37'],
      gold: ['#d4af37', '#f6ecd9', '#ab844c'],
      rose: ['#e89da9', '#5c061d', '#fff'],
      champagne: ['#f5ebd9', '#ab844c', '#d4af37'],
      ruby: ['#c81d42', '#5c061d', '#e89da9'],
    }[balloon.color];

    confetti({
      particleCount: 28,
      spread: 60,
      origin: { x, y },
      colors: colorPalette,
      scalar: 0.85,
    });

    // Mark as popped temporarily, then reappear after gentle cycle
    setPoppedMap((prev) => ({ ...prev, [balloon.id]: true }));
    setTimeout(() => {
      setPoppedMap((prev) => ({ ...prev, [balloon.id]: false }));
    }, 4000);
  };

  const handleReleaseBalloon = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playSuccessChime();

    const colors: BalloonColor[] = ['burgundy', 'gold', 'rose', 'champagne', 'ruby'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomLeft = `${Math.floor(Math.random() * 70) + 15}%`; // 15% to 85%
    const randomSize = Math.floor(Math.random() * 30) + 75; // 75 to 105px
    const randomDuration = Math.floor(Math.random() * 5) + 12; // 12 to 16s

    const newBalloon: BalloonConfig = {
      id: `extra-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      color: randomColor,
      left: randomLeft,
      size: randomSize,
      duration: randomDuration,
      delay: 0, // Starts immediately from bottom
      swayDuration: 4.2,
      swayDistance: Math.random() > 0.5 ? 16 : -16,
      rotationDeg: Math.random() > 0.5 ? 5 : -5,
      zIndex: 20,
      opacity: 0.96,
      hasRibbonTag: true,
      tagText: ['♥', '✨', '🎂', '🥳'][Math.floor(Math.random() * 4)],
    };

    setExtraBalloons((prev) => [...prev.slice(-8), newBalloon]);

    // Small celebratory confetti at bottom
    confetti({
      particleCount: 16,
      spread: 45,
      origin: { x: 0.12, y: 0.92 },
      colors: ['#5c061d', '#ab844c', '#f5ecd9'],
      scalar: 0.7,
    });
  };

  const allBalloons = [...BALLOON_PRESETS, ...extraBalloons];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {/* Interactive Release Balloon Floating Action */}
      <div className="fixed bottom-6 left-6 z-30 pointer-events-auto">
        <button
          onClick={handleReleaseBalloon}
          className="group flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#fcf9f2]/90 hover:bg-white text-[#5c061d] border border-[#d8c29d] shadow-sm hover:shadow-md transition-all text-xs font-serif tracking-wider cursor-pointer active:scale-95"
          title="Click to release a helium balloon!"
        >
          <span className="text-base group-hover:-translate-y-1 transition-transform">🎈</span>
          <span className="hidden sm:inline">Release Balloon</span>
        </button>
      </div>
      <style>{`
        @keyframes floatUpInfinite {
          0% {
            transform: translateY(118vh);
          }
          100% {
            transform: translateY(-45vh);
          }
        }

        @keyframes swaySideToSide {
          0% {
            transform: translateX(0px) rotate(-var(--rot, 4deg));
          }
          50% {
            transform: translateX(var(--sway, 18px)) rotate(var(--rot, 4deg));
          }
          100% {
            transform: translateX(calc(var(--sway, 18px) * -0.6)) rotate(calc(var(--rot, 4deg) * -0.7));
          }
        }

        @keyframes ribbonWave {
          0%, 100% {
            d: path("M 50,108 C 42,130 58,155 48,180 C 38,205 56,230 48,255 C 43,275 52,295 48,315");
          }
          50% {
            d: path("M 50,108 C 58,130 42,155 52,180 C 60,205 44,230 54,255 C 57,275 48,295 52,315");
          }
        }
      `}</style>

      {/* Shared SVG Gradients */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Deep Velvet Burgundy Metallic Helium Gradient */}
          <radialGradient id="balloon-burgundy" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#bf284e" />
            <stop offset="28%" stopColor="#87102e" />
            <stop offset="68%" stopColor="#54051a" />
            <stop offset="95%" stopColor="#2e000b" />
          </radialGradient>

          {/* Warm Champagne Gold Metallic Helium Gradient */}
          <radialGradient id="balloon-gold" cx="35%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#fff7dc" />
            <stop offset="22%" stopColor="#f7d483" />
            <stop offset="55%" stopColor="#c8963e" />
            <stop offset="85%" stopColor="#96691c" />
            <stop offset="100%" stopColor="#5c3f0b" />
          </radialGradient>

          {/* Soft Rose Gold Helium Gradient */}
          <radialGradient id="balloon-rose" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffe9ed" />
            <stop offset="26%" stopColor="#f3a7b5" />
            <stop offset="65%" stopColor="#c76275" />
            <stop offset="92%" stopColor="#852e3e" />
            <stop offset="100%" stopColor="#521521" />
          </radialGradient>

          {/* Cream Ivory Pearl Helium Gradient */}
          <radialGradient id="balloon-champagne" cx="34%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fcf4e8" />
            <stop offset="68%" stopColor="#dfcbaf" />
            <stop offset="92%" stopColor="#ab9475" />
            <stop offset="100%" stopColor="#7a6448" />
          </radialGradient>

          {/* Rich Ruby Red Helium Gradient */}
          <radialGradient id="balloon-ruby" cx="33%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#ff5779" />
            <stop offset="28%" stopColor="#d11a43" />
            <stop offset="68%" stopColor="#820924" />
            <stop offset="95%" stopColor="#45000f" />
          </radialGradient>
        </defs>
      </svg>

      {/* Render Each Helium Balloon Rising from Bottom to Up */}
      {allBalloons.map((balloon) => {
        const isPopped = poppedMap[balloon.id];
        if (isPopped) return null;

        const stringColor =
          balloon.color === 'gold' || balloon.color === 'champagne'
            ? '#ab844c'
            : balloon.color === 'rose'
            ? '#d89ba6'
            : '#8b1538';

        return (
          <div
            key={balloon.id}
            className="absolute"
            style={{
              left: balloon.left,
              top: 0,
              width: `${balloon.size}px`,
              height: `${balloon.size * 2.8}px`,
              zIndex: balloon.zIndex,
              opacity: balloon.opacity,
              animation: `floatUpInfinite ${balloon.duration}s linear infinite`,
              animationDelay: `${balloon.delay}s`,
            }}
          >
            {/* Inner Container for buoyant horizontal rocking/swaying */}
            <div
              onClick={(e) => handleBalloonClick(balloon, e)}
              className="w-full h-full cursor-pointer pointer-events-auto transition-transform hover:scale-110 active:scale-95 duration-200"
              style={
                {
                  '--sway': `${balloon.swayDistance}px`,
                  '--rot': `${balloon.rotationDeg}deg`,
                  animation: `swaySideToSide ${balloon.swayDuration}s ease-in-out infinite alternate`,
                  animationDelay: `${balloon.delay * 0.4}s`,
                } as React.CSSProperties
              }
              title="Tap balloon! ✨"
            >
              <svg
                viewBox="0 0 100 280"
                className="w-full h-full overflow-visible drop-shadow-[0_12px_22px_rgba(58,6,20,0.18)]"
              >
                {/* 1. Dangling Curly Balloon Ribbon / String */}
                <path
                  d="M 50,107 C 43,130 58,155 48,180 C 38,205 56,230 48,255 C 43,275 52,295 48,315"
                  fill="none"
                  stroke={stringColor}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.75"
                />

                {/* Optional Decorative Ribbon Tag */}
                {balloon.hasRibbonTag && (
                  <g transform="translate(48, 142) rotate(12)">
                    <rect
                      x="-8"
                      y="-7"
                      width="24"
                      height="15"
                      rx="2"
                      fill="#fdfbf7"
                      stroke="#d8c29d"
                      strokeWidth="0.8"
                    />
                    <text
                      x="4"
                      y="4"
                      textAnchor="middle"
                      fontSize="9"
                      fill="#5c061d"
                      fontFamily="serif"
                    >
                      {balloon.tagText || '♥'}
                    </text>
                  </g>
                )}

                {/* 2. Balloon Tied Knot / Neck */}
                <polygon
                  points="45,100 55,100 52,107 48,107"
                  fill={`url(#balloon-${balloon.color})`}
                />
                <ellipse
                  cx="50"
                  cy="102"
                  rx="4.5"
                  ry="2.5"
                  fill={`url(#balloon-${balloon.color})`}
                />

                {/* 3. Plump 3D Balloon Body */}
                <path
                  d="M 50,6 C 24,6 10,26 10,54 C 10,82 36,98 46,101 L 54,101 C 64,98 90,82 90,54 C 90,26 76,6 50,6 Z"
                  fill={`url(#balloon-${balloon.color})`}
                />

                {/* 4. Specular Curved Light Reflection / Gloss */}
                {/* Primary Oval Highlight */}
                <ellipse
                  cx="33"
                  cy="32"
                  rx="7"
                  ry="17"
                  transform="rotate(-28 33 32)"
                  fill="#ffffff"
                  opacity="0.48"
                />
                {/* Secondary Sharp Specular Glint */}
                <ellipse
                  cx="37"
                  cy="25"
                  rx="3"
                  ry="6"
                  transform="rotate(-28 37 25)"
                  fill="#ffffff"
                  opacity="0.75"
                />

                {/* Subtle Translucent Bottom-Right Rim Reflection */}
                <path
                  d="M 66,86 C 76,76 85,63 86,54 C 85,66 74,80 66,86 Z"
                  fill="#ffffff"
                  opacity="0.22"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
