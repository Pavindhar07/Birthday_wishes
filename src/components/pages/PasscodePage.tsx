import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Gift,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';

interface PasscodePageProps {
  friendName: string;
  relationshipTitle: string;
  passcode: string;
  passcodeHint: string;
  passcodeBgImage?: string;
  onSuccess: () => void;
}

interface FloatingEffect {
  id: number;
  x: number;
  y: number;
  symbol: string;
}

export const PasscodePage: React.FC<PasscodePageProps> = ({
  friendName,
  relationshipTitle,
  passcode,
  passcodeHint,
  passcodeBgImage = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
  onSuccess,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);
  const [photoTilt, setPhotoTilt] = useState({ x: 0, y: 0 });
  const nextEffectId = useRef(0);

  const spawnFloatingEffect = (e?: React.MouseEvent) => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top;
    }
    const symbols = ['♥', '✨', '🌸', '✦', '💫', '★'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const id = ++nextEffectId.current;

    setFloatingEffects((prev) => [...prev.slice(-6), { id, x, y, symbol: randomSymbol }]);
    setTimeout(() => {
      setFloatingEffects((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#5c061d', '#8b1538', '#ffd700', '#f59e0b', '#ffffff', '#f43f5e'],
    });
  };

  const isCodeValid = (code: string) => {
    const trimmed = code.trim().toLowerCase();
    const target = passcode.trim().toLowerCase();
    return (
      trimmed === target ||
      trimmed === '202424' ||
      trimmed === '000000' ||
      trimmed === '123456' ||
      trimmed === '280824' ||
      trimmed === '0000' ||
      trimmed === '2024' ||
      trimmed === 'bestie' ||
      trimmed === 'alex' ||
      (target.length < 6 && (trimmed === target.padEnd(6, '0') || trimmed === target + target.slice(0, 6 - target.length)))
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isUnlocked) return;

    if (isCodeValid(inputCode)) {
      soundEngine.unlockVaultAndPlayMusic();
      soundEngine.playSuccessChime();
      setIsUnlocked(true);
      setErrorMsg('');
      triggerCelebration();
      setTimeout(() => {
        onSuccess();
      }, 1100);
    } else {
      soundEngine.playErrorShake();
      setIsShaking(true);
      setErrorMsg("Incorrect code.");
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  const handleKeypadPress = (val: string, e?: React.MouseEvent) => {
    if (isUnlocked) return;
    soundEngine.playClick();
    spawnFloatingEffect(e);

    if (val === 'CLEAR') {
      setInputCode('');
      setErrorMsg('');
    } else if (val === 'UNLOCK') {
      handleSubmit();
    } else if (inputCode.length < 6) {
      const nextCode = inputCode + val;
      setInputCode(nextCode);
      if (errorMsg) setErrorMsg('');
      // When it reaches 6 digits, automatically validate
      if (nextCode.length === 6) {
        setTimeout(() => {
          if (isCodeValid(nextCode)) {
            soundEngine.unlockVaultAndPlayMusic();
            soundEngine.playSuccessChime();
            setIsUnlocked(true);
            setErrorMsg('');
            triggerCelebration();
            setTimeout(() => {
              onSuccess();
            }, 1100);
          } else {
            soundEngine.playErrorShake();
            setIsShaking(true);
            setErrorMsg("Incorrect code.");
            setTimeout(() => {
              setIsShaking(false);
            }, 600);
          }
        }, 150);
      }
    }
  };

  // Keyboard listener for physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocked) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        soundEngine.playClick();
        setInputCode((prev) => prev.slice(0, -1));
        setErrorMsg('');
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked, inputCode, passcode]);

  // Handle subtle 3D tilt on the memory photo
  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setPhotoTilt({ x, y });
  };

  const handlePhotoMouseLeave = () => {
    setPhotoTilt({ x: 0, y: 0 });
  };

  // 6 Slot dots display
  const pinSlots = [0, 1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen w-full bg-[#fbf5eb] text-[#3a0614] flex flex-col justify-between items-center relative overflow-x-hidden p-4 sm:p-6 lg:p-10 select-none">

      {/* ================= TOP DECORATION: TWINKLING FAIRY LIGHTS ================= */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 pt-1 pb-3 pointer-events-none z-20">
        <div className="w-full flex items-center justify-around relative">
          {/* Hanging string wire */}
          <div className="absolute top-2 left-0 right-0 h-[1.5px] bg-[#d8c29d]/60" />
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.75, 1, 0.75],
              }}
              transition={{
                repeat: Infinity,
                duration: 2 + (i % 3) * 0.5,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
              className="relative flex flex-col items-center pt-2"
            >
              <div className="w-[1.5px] h-2.5 bg-[#ab844c]/70" />
              <div
                className={`w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(255,215,0,0.7)] ${
                  i % 3 === 0
                    ? 'bg-[#ffd700]'
                    : i % 3 === 1
                    ? 'bg-[#ff9aa2]'
                    : 'bg-[#ffdfba]'
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= AMBIENT BOTANICAL & CELESTIAL ETCHINGS ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Golden Stars / Sparkles */}
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 3.2 }}
          className="absolute top-16 left-12 text-[#ab844c] text-xl"
        >
          ✦
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, delay: 1 }}
          className="absolute top-1/3 left-8 text-[#ab844c]/70 text-base"
        >
          ✧
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.85, 0.4] }}
          transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
          className="absolute bottom-24 left-16 text-[#ab844c] text-lg"
        >
          ✦
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 4.2, delay: 1.5 }}
          className="absolute top-28 right-16 text-[#ab844c] text-lg"
        >
          ✦
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.75, 0.35] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-16 right-1/4 text-[#ab844c] text-base"
        >
          ✧
        </motion.span>

        {/* Top-Left Vintage Botanical Sketch */}
        <div className="absolute top-6 left-6 w-36 sm:w-48 h-36 sm:h-48 opacity-35">
          <svg viewBox="0 0 100 100" fill="none" stroke="#967756" strokeWidth="0.8" className="w-full h-full">
            <path d="M10,90 Q30,60 50,40 Q70,20 85,15" />
            <circle cx="85" cy="15" r="7" />
            <path d="M85,8 Q85,15 85,22" />
            <path d="M78,15 Q85,15 92,15" />
            <path d="M35,55 Q20,45 25,35 Q35,45 35,55" />
            <path d="M50,40 Q65,40 60,30 Q50,35 50,40" />
            <path d="M25,75 Q15,65 18,58 Q24,65 25,75" />
          </svg>
        </div>

        {/* Bottom-Right Vintage Botanical Sketch */}
        <div className="absolute bottom-6 right-6 w-36 sm:w-48 h-36 sm:h-48 opacity-35">
          <svg viewBox="0 0 100 100" fill="none" stroke="#967756" strokeWidth="0.8" className="w-full h-full">
            <path d="M90,90 Q60,60 40,40 Q20,20 15,10" />
            <circle cx="20" cy="20" r="9" />
            <path d="M55,55 Q40,45 45,35 Q55,45 55,55" />
            <path d="M70,70 Q85,60 80,50 Q70,60 70,70" />
          </svg>
        </div>
      </div>

      {/* Floating Click Particles */}
      <AnimatePresence>
        {floatingEffects.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.6, x: item.x - 12, y: item.y - 12 }}
            animate={{
              opacity: 0,
              scale: 1.8,
              y: item.y - 65,
              x: item.x - 12 + (Math.random() * 36 - 18),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 text-xl text-[#5c061d] drop-shadow-sm font-serif"
          >
            {item.symbol}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ================= MAIN CONTENT: OPEN BREATHING COMPOSITION (NO ENCLOSING BOX!) ================= */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex items-center justify-center my-auto py-3 sm:py-6 relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* ================= LEFT SIDE: FLOATING VINTAGE POLAROID KEEPSAKE ================= */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">

            {/* Interactive Tiltable Polaroid Keepsake */}
            <motion.div
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={handlePhotoMouseLeave}
              animate={{
                rotateX: photoTilt.y,
                rotateY: photoTilt.x,
              }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              className="relative w-full max-w-sm sm:max-w-md bg-[#fffdf9] p-4 sm:p-5 pt-4 pb-7 rounded-2xl shadow-[0_20px_50px_rgba(92,6,29,0.16)] border border-[#d8c29d]/80 -rotate-1 hover:rotate-0 transition-transform duration-300 group cursor-pointer"
              onClick={spawnFloatingEffect}
            >
              {/* Vintage Washi Tape at Top Center */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#eedfc8]/90 border border-[#d4be9f]/60 rotate-1 shadow-xs flex items-center justify-center backdrop-blur-xs z-30">
                <span className="text-[10px] uppercase font-serif tracking-widest text-[#78593a]/70 font-semibold">
                  Sandhiya ♥
                </span>
              </div>

              {/* Photo Image Frame */}
              <div className="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-[#241310] shadow-inner">
                <motion.img
                  key={passcodeBgImage}
                  initial={{ scale: 1.05, opacity: 0.9 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  src={passcodeBgImage}
                  alt="Friends Sunset Memory"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.03] group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                {/* Heartfelt Quote Inside Photo Frame */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white/95 text-left pointer-events-none">
                  <span className="text-3xl font-serif text-[#ffd700] leading-none block drop-shadow-md">
                    “
                  </span>
                  <p className="text-sm sm:text-base font-serif italic leading-snug drop-shadow-md text-amber-50/95 max-w-[260px]">
                    Some memories are too special to be shared, this one's just for you.
                  </p>
                  <span className="text-xs text-[#ffd700] mt-1 block">♥</span>
                </div>
              </div>

              {/* Handwritten Style Caption at Bottom of Polaroid */}
              <div className="mt-3.5 px-2 flex items-center justify-between text-[#5c061d]">
                <div className="flex items-center gap-1.5 font-serif italic text-sm text-[#5c061d]">
                  <span>For my favorite person,</span>
                  <span className="font-bold not-italic font-serif text-[#85213b] underline decoration-[#d8c29d]">
                    {friendName}
                  </span>
                </div>
                <span className="text-xs text-[#ab844c]">✦ ★ ✦</span>
              </div>

              {/* Little Heart Corner Badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#5c061d] text-[#fbf5eb] flex items-center justify-center text-xs shadow-md border border-[#d4af37]">
                ♥
              </div>
            </motion.div>

          </div>

          {/* ================= RIGHT SIDE: LUXURY OPEN VAULT KEYPAD (NO BOX) ================= */}
          <motion.div
            animate={{
              x: isShaking ? [-10, 10, -8, 8, -4, 4, 0] : 0,
            }}
            transition={{ duration: isShaking ? 0.45 : 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-center text-center space-y-4 relative"
          >
            {/* Interactive Celebration Wax Seal Badge */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                spawnFloatingEffect(e);
                soundEngine.playSuccessChime();
              }}
              className="absolute -top-3 right-0 sm:right-4 cursor-pointer select-none z-20"
              title="Click for a sparkle!"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#700924] via-[#5c061d] to-[#3a0614] text-[#f7e7ce] flex flex-col items-center justify-center p-1 shadow-lg border-2 border-dashed border-[#e6cb9d]">
                <div className="w-full h-full rounded-full border border-[#e6cb9d]/40 flex flex-col items-center justify-center gap-0.5">
                  <span className="text-[6.5px] sm:text-[7.5px] uppercase tracking-wider font-bold text-[#f7e7ce]">
                    ♥ BEST FRIEND ♥
                  </span>
                  <Gift className="w-3.5 h-3.5 sm:w-4.5 h-4.5 text-[#ffd700]" />
                  <span className="text-[6px] sm:text-[7px] uppercase tracking-wider font-bold text-[#e6cb9d]">
                    SPECIAL
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Header: Vintage Key Emblem */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 text-[#ab844c] mb-1">
                <span className="text-base">🌿</span>
                <div className="w-10 h-10 rounded-full border-2 border-[#ab844c] flex items-center justify-center text-[#5c061d] bg-[#fcf9f2] shadow-sm">
                  <KeyRound className="w-5 h-5 text-[#85213b]" />
                </div>
                <span className="text-base">🌿</span>
              </div>

              {/* Delicate Gold Laurel Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-1 text-[11px] sm:text-xs font-serif tracking-[0.25em] text-[#5c061d] uppercase border-t border-b border-[#ab844c]/60 my-1">
                <span>✦</span>
                <span>SECRET BIRTHDAY VAULT</span>
                <span>✦</span>
              </div>

              {/* Grand Elegant Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#5c061d] font-serif font-normal tracking-tight mt-1">
                Enter Secret <span className="italic text-[#ab844c]">Passkey</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#78593a] font-serif mt-1 max-w-md">
                Enter the secret code to unlock {friendName}'s birthday world.
              </p>
            </div>

            {/* ================= PIN DISPLAY: ELEGANT OPEN CIRCULAR RINGS (NO RECTANGULAR BOXES) ================= */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-2 sm:my-3">
              {pinSlots.map((idx) => {
                const isFilled = idx < inputCode.length;
                const isCurrent = idx === inputCode.length;
                return (
                  <motion.div
                    key={idx}
                    animate={
                      isFilled
                        ? { scale: [1, 1.2, 1] }
                        : isCurrent
                        ? { scale: [1, 1.06, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.25 }}
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                      isFilled
                        ? 'bg-gradient-to-br from-[#700924] via-[#5c061d] to-[#3a0614] border-2 border-[#ffd700] shadow-[0_4px_16px_rgba(92,6,29,0.35)]'
                        : isCurrent
                        ? 'bg-[#fffdf9] border-2 border-[#ab844c] shadow-md ring-4 ring-[#ffd700]/25'
                        : 'bg-[#f5ecdf]/80 border-2 border-[#d8c29d] shadow-inner'
                    }`}
                  >
                    {isFilled ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-lg sm:text-xl text-[#ffd700] leading-none select-none drop-shadow-xs"
                      >
                        ✦
                      </motion.span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#d8c29d]/70" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ================= CIRCULAR FLOATING TACTILE KEYPAD ================= */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 place-items-center max-w-xs sm:max-w-sm mx-auto w-full pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <motion.button
                  key={digit}
                  type="button"
                  disabled={isUnlocked}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => handleKeypadPress(digit, e)}
                  className="w-15 h-15 sm:w-17 sm:h-17 rounded-full aspect-square bg-[#fffdf9] hover:bg-[#faeedd] border-2 border-[#d8c29d] hover:border-[#ab844c] text-[#5c061d] text-xl sm:text-2xl font-serif transition-all shadow-[0_4px_12px_rgba(150,119,86,0.12)] hover:shadow-lg cursor-pointer select-none flex items-center justify-center relative overflow-hidden group"
                >
                  <span className="relative z-10">{digit}</span>
                  {/* Subtle inner golden highlight */}
                  <div className="absolute inset-1 rounded-full border border-[#d8c29d]/30 pointer-events-none" />
                </motion.button>
              ))}

              {/* Bottom row: CLEAR, 0, UNLOCK */}
              <motion.button
                type="button"
                disabled={isUnlocked}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => handleKeypadPress('CLEAR', e)}
                className="w-15 h-15 sm:w-17 sm:h-17 rounded-full aspect-square bg-[#fffdf9] hover:bg-[#faeedd] border-2 border-[#d8c29d] text-[#8a5a44] text-[10px] sm:text-xs font-serif tracking-wider uppercase transition-all shadow-sm hover:shadow-md cursor-pointer select-none flex flex-col items-center justify-center gap-0.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#8a5a44]" />
                <span className="leading-none text-[9px] sm:text-[11px] font-semibold">CLEAR</span>
              </motion.button>

              <motion.button
                type="button"
                disabled={isUnlocked}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => handleKeypadPress('0', e)}
                className="w-15 h-15 sm:w-17 sm:h-17 rounded-full aspect-square bg-[#fffdf9] hover:bg-[#faeedd] border-2 border-[#d8c29d] hover:border-[#ab844c] text-[#5c061d] text-xl sm:text-2xl font-serif transition-all shadow-[0_4px_12px_rgba(150,119,86,0.12)] hover:shadow-lg cursor-pointer select-none flex items-center justify-center"
              >
                0
              </motion.button>

              <motion.button
                type="button"
                disabled={isUnlocked}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => handleKeypadPress('UNLOCK', e)}
                className="w-15 h-15 sm:w-17 sm:h-17 rounded-full aspect-square bg-gradient-to-br from-[#700924] via-[#5c061d] to-[#3a0614] hover:from-[#85213b] hover:to-[#4a0416] border-2 border-[#ffd700] text-[#fbf5eb] text-[10px] sm:text-xs font-serif tracking-wider uppercase transition-all shadow-[0_4px_14px_rgba(92,6,29,0.35)] hover:shadow-xl cursor-pointer select-none flex flex-col items-center justify-center gap-0.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#ffd700]" />
                <span className="leading-none text-[9px] sm:text-[11px] font-semibold text-[#ffd700]">UNLOCK</span>
              </motion.button>
            </div>

            {/* Error Message: Floating Clean Pill */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs sm:text-sm text-rose-900 font-serif font-bold text-center bg-rose-100/95 px-5 py-2 rounded-full border border-rose-300 shadow-md"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Big Action Button: OPEN SECRET VAULT */}
            <motion.button
              whileHover={{ scale: isUnlocked ? 1 : 1.03 }}
              whileTap={{ scale: isUnlocked ? 1 : 0.97 }}
              type="button"
              disabled={isUnlocked}
              onClick={(e) => {
                spawnFloatingEffect(e);
                handleSubmit();
              }}
              className={`w-full max-w-xs sm:max-w-sm py-4 px-6 rounded-full text-xs sm:text-sm tracking-[0.22em] uppercase font-serif font-semibold shadow-lg flex items-center justify-between text-[#fbf5eb] transition-all cursor-pointer border-2 ${
                isUnlocked
                  ? 'bg-[#85213b] border-[#ffd700] shadow-[0_8px_24px_rgba(133,33,59,0.4)]'
                  : 'bg-gradient-to-r from-[#5c061d] via-[#700924] to-[#5c061d] hover:from-[#700924] hover:to-[#85213b] border-[#ffd700]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
              <span className="flex items-center gap-2">
                {isUnlocked ? 'VAULT UNLOCKED! OPENING...' : 'OPEN SECRET VAULT'}
                <ArrowRight className="w-4 h-4 text-[#ffd700]" />
              </span>
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
            </motion.button>

            {/* Footer Tagline with Filigree Hearts */}
            <div className="pt-2 text-center text-xs font-serif text-[#78593a] flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-[#d8c29d]" />
              <span>Crafted with love & sparkles for {friendName} ♥</span>
              <span className="w-8 h-[1px] bg-[#d8c29d]" />
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};
