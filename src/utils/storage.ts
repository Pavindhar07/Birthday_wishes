import { SurpriseData } from '../types';
import { defaultSurpriseData } from '../data/defaultData';

const STORAGE_KEY = 'best_friend_surprise_data_v3';

export function loadSurpriseData(): SurpriseData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedVideos = parsed.videos?.map((video: SurpriseData['videos'][number]) =>
        video.id === 'video-1' ? { ...video, url: '/video/1.mp4' } : video
      );
      return {
        ...defaultSurpriseData,
        ...parsed,
        whatsappNumber: parsed.whatsappNumber || defaultSurpriseData.whatsappNumber,
        videos: savedVideos || defaultSurpriseData.videos,
        memories: parsed.memories && parsed.memories.length >= defaultSurpriseData.memories.length
          ? parsed.memories
          : defaultSurpriseData.memories,
      };
    }
  } catch (err) {
    console.error('Error loading surprise data from localStorage:', err);
  }
  return defaultSurpriseData;
}

export function saveSurpriseData(data: SurpriseData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving surprise data to localStorage:', err);
  }
}

export function resetSurpriseData(): SurpriseData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting surprise data:', err);
  }
  return defaultSurpriseData;
}
