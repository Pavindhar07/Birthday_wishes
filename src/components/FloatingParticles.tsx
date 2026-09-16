import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FloatingParticlesProps {
  theme?: 'hearts' | 'sparkles' | 'balloons' | 'mixed';
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ theme = 'mixed' }) => {
  const particleCount = 28;

  const particles = useMemo(() => {
    const symbols = {
      hearts: ['♥', '✨', '🌸', '✦', '💫', '♥', '✨', '🕊️'],
      sparkles: ['✦', '✨', '⭐', '🌟', '💫', '✦', '🌿', '🗝️'],
      balloons: ['🎈', '🥂', '🎁', '🎉', '✦', '♥', '✨', '🍾'],
      mixed: ['♥', '✨', '✦', '🌿', '🌸', '🗝️', '🥂', '🎁', '💫', '⭐'],
    }[theme];

    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 18) + 14, // 14px to 32px
      duration: Math.random() * 14 + 12, // 12s to 26s
      delay: Math.random() * 8,
      initialRotation: Math.floor(Math.random() * 360),
      xAmplitude: Math.random() * 80 - 40,
    }));
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Luxury Warm Champagne & Burgundy Atmospheric Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#f5ebd9]/60 via-[#edd9be]/40 to-[#5c061d]/5 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-[#edd9be]/35 rounded-full blur-[130px]" />
      <div className="absolute bottom-10 right-0 w-[550px] h-[550px] bg-[#f5ebd9]/50 rounded-full blur-[130px]" />

      {/* Subtle Dot Mesh Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ab844c_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />

      {/* Floating Animated Emojis / Glyphs */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none text-[#ab844c] opacity-60 drop-shadow-xs"
          style={{
            left: p.left,
            bottom: '-10%',
            fontSize: `${p.size}px`,
          }}
          animate={{
            y: ['0vh', '-115vh'],
            x: [0, p.xAmplitude, -p.xAmplitude, 0],
            rotate: [p.initialRotation, p.initialRotation + 180],
            opacity: [0, 0.65, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};
