import React, { useState, useEffect } from 'react';
import { PageStep, SurpriseData } from './types';
import { loadSurpriseData, saveSurpriseData } from './utils/storage';
import { FloatingParticles } from './components/FloatingParticles';
import { CustomizeModal } from './components/CustomizeModal';
import { AudioMuteButton } from './components/AudioMuteButton';
import { soundEngine } from './utils/audio';
import { PasscodePage } from './components/pages/PasscodePage';
import { LoadingPage } from './components/pages/LoadingPage';
import { BirthdayIntroPage } from './components/pages/BirthdayIntroPage';
import { MemoriesPage } from './components/pages/MemoriesPage';
import { LetterPage } from './components/pages/LetterPage';
import { CakePage } from './components/pages/CakePage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [pageStep, setPageStep] = useState<PageStep>('passcode');
  const [unlockedSteps, setUnlockedSteps] = useState<PageStep[]>(['passcode']);
  const [data, setData] = useState<SurpriseData>(loadSurpriseData);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const unlockNextStep = (nextStep: PageStep) => {
    setUnlockedSteps((prev) => (prev.includes(nextStep) ? prev : [...prev, nextStep]));
    setPageStep(nextStep);
  };

  const handleSaveCustomization = (newData: SurpriseData) => {
    setData(newData);
    saveSurpriseData(newData);
    if (newData.bgMusicUrl) {
      soundEngine.setMusicUrl(newData.bgMusicUrl);
    }
  };

  useEffect(() => {
    if (data.bgMusicUrl) {
      soundEngine.setMusicUrl(data.bgMusicUrl);
    }
  }, [data.bgMusicUrl]);

  const particleTheme = {
    passcode: 'hearts',
    loading: 'sparkles',
    greeting: 'hearts',
    memories: 'mixed',
    letter: 'hearts',
    cake: 'balloons',
  }[pageStep] as 'hearts' | 'sparkles' | 'balloons' | 'mixed';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#fbf5eb] text-[#3a0614] font-sans selection:bg-[#5c061d] selection:text-[#fbf5eb] relative overflow-x-hidden flex flex-col"
    >
      {/* Ambient Floating Particles & Warm Champagne / Burgundy Atmosphere */}
      <FloatingParticles theme={particleTheme} />

      {/* Creator Customization Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        data={data}
        onSave={handleSaveCustomization}
      />

      {/* Main Page Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {pageStep === 'passcode' && (
            <motion.div
              key="passcode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-center"
            >
              <PasscodePage
                friendName={data.friendName}
                relationshipTitle={data.relationshipTitle}
                passcode={data.passcode}
                passcodeHint={data.passcodeHint}
                passcodeBgImage={data.passcodeBgImage}
                onSuccess={() => unlockNextStep('loading')}
              />
            </motion.div>
          )}

          {pageStep === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-center"
            >
              <LoadingPage
                friendName={data.friendName}
                onComplete={() => unlockNextStep('greeting')}
              />
            </motion.div>
          )}

          {pageStep === 'greeting' && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col justify-center"
            >
              <BirthdayIntroPage
                friendName={data.friendName}
                bgImage={data.greetingBgImage}
                onContinue={() => unlockNextStep('memories')}
              />
            </motion.div>
          )}

          {pageStep === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <MemoriesPage
                friendName={data.friendName}
                memories={data.memories}
                onContinue={() => unlockNextStep('letter')}
              />
            </motion.div>
          )}

          {pageStep === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <LetterPage
                friendName={data.friendName}
                greeting={data.letterGreeting}
                body={data.letterBody}
                closing={data.letterClosing}
                sender={data.letterSender}
                videoUrl={data.videoUrl}
                videoTitle={data.videoTitle}
                videoCaption={data.videoCaption}
                videos={data.videos}
                onUpdateVideos={(newVideos) => {
                  const updated = {
                    ...data,
                    videos: newVideos,
                    videoUrl: newVideos[0]?.url || data.videoUrl,
                  };
                  setData(updated);
                  saveSurpriseData(updated);
                }}
                onUpdateVideo={(url, title) => {
                  const updated = {
                    ...data,
                    videoUrl: url,
                    videoTitle: title || data.videoTitle,
                  };
                  setData(updated);
                  saveSurpriseData(updated);
                }}
                onContinue={() => unlockNextStep('cake')}
              />
            </motion.div>
          )}

          {pageStep === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <CakePage
                friendName={data.friendName}
                relationshipTitle={data.relationshipTitle}
                cakeMessage={data.cakeMessage}
                whatsappNumber={data.whatsappNumber}
                onRestart={() => {
                  setPageStep('passcode');
                  setUnlockedSteps(['passcode']);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom-Right Corner Mute / Unmute Button */}
      <AudioMuteButton />
    </motion.div>
  );
}
