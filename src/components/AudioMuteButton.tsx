import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../utils/audio';

interface AudioMuteButtonProps {
  className?: string;
}

interface FloatingNote {
  id: number;
  symbol: string;
  x: number;
  y: number;
  color: string;
}

const NOTE_COLORS = [
  '#ffd700', // Bright Gold
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#fbbf24', // Warm Gold
  '#38bdf8', // Sky Blue
];

export const AudioMuteButton: React.FC<AudioMuteButtonProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [isPlaying, setIsPlaying] = useState<boolean>(soundEngine.getIsPlaying());
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(soundEngine.getIsVaultUnlocked());
  const [showTooltip, setShowTooltip] = useState(false);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((state) => {
      setIsMuted(state.isMuted);
      setIsPlaying(state.isPlaying);
      setIsVaultUnlocked(state.isVaultUnlocked);
    });
    return () => unsubscribe();
  }, []);

  // Gentle floating notes while music is actively playing
  useEffect(() => {
    if (isMuted || !isPlaying) return;

    const interval = setInterval(() => {
      const symbols = ['♪', '♫', '♩', '♬', '✦'];
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
      const id = Date.now() + Math.random();
      const offsetX = (Math.random() - 0.5) * 30;

      setFloatingNotes((prev) => [
        ...prev.slice(-4),
        { id, symbol: randomSymbol, x: offsetX, y: 0, color: randomColor },
      ]);

      setTimeout(() => {
        setFloatingNotes((prev) => prev.filter((n) => n.id !== id));
      }, 1600);
    }, 1700);

    return () => clearInterval(interval);
  }, [isMuted, isPlaying]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = soundEngine.toggleMute();

    // Burst of festive notes on click
    if (!newMuted) {
      const symbols = ['♪', '♫', '✦', '♬'];
      const newItems = symbols.map((sym, idx) => ({
        id: Date.now() + idx,
        symbol: sym,
        x: (idx - 1.5) * 20,
        y: 0,
        color: NOTE_COLORS[idx % NOTE_COLORS.length],
      }));
      setFloatingNotes((prev) => [...prev, ...newItems]);
      setTimeout(() => {
        setFloatingNotes([]);
      }, 1500);
    }
  };

  const isActive = !isMuted && isPlaying;

  return (
    <div className={`fixed bottom-5 right-5 z-50 select-none ${className}`}>
      <div className="relative flex items-center justify-center">

        {/* Floating Musical Notes Animation */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <AnimatePresence>
            {floatingNotes.map((note) => (
              <motion.span
                key={note.id}
                initial={{ opacity: 0.95, y: 0, x: note.x, scale: 0.8, rotate: 0 }}
                animate={{
                  opacity: 0,
                  y: -50,
                  x: note.x + (Math.random() * 20 - 10),
                  scale: [0.8, 1.25, 0.9],
                  rotate: (Math.random() - 0.5) * 40,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ color: note.color }}
                className="absolute font-serif text-sm sm:text-base font-bold select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              >
                {note.symbol}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2.5 px-3 py-1.5 rounded-xl bg-[#2b040e] text-[#fbf5eb] text-xs font-serif whitespace-nowrap shadow-xl pointer-events-none z-50 flex items-center gap-1.5 border border-[#ffd700]/40"
            >
              <span>
                {isMuted
                  ? 'Music Muted (Click to play)'
                  : isPlaying
                  ? 'Music Playing (Click to mute)'
                  : isVaultUnlocked
                  ? 'Click to start music'
                  : 'Music starts once vault unlocks'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Ripple Rings in Golden Tone when Active */}
        {isActive && (
          <>
            <span className="absolute -inset-2.5 rounded-full border-2 border-[#ffd700]/40 animate-ping pointer-events-none" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
              className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#ffd700]/60 pointer-events-none"
            />
          </>
        )}

        {/* High-Contrast Circular Button: Rich Burgundy Canvas */}
        <motion.button
          type="button"
          onClick={handleToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isMuted ? 'Play background music' : 'Mute background music'}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md shadow-lg ${
            isActive
              ? 'bg-gradient-to-br from-[#5c061d] via-[#400312] to-[#250209] border-2 border-[#ffd700] shadow-[0_6px_22px_rgba(92,6,29,0.5)] hover:border-[#fff089]'
              : isMuted
              ? 'bg-gradient-to-br from-[#3d0918] via-[#2a0610] to-[#1a0208] border-2 border-[#ab844c]/70 hover:border-[#ffd700]'
              : 'bg-gradient-to-br from-[#5c061d] via-[#400312] to-[#250209] border-2 border-[#ffd700]'
          }`}
        >
          {/* Concentric inner gold accent ring */}
          <div
            className={`absolute inset-1 rounded-full border transition-colors duration-300 pointer-events-none ${
              isActive ? 'border-[#ffd700]/35' : 'border-[#d4af37]/25'
            }`}
          />

          {/* Clean, Sharp, 100% Visible Music Note Symbol */}
          <AnimatePresence mode="wait" initial={false}>
            {isActive ? (
              <motion.div
                key="active-music"
                initial={{ scale: 0.7, rotate: -15, opacity: 0 }}
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 4, -4, 0],
                  opacity: 1,
                }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{
                  scale: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' },
                  rotate: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                }}
                className="relative flex items-center justify-center"
              >
                {/* Crystal Clear Vector Music Note: Hollow middle, solid noteheads, razor-sharp lines */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Crisp Stems and Connecting Beam */}
                  <path
                    d="M9 18V5l12-2v13"
                    stroke="#ffd700"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Two Distinct Filled Noteheads */}
                  <circle cx="6" cy="18" r="3" fill="#ffd700" stroke="#ffd700" strokeWidth="0.8" />
                  <circle cx="18" cy="16" r="3" fill="#ffd700" stroke="#ffd700" strokeWidth="0.8" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="muted-music"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                {/* Crisp Music Note in Muted State */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18V5l12-2v13"
                    stroke="#e2d4c0"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="6" cy="18" r="3" fill="#e2d4c0" stroke="#e2d4c0" strokeWidth="0.8" />
                  <circle cx="18" cy="16" r="3" fill="#e2d4c0" stroke="#e2d4c0" strokeWidth="0.8" />
                </svg>

                {/* Clear, Bright Diagonal Red Slash for Muted State */}
                {isMuted && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-8 h-[2.5px] bg-[#ef4444] rotate-45 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
