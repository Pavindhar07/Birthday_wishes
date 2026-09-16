import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  Crown,
  Smile,
  X,
  Upload,
  Link2,
  Video,
  Film,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';
import { VideoKeepsake } from '../../types';

export interface LetterPageProps {
  friendName: string;
  greeting?: string;
  body?: string;
  closing?: string;
  sender?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoCaption?: string;
  videos?: VideoKeepsake[];
  onUpdateVideos?: (videos: VideoKeepsake[]) => void;
  onUpdateVideo?: (url: string, title?: string) => void;
  onContinue: () => void;
}

interface JarVideoItem {
  id: string;
  index: number;
  title: string;
  caption: string;
  url: string;
  emoji: string;
  cassetteColor: string;
  ribbonColor: string;
  label: string;
}

export const LetterPage: React.FC<LetterPageProps> = ({
  friendName,
  greeting = "Dearest Friend,",
  body = "You mean the absolute world to me.",
  closing = "Forever with love,",
  sender = "Your Best Friend",
  videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-birthday-cake-with-candles-43184-large.mp4",
  videoTitle,
  videoCaption,
  videos: initialVideos,
  onUpdateVideos,
  onUpdateVideo,
  onContinue,
}) => {
  // Only 2 videos in the jar for this birthday keepsake
  const defaultVideoList: JarVideoItem[] = [
    {
      id: 'video-1',
      index: 1,
      title: initialVideos?.[0]?.title || videoTitle || ` ${friendName} 🎉`,
      caption: initialVideos?.[0]?.caption || videoCaption || "",
      url: initialVideos?.[0]?.url || videoUrl,
      emoji: '🎂',
      cassetteColor: 'bg-gradient-to-tr from-[#38040f] via-[#5c061d] to-[#8b1538] border-[#d4af37] text-[#fbf5eb]',
      ribbonColor: '#d4af37',
      label: 'Candle Celebration',
    },
    {
      id: 'video-2',
      index: 2,
      title: initialVideos?.[1]?.title || ` ✨`,
      caption: initialVideos?.[1]?.caption || "A highlight reel celebrating all the spontaneous adventures, road trips, and endless laughter.",
      url: "/video/2.mp4",
      emoji: '🎥',
      cassetteColor: 'bg-gradient-to-tr from-[#523315] via-[#7d5326] to-[#a8743c] border-[#f3d39b] text-[#fbf5eb]',
      ribbonColor: '#f3d39b',
      label: 'Adventures & Laughs',
    },
  ];

  const [videos, setVideos] = useState<JarVideoItem[]>(defaultVideoList);
  const [currentModalVideo, setCurrentModalVideo] = useState<JarVideoItem | null>(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState<Record<string, boolean>>({
    'video-1': true,
  });
  const [isJarShaking, setIsJarShaking] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Rotation angles for the cassettes inside the jar
  const [cassetteRotations, setCassetteRotations] = useState<number[]>([-12, 4]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const backgroundWasPlayingRef = useRef(false);

  useEffect(() => {
    if (!currentModalVideo) return;

    backgroundWasPlayingRef.current = soundEngine.getIsPlaying();
    soundEngine.pauseBackgroundMusic();

    return () => {
      if (backgroundWasPlayingRef.current) {
        soundEngine.playBackgroundMusic();
      }
      backgroundWasPlayingRef.current = false;
    };
  }, [currentModalVideo]);

  const resumeBackgroundMusic = () => {
    if (backgroundWasPlayingRef.current) {
      soundEngine.playBackgroundMusic();
      backgroundWasPlayingRef.current = false;
    }
  };

  // Mix the 3 videos in the jar and pick one randomly
  const handleMixAndPlay = () => {
    soundEngine.playClick();
    setIsJarShaking(true);

    // Shuffle rotation angles to visually mix the cassettes
    setCassetteRotations([
      Math.floor(Math.random() * 26) - 13,
      Math.floor(Math.random() * 26) - 13,
    ]);

    setTimeout(() => {
      setIsJarShaking(false);
      // Pick unwatched if possible, or random
      const unwatched = videos.filter((v) => !watchedVideoIds[v.id]);
      const pool = unwatched.length > 0 ? unwatched : videos;
      const selected = pool[Math.floor(Math.random() * pool.length)];
      openVideo(selected);
    }, 450);
  };

  const openVideo = (videoItem: JarVideoItem) => {
    soundEngine.playSuccessChime();
    setWatchedVideoIds((prev) => ({ ...prev, [videoItem.id]: true }));
    setCurrentModalVideo(videoItem);
    setShowUrlInput(false);

    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.55 },
      colors: ['#5c061d', '#ab844c', '#d4af37', '#f5ecd9'],
      scalar: 0.9,
    });
  };

  const handleNextVideo = () => {
    if (!currentModalVideo) return;
    const currentIndex = videos.findIndex((v) => v.id === currentModalVideo.id);
    const nextIndex = (currentIndex + 1) % videos.length;
    openVideo(videos[nextIndex]);
  };

  const handlePrevVideo = () => {
    if (!currentModalVideo) return;
    const currentIndex = videos.findIndex((v) => v.id === currentModalVideo.id);
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    openVideo(videos[prevIndex]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentModalVideo) return;
    const blobUrl = URL.createObjectURL(file);
    
    const updated = videos.map((v) =>
      v.id === currentModalVideo.id ? { ...v, url: blobUrl } : v
    );
    setVideos(updated);
    setCurrentModalVideo((prev) => (prev ? { ...prev, url: blobUrl } : null));

    if (onUpdateVideos) {
      onUpdateVideos(
        updated.map((v) => ({ id: v.id, title: v.title, caption: v.caption, url: v.url }))
      );
    }
    if (currentModalVideo.id === 'video-1' && onUpdateVideo) {
      onUpdateVideo(blobUrl, currentModalVideo.title);
    }
    soundEngine.playSuccessChime();
  };

  const handleSaveCustomUrl = () => {
    if (!customUrlInput.trim() || !currentModalVideo) return;
    const newUrl = customUrlInput.trim();

    const updated = videos.map((v) =>
      v.id === currentModalVideo.id ? { ...v, url: newUrl } : v
    );
    setVideos(updated);
    setCurrentModalVideo((prev) => (prev ? { ...prev, url: newUrl } : null));

    if (onUpdateVideos) {
      onUpdateVideos(
        updated.map((v) => ({ id: v.id, title: v.title, caption: v.caption, url: v.url }))
      );
    }
    if (currentModalVideo.id === 'video-1' && onUpdateVideo) {
      onUpdateVideo(newUrl, currentModalVideo.title);
    }
    setShowUrlInput(false);
    soundEngine.playSuccessChime();
  };

  const getEmbedInfo = (url: string) => {
    if (!url) return { isEmbed: false, url: '' };
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return {
        isEmbed: true,
        url: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      };
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        isEmbed: true,
        url: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      };
    }
    return { isEmbed: false, url };
  };

  const embedInfo = currentModalVideo ? getEmbedInfo(currentModalVideo.url) : { isEmbed: false, url: '' };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 pb-36 select-none">
      
      {/* Hidden file input for uploading a video */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*"
        className="hidden"
      />

      {/* Top Banner & Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2.5 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fcf9f2] border border-[#d8c29d] text-[#5c061d] text-xs tracking-widest uppercase shadow-2xs font-serif">
          <Film className="w-3.5 h-3.5 text-[#ab844c]" />
          <span>Interactive Video Keepsake Jar</span>
          <Sparkles className="w-3 h-3 text-[#ab844c]" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-normal text-[#5c061d] tracking-tight font-display">
          Jar of Birthday Videos for <span className="italic text-[#ab844c]">{friendName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5c061d]/85 max-w-md mx-auto leading-relaxed">
          A handcrafted glass jar holding 3 special birthday video memories. Shake the jar to mix them, or tap any video cassette to play!
        </p>
      </motion.div>

      {/* =========================================================================
          THE GLASS MEMORY JAR WITH 3 VIDEO CASSETTES
          ========================================================================= */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center my-2 w-full max-w-md"
      >
        {/* Glowing Background Radial Halo */}
        <div className="absolute -inset-6 bg-gradient-to-t from-[#ab844c]/20 via-[#5c061d]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* The Clickable Glass Jar */}
        <div
          onClick={handleMixAndPlay}
          className={`group cursor-pointer relative w-[min(82vw,20rem)] sm:w-80 aspect-[3/4] flex flex-col items-center justify-end transition-all duration-300 select-none ${
            isJarShaking ? 'animate-bounce scale-105' : 'hover:scale-105'
          }`}
          title="Click to shake and pull a video from the jar!"
        >
          {/* Cork Lid & Golden Neck Ribbon */}
          <div className="relative z-20 flex flex-col items-center -mb-2">
            {/* Wooden Cork */}
            <div className="w-32 sm:w-36 h-8 bg-gradient-to-r from-[#8a5d3b] via-[#ba8d64] to-[#734b2c] rounded-t-lg border-b-2 border-[#57351a] shadow-md flex items-center justify-center">
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#f5ecdf] opacity-90">
                2 VIDEO MEMORIES
              </span>
            </div>
            {/* Glass Jar Lip */}
            <div className="w-40 sm:w-44 h-4 bg-white/75 backdrop-blur-xs rounded-full border border-[#d8c29d] shadow-sm -mt-1" />
            
            {/* Tied Twine Ribbon with Hanging Tag */}
            <div className="relative flex items-center justify-center w-full">
              <div className="w-36 h-2 bg-[#ab844c] rounded-full shadow-xs" />
              {/* Hanging Tag */}
              <motion.div
                animate={{ rotate: [-2, 3, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 right-4 px-2.5 py-1 bg-[#fdfbf7] border border-[#d8c29d] rounded-md shadow-md text-[#5c061d] font-serif text-[10px] tracking-wider flex items-center gap-1 origin-top"
              >
                <span>🎬</span>
                <span>For {friendName}</span>
              </motion.div>
            </div>
          </div>

          {/* Glass Jar Body with Translucent Gradients & Highlights */}
          <div className="relative z-10 w-full h-[85%] rounded-b-[4.5rem] rounded-t-2xl bg-gradient-to-b from-white/45 via-[#fbf7f0]/35 to-white/55 backdrop-blur-[2px] border-2 border-[#d8c29d]/75 shadow-[0_25px_60px_rgba(92,6,29,0.18)] overflow-hidden flex flex-col items-center justify-end p-5">
            
            {/* Left Glass Cylindrical Specular Glint */}
            <div className="absolute top-4 left-3 w-4 h-[80%] rounded-full bg-gradient-to-b from-white/85 via-white/40 to-transparent blur-[1px] pointer-events-none" />
            {/* Right Glass Subtle Rim Light */}
            <div className="absolute top-8 right-3 w-2 h-[70%] rounded-full bg-white/60 blur-[0.5px] pointer-events-none" />

            {/* Fairy Light Firefly Sparkles Inside the Jar */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ opacity: [0.3, 0.9, 0.3], y: [-3, 3, -3] }}
                transition={{ duration: 2.8, repeat: Infinity }}
                className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-[#fceba7] shadow-[0_0_12px_#fae17d]"
              />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4], y: [3, -4, 3] }}
                transition={{ duration: 3.4, repeat: Infinity, delay: 0.6 }}
                className="absolute top-2/4 right-1/4 w-3 h-3 rounded-full bg-[#fbd480] shadow-[0_0_14px_#fbd480]"
              />
              <motion.div
                animate={{ opacity: [0.2, 0.8, 0.2], y: [-2, 4, -2] }}
                transition={{ duration: 2.3, repeat: Infinity, delay: 1.2 }}
                className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-[#fff] shadow-[0_0_10px_#fff]"
              />
            </div>

            {/* Exactly 3 Ornate Mini Video Cassettes / Film Reels Inside the Jar */}
            <div className="relative w-full h-48 flex items-end justify-center gap-3 pb-4">
              {videos.map((item, i) => {
                const isWatched = !!watchedVideoIds[item.id];
                const rot = cassetteRotations[i] || 0;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.16, y: -8 }}
                    animate={{ rotate: rot }}
                    transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openVideo(item);
                    }}
                    className={`relative w-18 sm:w-20 h-24 sm:h-26 rounded-xl p-1.5 shadow-md border-2 transition-all cursor-pointer flex flex-col items-center justify-between ${item.cassetteColor} ${
                      isWatched ? 'opacity-95' : 'opacity-100 hover:brightness-110'
                    }`}
                  >
                    {/* Top Film Tape Label / Wax Seal */}
                    <div className="w-full flex items-center justify-between px-1">
                      <div className="w-4 h-4 rounded-full bg-[#ab844c] border border-white/80 flex items-center justify-center text-[8px] text-white shadow-xs">
                        {item.emoji}
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-[#f5ecdf] uppercase">
                        #{item.index}
                      </span>
                    </div>

                    {/* Cassette Tape Spools Graphic */}
                    <div className="w-full flex items-center justify-center gap-1.5 py-1">
                      <div className="w-4 h-4 rounded-full border-2 border-[#d4af37]/80 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <div className="w-3 h-1 bg-[#d4af37]/60 rounded-full" />
                      <div className="w-4 h-4 rounded-full border-2 border-[#d4af37]/80 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>

                    {/* Bottom Label & Play Indicator */}
                    <div className="w-full text-center pb-0.5">
                      <span className="text-[8px] font-serif leading-none block truncate px-0.5 text-white/95">
                        {item.label}
                      </span>
                      <span className="text-[7px] font-mono text-[#d4af37] tracking-wider mt-0.5 block">
                        ▶ PLAY
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Glass Curved Base */}
            <div className="w-52 h-3.5 rounded-full bg-white/40 border border-[#d8c29d]/50" />
          </div>

          {/* Wooden Shelf / Base Pedestal */}
          <div className="w-80 sm:w-88 h-4 bg-gradient-to-r from-[#6b4729] via-[#94693f] to-[#59391e] rounded-full shadow-lg border-t border-[#ba8d64] -mt-2 relative z-0" />
        </div>
      </motion.div>

      {/* =========================================================================
          CINEMATIC VIDEO THEATER MODAL (PLAYS THE SELECTED VIDEO)
          ========================================================================= */}
      <AnimatePresence>
        {currentModalVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1a050b]/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl bg-[#fdfbf7] rounded-3xl p-3 sm:p-5 border border-[#d8c29d] shadow-[0_25px_70px_rgba(92,6,29,0.35)] text-[#5c061d] overflow-hidden my-6"
            >
              {/* Inner Decorative Hairline Border */}
              <div className="absolute inset-2 sm:inset-3 rounded-[1.4rem] border border-[#d8c29d]/50 pointer-events-none" />

              <button
                onClick={() => setCurrentModalVideo(null)}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-[#fdfbf7]/85 text-[#5c061d] hover:bg-[#f5ecdf] transition-colors cursor-pointer"
                title="Close video"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Theater Screen */}
              <div className="relative z-10">
                <div className="relative w-full aspect-video max-h-[82vh] rounded-2xl bg-black overflow-hidden shadow-xl border-2 border-[#d8c29d]/80">
                  {embedInfo.isEmbed ? (
                    <iframe
                      src={embedInfo.url}
                      title={currentModalVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={currentModalVideo.url}
                      ref={videoRef}
                      src={currentModalVideo.url}
                      controls
                      autoPlay
                      preload="auto"
                      playsInline
                      loop
                      onCanPlay={(event) => {
                        void event.currentTarget.play().catch(() => undefined);
                      }}
                      onEnded={resumeBackgroundMusic}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          FLOATING BOTTOM GRAND FINALE CTA TO CUT CAKE
          ========================================================================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundEngine.playClick();
            onContinue();
          }}
          className="flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#5c061d] hover:bg-[#700924] text-[#fbf5eb] font-normal text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_12px_30px_rgba(92,6,29,0.25)] border border-[#480315] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#e6cb9d] animate-spin" />
          <span>Finallll pageeeee</span>
          <ArrowRight className="w-4 h-4 text-[#e6cb9d]" />
        </motion.button>
      </div>

    </div>
  );
};
