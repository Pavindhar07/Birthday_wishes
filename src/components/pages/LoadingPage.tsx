import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Gift, Cake, Music, Crown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingPageProps {
  friendName: string;
  onComplete: () => void;
}

const MESSAGES = [
  "Unlocking core memories vault...",
  "Dusting off vintage polaroid photos...",
  "Unsealing the wax-stamped royal letter...",
  "Baking champagne birthday cake...",
  "Tuning the ambient melody...",
  "Preparing the grand surprise reveal..."
];

export const LoadingPage: React.FC<LoadingPageProps> = ({ friendName, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const intervalTime = 22; // ~2.2s total duration
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    const msgTimer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl sm:rounded-[2.5rem] bg-[#fcf9f2] border border-[#d8c29d] shadow-[0_20px_60px_rgba(92,6,29,0.1)] flex flex-col items-center space-y-6 text-[#5c061d]"
      >
        {/* Inner hairline border ring */}
        <div className="absolute inset-2 sm:inset-3 rounded-[1.5rem] sm:rounded-[2.1rem] border border-[#d8c29d]/50 pointer-events-none" />

        {/* Pulsing Multi-Ring Circular Loader in Burgundy & Gold */}
        <div className="relative w-36 h-36 flex items-center justify-center pt-2">
          <motion.div
            animate={{ scale: [1, 1.12, 1], rotate: 360 }}
            transition={{
              scale: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 12, ease: 'linear' },
            }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#d8c29d]"
          />

          <motion.div
            animate={{ scale: [1.08, 0.95, 1.08], rotate: -360 }}
            transition={{
              scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 16, ease: 'linear' },
            }}
            className="absolute inset-2 rounded-full border border-dashed border-[#ab844c]/60"
          />

          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="72"
              cy="72"
              r="58"
              className="stroke-[#f5ecdf]"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="58"
              className="stroke-[#5c061d] transition-all duration-75 ease-out"
              strokeWidth="6"
              strokeDasharray={364.42}
              strokeDashoffset={364.42 - (364.42 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Icon Animation */}
          <div className="absolute inset-0 flex items-center justify-center text-[#5c061d]">
            <AnimatePresence mode="wait">
              <motion.div
                key={msgIdx}
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                transition={{ duration: 0.25 }}
              >
                {msgIdx % 6 === 0 && <Crown className="w-10 h-10 text-[#ab844c]" />}
                {msgIdx % 6 === 1 && <Sparkles className="w-10 h-10 text-[#5c061d]" />}
                {msgIdx % 6 === 2 && <Heart className="w-10 h-10 fill-[#5c061d] text-[#5c061d]" />}
                {msgIdx % 6 === 3 && <Cake className="w-10 h-10 text-[#ab844c]" />}
                {msgIdx % 6 === 4 && <Star className="w-10 h-10 text-[#ab844c] fill-[#ab844c]/30" />}
                {msgIdx % 6 === 5 && <Gift className="w-10 h-10 text-[#5c061d]" />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f5ecdf] border border-[#d8c29d] text-[#5c061d] text-[11px] font-normal tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#ab844c]" />
            <span>Opening Secret Vault</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-normal text-[#5c061d] tracking-tight font-display">
            Opening for <span className="italic text-[#ab844c]">{friendName}</span>
          </h2>
          <p className="text-xs text-[#5c061d]/80 font-normal">
            Preparing your private birthday celebration...
          </p>
        </div>

        {/* Animated Cycling Message */}
        <div className="h-8 flex items-center justify-center w-full px-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-xs font-normal text-[#5c061d] tracking-wide bg-[#f5ecdf] px-4 py-1.5 rounded-full border border-[#d8c29d]"
            >
              {MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-2 pt-1">
          <div className="w-full bg-[#f5ecdf] h-3 rounded-full overflow-hidden p-0.5 border border-[#d8c29d] shadow-inner">
            <motion.div
              className="bg-[#5c061d] h-full rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between text-xs font-normal text-[#5c061d]/85 px-1">
            <span className="text-[#ab844c]">Syncing Vault...</span>
            <span className="text-[#5c061d] font-bold">{progress}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
