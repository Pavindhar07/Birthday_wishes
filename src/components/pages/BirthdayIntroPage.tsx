import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';
import { HeliumBalloons } from '../HeliumBalloons';

interface BirthdayIntroPageProps {
  friendName: string;
  bgImage?: string;
  onContinue: () => void;
}

export const BirthdayIntroPage: React.FC<BirthdayIntroPageProps> = ({
  friendName,
  bgImage,
  onContinue,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Typewriter state
  const firstPhrase = "Happy Birthday,";
  const secondPhrase = friendName;

  const [typedFirst, setTypedFirst] = useState("");
  const [typedSecond, setTypedSecond] = useState("");
  const [phase, setPhase] = useState<'badge' | 'first' | 'second' | 'done'>('badge');
  const [showSubtitles, setShowSubtitles] = useState(false);

  useEffect(() => {
    // Stage 1: Badge appears first
    const badgeTimer = setTimeout(() => {
      setPhase('first');
    }, 600);

    return () => clearTimeout(badgeTimer);
  }, []);

  useEffect(() => {
    if (phase === 'first') {
      let currentLen = 0;
      setTypedFirst("");
      const timer = setInterval(() => {
        if (currentLen < firstPhrase.length) {
          currentLen++;
          setTypedFirst(firstPhrase.slice(0, currentLen));
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setPhase('second');
          }, 600);
        }
      }, 150); // Slower, relaxed typing speed for "Happy Birthday,"

      return () => clearInterval(timer);
    }

    if (phase === 'second') {
      let currentLen = 0;
      setTypedSecond("");
      const timer = setInterval(() => {
        if (currentLen < secondPhrase.length) {
          currentLen++;
          setTypedSecond(secondPhrase.slice(0, currentLen));
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setPhase('done');
            setShowSubtitles(true);
            soundEngine.playSuccessChime();
          }, 650);
        }
      }, 180); // Slower, gentle typing speed for friend's name

      return () => clearInterval(timer);
    }
  }, [phase, firstPhrase, secondPhrase]);

  const handleSkipTypewriter = () => {
    soundEngine.playClick();
    setTypedFirst(firstPhrase);
    setTypedSecond(secondPhrase);
    setPhase('done');
    setShowSubtitles(true);
  };

  const handleProceed = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    soundEngine.playSuccessChime();

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#5c061d', '#8b1538', '#ab844c', '#d4af37', '#fcf9f2', '#f43f5e'],
    });

    setTimeout(() => {
      onContinue();
    }, 450);
  };

  // Washi tape sticker positions matching vintage aesthetic
  const washiTapes = [
    { id: 1, text: 'forever thankful ✨', top: '9%', left: '7%', rotate: '-12deg' },
    { id: 2, text: 'wishes from pavi ♥', top: '32%', right: '23%', rotate: '8deg' },
    { id: 3, text: 'core memories ✨', top: '65%', left: '33%', rotate: '-3deg' },
    { id: 4, text: 'best friends always ♥', bottom: '38%', right: '4%', rotate: '15deg' },
  ];

  // Subtle floating background symbols
  const backgroundFlakes = [
    { id: 'f1', symbol: '♥', top: '4%', right: '26%', size: 'text-xs', opacity: 'opacity-40', delay: 0.2 },
    { id: 'f2', symbol: '✦', top: '5%', left: '23%', size: 'text-sm', opacity: 'opacity-30', delay: 0.4 },
    { id: 'f3', symbol: '🌸', top: '11%', left: '3%', size: 'text-sm', opacity: 'opacity-50', delay: 0.6 },
    { id: 'f4', symbol: '✦', top: '15%', left: '31%', size: 'text-xs', opacity: 'opacity-35', delay: 0.8 },
    { id: 'f5', symbol: '🌸', top: '16%', right: '34%', size: 'text-xs', opacity: 'opacity-40', delay: 1 },
    { id: 'f6', symbol: '♥', top: '31%', left: '40%', size: 'text-xs', opacity: 'opacity-35', delay: 0.3 },
    { id: 'f7', symbol: '♥', top: '35%', right: '21%', size: 'text-xs', opacity: 'opacity-45', delay: 0.5 },
    { id: 'f8', symbol: '♥', top: '44%', left: '48%', size: 'text-sm', opacity: 'opacity-40', delay: 0.7 },
    { id: 'f9', symbol: '✦', top: '60%', left: '19%', size: 'text-xs', opacity: 'opacity-50', delay: 0.9 },
    { id: 'f10', symbol: '✦', top: '68%', left: '31%', size: 'text-xs', opacity: 'opacity-40', delay: 1.1 },
    { id: 'f11', symbol: '✦', bottom: '5%', left: '55%', size: 'text-sm', opacity: 'opacity-40', delay: 0.4 },
    { id: 'f12', symbol: '🌸', bottom: '12%', right: '5%', size: 'text-xs', opacity: 'opacity-50', delay: 0.8 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 overflow-hidden bg-[#fbf5eb] text-center select-none">
      
      {/* Semi-Transparent Sample Background Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={bgImage || "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1920&auto=format&fit=crop"}
          alt="Festive Birthday Atmosphere"
          className="w-full h-full object-cover object-center opacity-55 mix-blend-multiply filter contrast-110 saturate-90"
          referrerPolicy="no-referrer"
        />
        {/* Soft Vignette & Warm Tint Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf5eb]/35 via-[#fbf5eb]/20 to-[#fbf5eb]/45" />
      </div>

      {/* Helium Balloons Floating from Bottom to Up */}
      <HeliumBalloons />

      {/* Warm Ambient Radial Backdrop Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#f5ecd9]/50 via-[#edd9be]/40 to-[#5c061d]/5 rounded-full blur-[140px]" />
      </div>

      {/* Floating Washi Tapes */}
      {washiTapes.map((w, idx) => (
        <motion.div
          key={w.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.75, 1, 0.75],
            y: [0, idx % 2 === 0 ? -6 : 6, 0],
            rotate: [w.rotate, `${parseFloat(w.rotate) + (idx % 2 === 0 ? 2 : -2)}deg`, w.rotate],
          }}
          transition={{
            opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 4 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 5 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' },
            delay: idx * 0.3,
          }}
          className="hidden md:flex absolute items-center gap-1 px-3 py-1 bg-[#fcf9f2] border border-[#d8c29d] rounded-xs shadow-xs text-[11px] font-normal text-[#5c061d] tracking-wider pointer-events-none"
          style={{
            top: (w as any).top,
            bottom: (w as any).bottom,
            left: (w as any).left,
            right: (w as any).right,
            transform: `rotate(${w.rotate})`,
          }}
        >
          <span>{w.text}</span>
        </motion.div>
      ))}

      {/* Scattered Ambient Background Flakes */}
      {backgroundFlakes.map((f) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.25, 0.6, 0.25],
            y: [0, -8, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: f.delay,
            ease: 'easeInOut',
          }}
          className={`absolute pointer-events-none hidden sm:block ${f.size} ${f.opacity} text-[#ab844c]`}
          style={{
            top: (f as any).top,
            bottom: (f as any).bottom,
            left: (f as any).left,
            right: (f as any).right,
          }}
        >
          {f.symbol}
        </motion.div>
      ))}

      {/* Main Center Content Container */}
      <div className="relative max-w-4xl w-full mx-auto flex flex-col items-center justify-center space-y-7 sm:space-y-9 py-6 px-4">

        {/* 1. Pill Badge at Top */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2 rounded-full border border-[#d8c29d] bg-[#fcf9f2]/25 shadow-[0_2px_15px_rgba(92,6,29,0.05)] backdrop-blur-[1px] text-[#5c061d] text-[10px] sm:text-xs font-normal tracking-[0.24em] uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ab844c]" />
          <span>TODAY IS THE DAY SOMEONE VERY SPECIAL WAS BORN</span>
          <Sparkles className="w-3.5 h-3.5 text-[#ab844c]" />
        </motion.div>

        {/* 2. Big Title: Typewriter "Happy Birthday, Alex ❤️" */}
        <div className="space-y-2 min-h-[140px] sm:min-h-[180px] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            
            {/* Line 1: "Happy Birthday," */}
            <h1 className="text-[clamp(2.7rem,9vw,6rem)] text-[#5c061d] font-normal tracking-tight leading-tight flex items-center justify-center">
              <span>{typedFirst}</span>
              {phase === 'first' && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="inline-block w-1 sm:w-1.5 h-8 sm:h-16 bg-[#5c061d] ml-1 rounded-xs"
                />
              )}
            </h1>
            
            {/* Line 2: "Alex" + Animated Heart */}
            <div className="inline-flex items-center justify-center gap-3 sm:gap-5 mt-1 sm:mt-2 min-h-[60px] sm:min-h-[90px]">
              {(phase === 'second' || phase === 'done') && (
                <span className="text-[clamp(2.8rem,9vw,5.7rem)] text-[#ab844c] italic font-normal tracking-tight flex items-center">
                  <span>{typedSecond}</span>
                  {phase === 'second' && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                      className="inline-block w-1 sm:w-1.5 h-8 sm:h-16 bg-[#ab844c] ml-1 rounded-xs"
                    />
                  )}
                </span>
              )}
              
              {/* Glowing Heart with Pop-in when Name finishes */}
              <AnimatePresence>
                {(phase === 'done' || (phase === 'second' && typedSecond.length >= secondPhrase.length)) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -25 }}
                    animate={{
                      opacity: 1,
                      scale: [1, 1.15, 1, 1.1, 1],
                      rotate: 0,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      scale: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                      opacity: { duration: 0.4 },
                      rotate: { duration: 0.4 },
                    }}
                    className="cursor-pointer inline-flex items-center justify-center"
                    onClick={() => {
                      soundEngine.playSuccessChime();
                      confetti({
                        particleCount: 40,
                        spread: 60,
                        origin: { y: 0.5 },
                        colors: ['#5c061d', '#ab844c', '#e6cb9d'],
                      });
                    }}
                    title="Tap for love! ♥"
                  >
                    <span className="text-[clamp(2.5rem,8vw,4.5rem)] select-none text-[#5c061d] transform hover:scale-125 transition-transform duration-300">
                      ♥
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* 3. Poetic Lines */}
        <AnimatePresence>
          {showSubtitles && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5 max-w-xl mx-auto"
            >
              <p className="text-base sm:text-xl text-[#5c061d]/85 italic font-normal tracking-wide">
                "Today isn't just another day..."
              </p>
              <p className="text-base sm:text-xl text-[#5c061d] font-normal tracking-wide">
                Today is the day someone very special was born.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Highlight Beige & Burgundy Card */}
        <AnimatePresence>
          {showSubtitles && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="w-full max-w-2xl px-6 sm:px-10 py-5 sm:py-6 rounded-2xl sm:rounded-[2.2rem] bg-[#fcf9f2] border border-[#d8c29d] shadow-[0_12px_35px_rgba(92,6,29,0.06)] relative overflow-hidden"
            >
              <p className="text-xl sm:text-2xl lg:text-3xl text-[#5c061d] tracking-wide leading-relaxed font-normal relative z-10">
                And somehow, I got lucky enough to call you my best friend.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Animated Interactive Button to Proceed to Gallery */}
        <AnimatePresence>
          {showSubtitles && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pt-3"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleProceed}
                className="group flex items-center gap-3 px-8 sm:px-11 py-4 rounded-xl sm:rounded-2xl bg-[#5c061d] hover:bg-[#700924] text-[#fbf5eb] font-normal text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_12px_30px_rgba(92,6,29,0.2)] border border-[#480315] cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#e6cb9d] animate-spin" />
                <span>Enter Floating Memories Gallery</span>
                <ArrowRight className="w-4 h-4 text-[#e6cb9d] group-hover:translate-x-1.5 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
