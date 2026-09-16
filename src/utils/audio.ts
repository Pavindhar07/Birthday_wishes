// Audio engine supporting sample background music + Web Audio sound effects & music box fallback
class SoundEngine {
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private isVaultUnlocked: boolean = false;
  private bgAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private currentMusicUrl: string = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";
  private synthInterval: number | null = null;
  private synthStep: number = 0;
  private listeners: Set<(state: { isMuted: boolean; isPlaying: boolean; isVaultUnlocked: boolean }) => void> = new Set();

  constructor() {
    // Check saved mute preference if available
    try {
      const saved = localStorage.getItem('birthday_music_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      // Ignore localStorage errors
    }

    // Prepare audio element without auto-playing before vault unlock
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;

    if (!this.bgAudio) {
      this.bgAudio = new Audio();
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.35;
      this.bgAudio.preload = 'auto';

      this.bgAudio.addEventListener('play', () => {
        this.isPlaying = true;
        this.stopSynthFallback();
        this.notifyListeners();
      });

      this.bgAudio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.bgAudio.addEventListener('error', () => {
        // If MP3 fails to load, gracefully fall back to web audio music box if unmuted
        if (!this.isMuted && this.isPlaying) {
          this.startSynthFallback();
        }
      });
    }

    if (this.currentMusicUrl && this.bgAudio.src !== this.currentMusicUrl) {
      this.bgAudio.src = this.currentMusicUrl;
    }
  }

  public unlockVaultAndPlayMusic() {
    if (this.isVaultUnlocked) {
      return;
    }

    this.isVaultUnlocked = true;
    if (!this.isMuted) {
      this.playBackgroundMusic();
    }
    this.notifyListeners();
  }

  public getIsVaultUnlocked(): boolean {
    return this.isVaultUnlocked;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMusicUrl(url: string) {
    if (!url || url === this.currentMusicUrl) return;
    this.currentMusicUrl = url;
    const wasPlaying = this.isPlaying;

    if (this.bgAudio) {
      this.bgAudio.src = url;
      if (wasPlaying && !this.isMuted && this.isVaultUnlocked) {
        this.bgAudio.play().catch(() => {
          this.startSynthFallback();
        });
      }
    }
  }

  public getMusicUrl(): string {
    return this.currentMusicUrl;
  }

  public subscribe(listener: (state: { isMuted: boolean; isPlaying: boolean; isVaultUnlocked: boolean }) => void) {
    this.listeners.add(listener);
    listener({ isMuted: this.isMuted, isPlaying: this.isPlaying, isVaultUnlocked: this.isVaultUnlocked });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const state = { isMuted: this.isMuted, isPlaying: this.isPlaying, isVaultUnlocked: this.isVaultUnlocked };
    this.listeners.forEach((cb) => cb(state));
  }

  public playBackgroundMusic() {
    if (this.isMuted) return;

    this.initAudioElement();
    if (this.bgAudio && this.currentMusicUrl) {
      this.bgAudio.play().then(() => {
        this.isPlaying = true;
        this.stopSynthFallback();
        this.notifyListeners();
      }).catch(() => {
        // Autoplay policy or load failure: use synth music box
        this.startSynthFallback();
        this.isPlaying = true;
        this.notifyListeners();
      });
    } else {
      this.startSynthFallback();
      this.isPlaying = true;
      this.notifyListeners();
    }
  }

  public pauseBackgroundMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.stopSynthFallback();
    this.isPlaying = false;
    this.notifyListeners();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('birthday_music_muted', String(muted));
    } catch {
      // Ignore
    }

    if (this.bgAudio) {
      this.bgAudio.muted = muted;
    }

    if (muted) {
      this.pauseBackgroundMusic();
    } else {
      if (this.isVaultUnlocked) {
        this.playBackgroundMusic();
      }
    }

    this.notifyListeners();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggleBackgroundMusic(play: boolean) {
    if (play && !this.isMuted) {
      this.playBackgroundMusic();
    } else {
      this.pauseBackgroundMusic();
    }
  }

  // --- Fallback Ambient Music Box Synthesizer ---
  private startSynthFallback() {
    if (this.synthInterval !== null || this.isMuted) return;

    // Charming gentle arpeggio frequencies (C, E, G, B, C5, G4, E4)
    const notes = [
      523.25, 659.25, 783.99, 987.77, 1046.50, 783.99, 659.25, 587.33,
      523.25, 659.25, 880.00, 783.99, 659.25, 523.25, 587.33, 523.25
    ];

    this.synthInterval = window.setInterval(() => {
      if (this.isMuted) {
        this.stopSynthFallback();
        return;
      }
      const freq = notes[this.synthStep % notes.length];
      this.synthStep++;
      this.playTone(freq, 0.45, 0.08, 'sine');
    }, 450);
  }

  private stopSynthFallback() {
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // --- Web Audio Synthesized Sound Effects ---
  private playTone(freq: number, duration: number, volume: number = 0.1, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  public playClick() {
    return;
  }

  public playSuccessChime() {
    return;
  }

  public playErrorShake() {
    return;
  }

  public playBlowCandle() {
    return;
  }

  public playCakeSlice() {
    return;
  }

  public playCameraSnap() {
    return;
  }

  public playBirthdayMelody() {
    return;
  }
}

export const soundEngine = new SoundEngine();
