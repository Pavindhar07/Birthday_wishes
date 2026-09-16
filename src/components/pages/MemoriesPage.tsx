import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowRight, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Memory } from '../../types';

interface MemoriesPageProps {
  friendName: string;
  memories: Memory[];
  onContinue: () => void;
}

interface ScatterConfig {
  rotation: number;
  desktopClass: string;
  aspectRatio: string;
  tapeStyle?: 'top' | 'top-right' | 'top-left' | 'none';
  tapeRotation?: string;
  zIndex: number;
}

const SCATTER_PRESETS: ScatterConfig[] = [
  {
    rotation: -3.2,
    desktopClass: 'lg:left-[0.5%] xl:left-[1%] lg:top-[10px] lg:w-[350px] xl:w-[410px]',
    aspectRatio: 'aspect-[3/4]',
    tapeStyle: 'top',
    tapeRotation: '-2deg',
    zIndex: 12,
  },
  {
    rotation: 2.2,
    desktopClass: 'lg:left-[26%] xl:left-[25%] lg:top-[30px] lg:w-[370px] xl:w-[430px]',
    aspectRatio: 'aspect-[4/3]',
    tapeStyle: 'top-right',
    tapeRotation: '4deg',
    zIndex: 14,
  },
  {
    rotation: -1.6,
    desktopClass: 'lg:left-[52%] xl:left-[50%] lg:top-[15px] lg:w-[340px] xl:w-[400px]',
    aspectRatio: 'aspect-square',
    tapeStyle: 'none',
    zIndex: 10,
  },
  {
    rotation: 3.2,
    desktopClass: 'lg:right-[0.5%] xl:right-[1%] lg:top-[25px] lg:w-[380px] xl:w-[440px]',
    aspectRatio: 'aspect-[4/3]',
    tapeStyle: 'top-left',
    tapeRotation: '-4deg',
    zIndex: 15,
  },
  {
    rotation: 2.6,
    desktopClass: 'lg:left-[1%] xl:left-[1.5%] lg:top-[470px] lg:w-[370px] xl:w-[430px]',
    aspectRatio: 'aspect-[4/3]',
    tapeStyle: 'top',
    tapeRotation: '3deg',
    zIndex: 16,
  },
  {
    rotation: -2.4,
    desktopClass: 'lg:left-[25.5%] xl:left-[25.5%] lg:top-[500px] lg:w-[360px] xl:w-[420px]',
    aspectRatio: 'aspect-[3/4]',
    tapeStyle: 'top-right',
    tapeRotation: '-3deg',
    zIndex: 11,
  },
  {
    rotation: 1.5,
    desktopClass: 'lg:left-[51%] xl:left-[49.5%] lg:top-[465px] lg:w-[380px] xl:w-[440px]',
    aspectRatio: 'aspect-[16/10]',
    tapeStyle: 'none',
    zIndex: 17,
  },
  {
    rotation: -3.0,
    desktopClass: 'lg:right-[0.5%] xl:right-[1.5%] lg:top-[490px] lg:w-[360px] xl:w-[420px]',
    aspectRatio: 'aspect-[3/4]',
    tapeStyle: 'top-left',
    tapeRotation: '3deg',
    zIndex: 13,
  },
  {
    rotation: -2.0,
    desktopClass: 'lg:left-[0.5%] xl:left-[1%] lg:top-[920px] lg:w-[380px] xl:w-[440px]',
    aspectRatio: 'aspect-[4/3]',
    tapeStyle: 'top-right',
    tapeRotation: '2deg',
    zIndex: 14,
  },
  {
    rotation: 2.8,
    desktopClass: 'lg:left-[26%] xl:left-[25%] lg:top-[955px] lg:w-[350px] xl:w-[410px]',
    aspectRatio: 'aspect-[3/4]',
    tapeStyle: 'top',
    tapeRotation: '-2deg',
    zIndex: 12,
  },
  {
    rotation: -1.4,
    desktopClass: 'lg:left-[51.5%] xl:left-[50%] lg:top-[915px] lg:w-[370px] xl:w-[430px]',
    aspectRatio: 'aspect-square',
    tapeStyle: 'top-left',
    tapeRotation: '4deg',
    zIndex: 18,
  },
  {
    rotation: 2.5,
    desktopClass: 'lg:right-[0.5%] xl:right-[1%] lg:top-[935px] lg:w-[380px] xl:w-[440px]',
    aspectRatio: 'aspect-[4/5]',
    tapeStyle: 'top',
    tapeRotation: '-1deg',
    zIndex: 15,
  },
  {
    rotation: 3.0,
    desktopClass: 'lg:left-[1%] xl:left-[1.5%] lg:top-[1380px] lg:w-[360px] xl:w-[420px]',
    aspectRatio: 'aspect-[3/4]',
    tapeStyle: 'top-left',
    tapeRotation: '-3deg',
    zIndex: 13,
  },
  {
    rotation: -2.6,
    desktopClass: 'lg:left-[25.5%] xl:left-[25%] lg:top-[1410px] lg:w-[380px] xl:w-[440px]',
    aspectRatio: 'aspect-[4/3]',
    tapeStyle: 'top-right',
    tapeRotation: '2deg',
    zIndex: 16,
  },
  {
    rotation: 1.8,
    desktopClass: 'lg:left-[51%] xl:left-[49.5%] lg:top-[1370px] lg:w-[350px] xl:w-[410px]',
    aspectRatio: 'aspect-[4/5]',
    tapeStyle: 'top',
    tapeRotation: '-2deg',
    zIndex: 12,
  },
  {
    rotation: -3.2,
    desktopClass: 'lg:right-[0.5%] xl:right-[1.5%] lg:top-[1395px] lg:w-[390px] xl:w-[450px]',
    aspectRatio: 'aspect-[16/10]',
    tapeStyle: 'top-left',
    tapeRotation: '3deg',
    zIndex: 17,
  },
];

export const MemoriesPage: React.FC<MemoriesPageProps> = ({
  friendName,
  memories,
  onContinue,
}) => {
  // Reveal photos one by one on the same page with fluid, controllable pacing
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [revealSpeed, setRevealSpeed] = useState<number>(650); // Relaxed (1000ms), Smooth (650ms), Fast (350ms)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [likedMemories, setLikedMemories] = useState<Record<string, boolean>>({});

  // Auto-reveal sequence: reveals next photo every `revealSpeed` ms when playing
  useEffect(() => {
    if (isPlaying && visibleCount < memories.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 1, memories.length));
      }, revealSpeed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, visibleCount, memories.length, revealSpeed]);

  const handleRevealAll = () => {
    setVisibleCount(memories.length);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (visibleCount >= memories.length) {
      // If already finished, replay from start
      setVisibleCount(1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : memories.length - 1));
  }, [selectedIndex, memories.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < memories.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, memories.length]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMemories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Keyboard navigation for lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  const selectedMemory = selectedIndex !== null ? memories[selectedIndex] : null;

  // Dynamic canvas height based on total memory count for desktop spread
  const desktopRows = Math.ceil(memories.length / 4);
  const canvasMinHeight = Math.max(1400, desktopRows * 475 + 80);

  return (
    <div className="min-h-screen bg-[#fbf6ed] text-[#3a0614] relative z-10 py-10 px-3 sm:px-6 lg:px-8 xl:px-12 overflow-x-hidden select-none">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
        <div className="absolute top-10 left-1/4 w-[700px] h-[700px] bg-[#edd9be]/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-[#5c061d]/5 rounded-full blur-[130px]" />
      </div>

      {/* Decorative Minimalist Botanical Line Accents */}
      <svg
        className="fixed top-8 left-4 sm:left-6 w-24 sm:w-32 h-24 sm:h-32 text-[#5c061d]/15 pointer-events-none z-0"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M10,90 Q30,60 50,40 Q70,20 90,10" />
        <path d="M30,60 Q40,50 35,40 Q25,50 30,60" />
        <path d="M50,40 Q60,30 55,20 Q45,30 50,40" />
        <path d="M70,20 Q80,10 75,0 Q65,10 70,20" />
      </svg>

      <svg
        className="fixed bottom-12 right-4 sm:right-6 w-28 sm:w-36 h-28 sm:h-36 text-[#ab844c]/20 pointer-events-none z-0 rotate-180"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M10,90 Q30,60 50,40 Q70,20 90,10" />
        <path d="M30,60 Q40,50 35,40 Q25,50 30,60" />
        <path d="M50,40 Q60,30 55,20 Q45,30 50,40" />
      </svg>

      {/* Header Section with Slow Reveal Status & Pacing Controls */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="text-center max-w-3xl mx-auto space-y-3 pt-2 mb-8 sm:mb-12 relative z-10"
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#5c061d] tracking-[0.16em] uppercase font-serif">
          OUR LITTLE MEMORIES
        </h1>

        

        {/* Live Reveal Progress Bar & Speed Pacing Controls (Compact & Minimal) */}
        <div className="flex flex-col items-center gap-1.5 pt-1.5">
          {/* Thin Delicate Progress Bar */}
          <div className="w-32 sm:w-44 h-[2px] bg-[#edd9be] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#5c061d] rounded-full"
              animate={{ width: `${(visibleCount / memories.length) * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>

          {/* Speed & Pacing Controls - Compact size */}
          <div className="flex items-center gap-2 text-[10px] font-serif text-[#6b2d38]">
            {/* Play / Pause Toggle */}
            <button
              onClick={togglePlayPause}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fcf9f2] hover:bg-white border border-[#d8c29d]/80 transition-all text-[#5c061d] shadow-2xs cursor-pointer text-[10px]"
              title={isPlaying ? 'Pause unveiling' : 'Resume unveiling'}
            >
              {isPlaying && visibleCount < memories.length ? (
                <>
                  <Pause className="w-2.5 h-2.5 text-[#5c061d]" />
                  <span>Pause</span>
                </>
              ) : visibleCount >= memories.length ? (
                <>
                  <RotateCcw className="w-2.5 h-2.5 text-[#5c061d]" />
                  <span>Replay</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 text-[#5c061d]" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Speed Options */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f4ebd9]/60 border border-[#d8c29d]/60 text-[10px]">
              <span className="text-[#8a5a44] mr-0.5">Speed:</span>
              <button
                onClick={() => setRevealSpeed(1000)}
                className={`px-1 py-0.2 rounded transition-colors ${
                  revealSpeed === 1000 ? 'font-bold text-[#5c061d] underline' : 'text-[#6b2d38] hover:text-[#5c061d]'
                }`}
              >
                Relaxed
              </button>
              <span>•</span>
              <button
                onClick={() => setRevealSpeed(650)}
                className={`px-1 py-0.2 rounded transition-colors ${
                  revealSpeed === 650 ? 'font-bold text-[#5c061d] underline' : 'text-[#6b2d38] hover:text-[#5c061d]'
                }`}
              >
                Smooth
              </button>
              <span>•</span>
              <button
                onClick={() => setRevealSpeed(350)}
                className={`px-1 py-0.2 rounded transition-colors ${
                  revealSpeed === 350 ? 'font-bold text-[#5c061d] underline' : 'text-[#6b2d38] hover:text-[#5c061d]'
                }`}
              >
                Fast
              </button>
            </div>

            {/* Instant Reveal All Button */}
            {visibleCount < memories.length && (
              <button
                onClick={handleRevealAll}
                className="text-[10px] text-[#85213b] hover:text-[#5c061d] underline tracking-wider cursor-pointer transition-colors"
              >
                Show All
              </button>
            )}
          </div>
        </div>

        <div className="w-16 h-[1px] bg-[#d8c29d] mx-auto mt-4 opacity-70" />
      </motion.div>

      {/* =========================================================================
          DESKTOP SCATTERED PHOTO CANVAS (Widescreen lg+)
          Displays photos scattered across the entire width (left & right sides filled)
          ========================================================================= */}
      <div
        className="hidden lg:block relative w-full max-w-[1720px] mx-auto mb-20"
        style={{
          minHeight: `${canvasMinHeight}px`,
        }}
      >
        {memories.slice(0, visibleCount).map((mem, idx) => {
          const config = SCATTER_PRESETS[idx % SCATTER_PRESETS.length];

          return (
            <motion.div
              key={mem.id}
              initial={{
                opacity: 0,
                y: -25,
                scale: 1.05,
                rotate: 0,
                filter: 'blur(4px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: config.rotation,
                filter: 'blur(0px)',
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.06,
                rotate: 0,
                zIndex: 50,
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
              onClick={() => handleOpenLightbox(idx)}
              className={`absolute cursor-pointer ${config.desktopClass} transition-shadow duration-300`}
              style={{ zIndex: config.zIndex }}
            >
              {/* Photo Frame Container (Warm Ivory Paper with Subtle Soft Shadow) */}
              <div
                className="group relative bg-[#fdfbf7] p-3.5 sm:p-4 pb-7 sm:pb-8 rounded-[4px] border border-[#dfd2be] shadow-[0_18px_42px_rgba(58,6,20,0.12),0_3px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_32px_75px_rgba(58,6,20,0.24),0_8px_18px_rgba(0,0,0,0.06)] group-hover:border-[#ab844c]/70 transition-all duration-500"
              >
                
                {/* Vintage Washi Tape Accent */}
                {config.tapeStyle === 'top' && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#f6ecd9]/85 border border-[#d8c29d]/70 backdrop-blur-2xs shadow-2xs pointer-events-none z-20"
                    style={{ transform: `translateX(-50%) rotate(${config.tapeRotation || '-2deg'})` }}
                  />
                )}
                {config.tapeStyle === 'top-right' && (
                  <div
                    className="absolute -top-3 -right-2 w-16 h-5.5 bg-[#f6ecd9]/85 border border-[#d8c29d]/70 backdrop-blur-2xs shadow-2xs pointer-events-none z-20"
                    style={{ transform: `rotate(${config.tapeRotation || '4deg'})` }}
                  />
                )}
                {config.tapeStyle === 'top-left' && (
                  <div
                    className="absolute -top-3 -left-2 w-16 h-5.5 bg-[#f6ecd9]/85 border border-[#d8c29d]/70 backdrop-blur-2xs shadow-2xs pointer-events-none z-20"
                    style={{ transform: `rotate(${config.tapeRotation || '-5deg'})` }}
                  />
                )}

                {/* Photograph Image */}
                <div className={`relative ${config.aspectRatio} w-full overflow-hidden bg-[#f0e6d6] rounded-[2px]`}>
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    loading="lazy"
                  />
                  {/* Gentle vignette glaze on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3a0614]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Caption & Date */}
                <div className="pt-3 px-1 flex items-baseline justify-between text-[#6b2d38] font-serif">
                  <span className="text-sm sm:text-base font-normal tracking-wide truncate max-w-[70%]">
                    {mem.title}
                  </span>
                  <span className="text-xs text-[#8a5a44] italic tracking-widest opacity-80 shrink-0">
                    {mem.date}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =========================================================================
          MOBILE & TABLET STREAM (< lg)
          ========================================================================= */}
      <div className="lg:hidden max-w-2xl mx-auto space-y-8 sm:space-y-12 mb-20 px-2 sm:px-4">
        {memories.slice(0, visibleCount).map((mem, idx) => {
          const config = SCATTER_PRESETS[idx % SCATTER_PRESETS.length];
          const isLeft = idx % 2 === 0;
          const rotateAngle = isLeft ? -2.4 : 2.0;

          return (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: -20, scale: 1.05, rotate: 0, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: rotateAngle, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenLightbox(idx)}
              className={`cursor-pointer transition-all duration-300 ${
                isLeft ? 'mr-2 sm:mr-6' : 'ml-2 sm:ml-6'
              }`}
            >
              <div
                className="relative bg-[#fdfbf7] p-3.5 sm:p-5 pb-7 sm:pb-8 rounded-[4px] border border-[#dfd2be] shadow-[0_16px_36px_rgba(58,6,20,0.1),0_2px_6px_rgba(0,0,0,0.03)] active:shadow-md transition-all duration-500"
              >
                
                {/* Washi Tape */}
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-18 h-5.5 bg-[#f6ecd9]/85 border border-[#d8c29d]/70 shadow-2xs pointer-events-none z-10"
                  style={{ transform: `translateX(-50%) rotate(${isLeft ? '-2deg' : '3deg'})` }}
                />

                {/* Photograph */}
                <div className={`relative ${config.aspectRatio} w-full overflow-hidden bg-[#f0e6d6] rounded-[2px]`}>
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Caption */}
                <div className="pt-3 px-1 flex items-baseline justify-between text-[#6b2d38] font-serif">
                  <span className="text-sm sm:text-base font-normal tracking-wide truncate max-w-[65%]">
                    {mem.title}
                  </span>
                  <span className="text-xs text-[#8a5a44] italic tracking-widest opacity-80 shrink-0">
                    {mem.date}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =========================================================================
          LIGHTBOX MODAL (Click any photo to enlarge and read full memory note)
          ========================================================================= */}
      <AnimatePresence>
        {selectedMemory !== null && selectedIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1a0208]/90 backdrop-blur-md">
            
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={handleCloseLightbox}
            />

            {/* Lightbox Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="relative z-10 w-full max-w-3xl bg-[#fdfbf7] p-4 sm:p-7 rounded-[4px] border border-[#d8c29d] shadow-[0_30px_90px_rgba(0,0,0,0.6)] text-[#3a0614] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseLightbox}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 p-2 rounded-full bg-[#fdfbf7]/90 hover:bg-[#f5ecdf] text-[#5c061d] transition-colors border border-[#d8c29d]/60 cursor-pointer shadow-xs"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Lightbox Image Stage */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full max-h-[55vh] overflow-hidden bg-[#1f030a] rounded-[2px] border border-[#dfd2be]/50">
                <img
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain sm:object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#fdfbf7]/90 hover:bg-[#fdfbf7] text-[#5c061d] transition-all shadow-md border border-[#d8c29d] cursor-pointer hover:scale-108"
                  title="Previous photo (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#fdfbf7]/90 hover:bg-[#fdfbf7] text-[#5c061d] transition-all shadow-md border border-[#d8c29d] cursor-pointer hover:scale-108"
                  title="Next photo (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Lightbox Editorial Caption & Counter */}
              <div className="pt-4 sm:pt-5 space-y-2 font-serif">
                <div className="flex items-center justify-between border-b border-[#dfd2be]/60 pb-2.5">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-normal text-[#5c061d] tracking-wide">
                      {selectedMemory.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8a5a44] italic">
                      {selectedMemory.date} {selectedMemory.location && `• ${selectedMemory.location}`}
                    </p>
                  </div>

                  {/* Counter: "03 / 16" */}
                  <div className="text-xs sm:text-sm text-[#5c061d] font-normal tracking-[0.2em] px-3 py-1 bg-[#f5ecdf] rounded-full border border-[#d8c29d]">
                    {String(selectedIndex + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5c061d]/90 leading-relaxed italic pt-1 font-serif">
                  "{selectedMemory.caption}"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          CONTINUE TO LETTER ACTION
          ========================================================================= */}
      <div className="text-center pt-8 pb-16 relative z-20">
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#5c061d] hover:bg-[#480315] text-[#fbf5eb] text-xs sm:text-sm tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_12px_32px_rgba(92,6,29,0.28)] border border-[#ab844c]/40 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e6cb9d] opacity-80" />
          <span>Open Jar of Little Notes 💌</span>
          <ArrowRight className="w-4 h-4 text-[#e6cb9d] group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </div>

    </div>
  );
};
