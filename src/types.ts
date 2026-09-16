export type PageStep = 'passcode' | 'loading' | 'greeting' | 'memories' | 'letter' | 'cake';

export interface Memory {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  caption: string;
  location?: string;
  likes: number;
}

export interface VideoKeepsake {
  id: string;
  title: string;
  caption: string;
  url: string;
}

export interface SurpriseData {
  friendName: string;
  passcode: string;
  passcodeHint: string;
  passcodeBgImage?: string;
  greetingBgImage?: string;
  relationshipTitle: string; // e.g. "Best Friend Forever", "Partner in Crime"
  birthdayDate?: string;
  letterGreeting: string;
  letterBody: string;
  letterClosing: string;
  letterSender: string;
  videoUrl?: string;
  videoTitle?: string;
  videoCaption?: string;
  videos?: VideoKeepsake[];
  memories: Memory[];
  cakeMessage: string;
  cakeFlavors?: string[];
  whatsappNumber?: string;
  bgMusicUrl?: string;
}

export interface SoundSettings {
  muted: boolean;
  musicPlaying: boolean;
}
