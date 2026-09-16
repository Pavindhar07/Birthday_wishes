import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, PartyPopper, RotateCcw, Flame, Heart, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';
import { FireworksCanvas } from '../FireworksCanvas';

interface CakePageProps {
  friendName: string;
  relationshipTitle: string;
  cakeMessage: string;
  whatsappNumber?: string;
  onRestart: () => void;
}

type CakeFlavor = 'burgundy' | 'gold' | 'chocolate' | 'vanilla';
type FinalResponseState = 'asking' | 'happy' | 'sad';

export const CakePage: React.FC<CakePageProps> = ({
  friendName,
  cakeMessage,
  whatsappNumber,
  onRestart,
}) => {
  const [candles, setCandles] = useState([true, true, true, true]);
  const [flavor, setFlavor] = useState<CakeFlavor>('burgundy');
  const [isSliced, setIsSliced] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksKey, setFireworksKey] = useState(0);
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);
  const [finalResponse, setFinalResponse] = useState<FinalResponseState>('asking');
  const cardRef = useRef<HTMLDivElement>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const getWhatsAppUrl = () => {
    const cleanNumber = (whatsappNumber || '918778701536').replace(/[^0-9]/g, '');
    return cleanNumber
      ? `https://wa.me/${cleanNumber}`
      : 'https://web.whatsapp.com/';
  };

  const handleYes = () => {
    soundEngine.playSuccessChime();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#5c061d', '#ab844c', '#e6cb9d', '#ff4d6d', '#ffd700'],
    });
    window.location.assign(getWhatsAppUrl());
  };

  const handleNo = () => {
    soundEngine.playClick();
    setFinalResponse('sad');
  };

  const allCandlesBlown = candles.every((c) => !c);

  const triggerFireworks = () => {
    setFireworksKey((prev) => prev + 1);
    setShowFireworks(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    soundEngine.playBirthdayMelody();

    const end = Date.now() + 4.8 * 1000;
    const colors = ['#5c061d', '#8b1538', '#ab844c', '#d4af37', '#fcf9f2', '#f43f5e'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleBlowCandle = (index: number) => {
    soundEngine.playBlowCandle();
    setCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  const handleBlowAllCandles = () => {
    soundEngine.playBlowCandle();
    setCandles([false, false, false, false]);
  };

  const handleRelightCandles = () => {
    soundEngine.playClick();
    setCandles([true, true, true, true]);
    setHasCelebrated(false);
    setShowFireworks(false);
  };

  const handleSliceCake = () => {
    soundEngine.playCakeSlice();
    setIsSliced(true);
    setHasCelebrated(true);
    triggerFireworks();

    // 3.5 seconds after clicking the cake slice button, transition to the final page.
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => {
      setShowFinalQuestion(true);
    }, 3500);
  };

  useEffect(() => {
    if (allCandlesBlown && !hasCelebrated) {
      setHasCelebrated(true);
      setFireworksKey((prev) => prev + 1);
      setShowFireworks(true);
      triggerConfetti();
    }
  }, [allCandlesBlown, hasCelebrated]);

  const handlePopBalloon = (idx: number) => {
    if (poppedBalloons.includes(idx)) return;
    soundEngine.playClick();
    setPoppedBalloons((prev) => [...prev, idx]);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#5c061d', '#ab844c', '#e6cb9d', '#d4af37', '#fbf5eb'],
    });
  };

  const flavorColors = {
    burgundy: { top: '#5c061d', mid: '#8b1538', bottom: '#480315', text: 'Royal Burgundy Velvet' },
    gold: { top: '#ab844c', mid: '#edd9be', bottom: '#c59e66', text: 'Champagne Gold Sparkle' },
    chocolate: { top: '#3e2723', mid: '#d7ccc8', bottom: '#271714', text: 'Truffle Dark Cocoa' },
    vanilla: { top: '#fcf9f2', mid: '#f5ecdf', bottom: '#e8dcce', text: 'French Vanilla Cream' },
  }[flavor];

  if (showFinalQuestion) {
    const questionText = "are you happy....?";

    // Happy response: shown for 2 seconds, then redirects to WhatsApp
    if (finalResponse === 'happy') {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative z-10 select-none text-center">
          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
            animate={{ scale: [0.3, 1.25, 1], opacity: 1, rotate: [0, 8, 0] }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-8xl sm:text-9xl md:text-[10rem] mb-4 select-none filter drop-shadow-xl"
          >
            😊
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#5c061d] font-display italic tracking-wide mb-2"
          >
            Yay! So happy to hear that! 😊
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xs sm:text-sm text-[#ab844c] font-serif tracking-widest uppercase mb-6"
          >
            Redirecting to WhatsApp...
          </motion.p>

          {/* Clickable fallback in case browser blocks window.open popup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-sans font-medium tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Open WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      );
    }

    // Sad response: on next page, show sad emoji with animated text "its Fine"
    if (finalResponse === 'sad') {
      const fineText = "its Fine";

      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative z-10 select-none text-center">
          {/* Sad emoji with gentle floating motion */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-8xl sm:text-9xl md:text-[9.5rem] mb-6 select-none filter drop-shadow-md"
          >
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="inline-block"
            >
              🥺
            </motion.span>
          </motion.div>

          {/* Animated text: "its Fine" */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.14,
                  delayChildren: 0.3,
                },
              },
            }}
            className="text-3xl sm:text-5xl md:text-6xl font-normal text-[#5c061d] tracking-wider font-display italic inline-flex flex-wrap justify-center mb-4"
          >
            {fineText.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="text-sm sm:text-base font-serif text-[#5c061d] italic max-w-sm mx-auto mb-8 leading-relaxed"
          >
            
          </motion.p>

          {/* Replay Option */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.8 }}
          >
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowFinalQuestion(false);
                setFinalResponse('asking');
                onRestart();
              }}
              className="flex items-center gap-1.5 text-xs text-[#ab844c] hover:text-[#5c061d] font-serif transition-colors cursor-pointer tracking-widest lowercase"
              title="Replay celebration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>replay celebration</span>
            </button>
          </motion.div>
        </div>
      );
    }

    // Default 'asking' state: "are you happy....?" + Yes & No buttons below
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative z-10 select-none">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.6,
              },
            },
          }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-[#5c061d] tracking-wider font-display italic inline-flex flex-wrap justify-center mb-10">
            {questionText.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 1.4,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          {/* Yes and No buttons below the question */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleYes}
              className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-[#5c061d] hover:bg-[#780827] text-[#fbf5eb] font-serif text-base sm:text-lg tracking-wider shadow-md hover:shadow-lg transition-all border border-[#480315] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Yes</span>
              <span className="text-lg">😊</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleNo}
              className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-[#fdfbf7] hover:bg-[#f5ecdf] text-[#5c061d] font-serif text-base sm:text-lg tracking-wider shadow-xs hover:shadow-md transition-all border border-[#d8c29d] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>No</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Discreet replay button appearing after the text and buttons reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 1.2 }}
          className="fixed bottom-8"
        >
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowFinalQuestion(false);
              setFinalResponse('asking');
              onRestart();
            }}
            className="flex items-center gap-1.5 text-xs text-[#ab844c] hover:text-[#5c061d] font-serif transition-colors cursor-pointer tracking-widest lowercase"
            title="Replay celebration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>replay</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 pb-32 text-center select-none">
      <img
        src="/Photos/pic7.jpg"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 -z-10 w-full h-full object-cover opacity-25 mix-blend-multiply pointer-events-none"
      />

      {/* Full-Screen Fireworks Canvas Animation */}
      <FireworksCanvas key={fireworksKey} isActive={showFireworks} durationSeconds={7} />
      
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-3 mb-8"
      >
        

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#5c061d] tracking-tight font-display">
          {hasCelebrated ? (
            <span>{cakeMessage}</span>
          ) : (
            <span>Make a Wish, <span className="italic text-[#ab844c]">{friendName}</span>! ✨</span>
          )}
        </h1>

        <p className="text-xs sm:text-sm text-[#5c061d]/85 max-w-xl mx-auto leading-relaxed">
          {hasCelebrated
            ? "Here's to another year of unforgettable core memories, laughter, and endless adventures together! 🥂"
            : 'Tap the glowing candles or use the button below to blow them out and celebrate!'}
        </p>
      </motion.div>

      {/* Main Cake Stage Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-20 w-full max-w-2xl bg-[#fcf9f2]/55 backdrop-blur-sm p-8 sm:p-12 rounded-3xl sm:rounded-[2.5rem] border border-[#d8c29d] shadow-[0_25px_75px_rgba(92,6,29,0.12)] space-y-8 my-4 text-[#5c061d]"
      >
        {/* Inner hairline border */}
        <div className="absolute inset-3 sm:inset-4 rounded-[1.8rem] sm:rounded-[2.1rem] border border-[#d8c29d]/50 pointer-events-none" />

        {/* Cake Flavor Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-normal text-[#ab844c] uppercase tracking-widest mr-1">
            Cake Theme:
          </span>
          {(['burgundy', 'gold', 'chocolate', 'vanilla'] as CakeFlavor[]).map((flv) => (
            <button
              key={flv}
              onClick={() => {
                soundEngine.playClick();
                setFlavor(flv);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-normal transition-all border cursor-pointer ${
                flavor === flv
                  ? 'bg-[#5c061d] text-[#fbf5eb] border-[#480315] shadow-xs'
                  : 'bg-[#f5ecdf] text-[#5c061d] border-[#d8c29d] hover:bg-[#ede0cf]'
              }`}
            >
              {flv === 'burgundy' && '♥ Burgundy Velvet'}
              {flv === 'gold' && '✨ Champagne Gold'}
              {flv === 'chocolate' && '🍫 Truffle Cocoa'}
              {flv === 'vanilla' && '🍦 Vanilla Cream'}
            </button>
          ))}
        </div>

        {/* Interactive Cake Stage */}
        <div className="relative py-6 flex flex-col items-center justify-center min-h-[320px]">
          {/* Candle Flames Row */}
          <div className="flex items-center justify-center gap-10 sm:gap-12 mb-2 z-20">
            {candles.map((isLit, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={() => handleBlowCandle(idx)}
              >
                <AnimatePresence mode="wait">
                  {isLit ? (
                    <motion.div
                      key="flame"
                      animate={{ scale: [1, 1.2, 0.95, 1.15, 1], y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.1 + idx * 0.1 }}
                      className="relative w-6 h-9 mb-1 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                    >
                      <div className="absolute inset-0 bg-[#d4af37] blur-xs rounded-full opacity-90 animate-pulse" />
                      <div className="relative w-full h-full bg-gradient-to-t from-[#ab844c] via-[#f7e7ce] to-white rounded-full shadow-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="smoke"
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: [0, 1, 0], y: -24 }}
                      transition={{ duration: 1 }}
                      className="text-[10px] text-[#ab844c] font-normal mb-1"
                    >
                      💨 puff!
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-3.5 h-12 bg-gradient-to-b from-[#f5ecdf] via-[#d8c29d] to-[#ab844c] rounded-t-xs shadow-inner border border-[#d8c29d]" />
              </div>
            ))}
          </div>

          {/* SVG 3-Tier Luxury Cake Graphic */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative cursor-pointer group select-none"
            onClick={handleSliceCake}
          >
            <svg className="w-72 sm:w-96 h-52 overflow-visible drop-shadow-lg" viewBox="0 0 320 200">
              {/* Top Tier */}
              <rect x="100" y="30" width="120" height="40" rx="10" fill={flavorColors.top} />
              <path
                d="M 100 40 Q 115 50 130 40 Q 145 50 160 40 Q 175 50 190 40 Q 205 50 220 40"
                stroke="#d8c29d"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Middle Tier */}
              <rect x="65" y="70" width="190" height="50" rx="12" fill={flavorColors.mid} />
              <path
                d="M 65 82 Q 88 94 111 82 Q 134 94 157 82 Q 180 94 203 82 Q 226 94 249 82 Q 255 82 255 82"
                stroke="#ab844c"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Bottom Tier */}
              <rect x="30" y="120" width="260" height="60" rx="14" fill={flavorColors.bottom} />
              <path
                d="M 30 134 Q 57 148 84 134 Q 111 148 138 134 Q 165 148 192 134 Q 219 148 246 134 Q 273 148 290 134"
                stroke="#e6cb9d"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />

              {/* Gold Pedestal Base */}
              <ellipse cx="160" cy="182" rx="150" ry="12" fill="#ab844c" opacity="0.9" />

              {/* Slice Cut graphic */}
              {isSliced && (
                <g className="animate-pulse">
                  <path d="M 190 120 L 245 120 L 225 170 Z" fill="#5c061d" opacity="0.95" />
                  <text x="180" y="150" fill="#fbf5eb" fontSize="12" fontWeight="bold">
                    🍰 DELICIOUS!
                  </text>
                </g>
              )}
            </svg>
          </motion.div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#d8c29d]/60">
          <button
            onClick={allCandlesBlown ? handleRelightCandles : handleBlowAllCandles}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-normal bg-[#f5ecdf] text-[#5c061d] border border-[#d8c29d] hover:bg-[#ede0cf] transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Flame className="w-4 h-4 text-[#ab844c]" />
            <span>{allCandlesBlown ? 'Relight Candles 🕯️' : 'Blow Out All Candles 💨'}</span>
          </button>

          <button
            onClick={handleSliceCake}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-normal text-[#fbf5eb] transition-all shadow-md cursor-pointer active:scale-95 ${
              isSliced
                ? 'bg-[#5c061d] border border-[#480315]'
                : 'bg-[#5c061d] hover:bg-[#700924] border border-[#480315]'
            }`}
          >
            <PartyPopper className="w-4 h-4 text-[#e6cb9d]" />
            <span>{isSliced ? 'Cake Sliced! Delicious 🍰' : 'Slice Birthday Cake 🎂'}</span>
          </button>
        </div>

        {/* Mini-Game: Confetti Balloon Pop */}
        <div className="pt-3 border-t border-[#d8c29d]/60 space-y-2">
          <p className="text-xs font-normal text-[#ab844c] flex items-center justify-center gap-1.5 uppercase tracking-widest">
            <span>Pop Party Balloons for Confetti Explosions</span>
            <Sparkles className="w-3.5 h-3.5 text-[#ab844c]" />
          </p>

          <div className="flex justify-center items-center gap-4 sm:gap-6 pt-1">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isPopped = poppedBalloons.includes(idx);
              const balloonSymbols = ['🎈', '🥂', '🎁', '🎈', '🍾'];
              return (
                <button
                  key={idx}
                  onClick={() => handlePopBalloon(idx)}
                  className={`text-2xl sm:text-3xl hover:scale-125 transition-transform cursor-pointer ${
                    isPopped ? 'opacity-30 scale-75 grayscale' : 'animate-bounce'
                  }`}
                  title="Pop balloon!"
                >
                  {isPopped ? '💥' : balloonSymbols[idx]}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
