import React, { useState } from 'react';
import { X, Save, RotateCcw, Plus, Trash2, Image as ImageIcon, Crown, Music } from 'lucide-react';
import { SurpriseData, Memory } from '../types';
import { resetSurpriseData } from '../utils/storage';
import { motion, AnimatePresence } from 'motion/react';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SurpriseData;
  onSave: (newData: SurpriseData) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<SurpriseData>(data);
  const [activeTab, setActiveTab] = useState<'general' | 'letter' | 'memories'>('general');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all surprise details back to defaults?')) {
      const def = resetSurpriseData();
      setFormData(def);
      onSave(def);
      onClose();
    }
  };

  const handleAddMemory = () => {
    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      title: 'New Core Memory',
      date: 'Today',
      category: 'Daily Fun',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
      caption: 'Write a special memory note here...',
      location: 'Our Happy Place',
      likes: 15,
    };
    setFormData((prev) => ({ ...prev, memories: [newMem, ...prev.memories] }));
  };

  const handleRemoveMemory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  const handleMemoryChange = (id: string, field: keyof Memory, value: string) => {
    setFormData((prev) => ({
      ...prev,
      memories: prev.memories.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241310]/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-[#fcf9f2] rounded-3xl shadow-2xl border border-[#d8c29d] text-[#5c061d] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#d8c29d] bg-[#f5ecdf]">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#ab844c]" />
              <h2 className="text-base font-normal text-[#5c061d] font-display">
                Customize Birthday Vault Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5c061d] hover:bg-[#ede0cf] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-[#d8c29d] bg-[#fcf9f2] p-1.5 gap-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-2 text-xs font-normal rounded-xl transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-[#5c061d] text-[#fbf5eb] shadow-xs'
                  : 'text-[#5c061d] hover:bg-[#f5ecdf]'
              }`}
            >
              General & Vault PIN
            </button>
            <button
              onClick={() => setActiveTab('letter')}
              className={`flex-1 py-2 text-xs font-normal rounded-xl transition-all cursor-pointer ${
                activeTab === 'letter'
                  ? 'bg-[#5c061d] text-[#fbf5eb] shadow-xs'
                  : 'text-[#5c061d] hover:bg-[#f5ecdf]'
              }`}
            >
              Birthday Video & Note
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`flex-1 py-2 text-xs font-normal rounded-xl transition-all cursor-pointer ${
                activeTab === 'memories'
                  ? 'bg-[#5c061d] text-[#fbf5eb] shadow-xs'
                  : 'text-[#5c061d] hover:bg-[#f5ecdf]'
              }`}
            >
              Memories ({formData.memories.length})
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1">
                    Best Friend's Name
                  </label>
                  <input
                    type="text"
                    value={formData.friendName}
                    onChange={(e) => setFormData({ ...formData, friendName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-[#5c061d] mb-1">
                      Vault Secret Passcode / PIN (6 digits)
                    </label>
                    <input
                      type="text"
                      value={formData.passcode}
                      onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-[#5c061d] mb-1">
                      Relationship Title
                    </label>
                    <input
                      type="text"
                      value={formData.relationshipTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, relationshipTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1">
                    Passcode Hint Text
                  </label>
                  <input
                    type="text"
                    value={formData.passcodeHint}
                    onChange={(e) => setFormData({ ...formData, passcodeHint: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#ab844c]" />
                    Front Page Photo Showcase (Left Side Image URL)
                  </label>
                  <input
                    type="url"
                    value={formData.passcodeBgImage || ''}
                    onChange={(e) => setFormData({ ...formData, passcodeBgImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1">
                    Grand Finale Cake Message
                  </label>
                  <input
                    type="text"
                    value={formData.cakeMessage}
                    onChange={(e) => setFormData({ ...formData, cakeMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1">
                    WhatsApp Phone Number (Optional, with country code, e.g. 919876543210)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="e.g. 919876543210 or leave blank for universal WhatsApp"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-[#ab844c]" />
                    Background Music Audio URL (MP3)
                  </label>
                  <input
                    type="url"
                    value={formData.bgMusicUrl || ''}
                    onChange={(e) => setFormData({ ...formData, bgMusicUrl: e.target.value })}
                    placeholder="https://... (direct mp3 link)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                  />
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[11px] text-[#5c061d]/70">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bgMusicUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' })}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[#fbf5eb] border border-[#d8c29d] text-[#5c061d] hover:bg-[#ede0cf] cursor-pointer"
                    >
                      Celebration 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bgMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' })}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[#fbf5eb] border border-[#d8c29d] text-[#5c061d] hover:bg-[#ede0cf] cursor-pointer"
                    >
                      Acoustic 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bgMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' })}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[#fbf5eb] border border-[#d8c29d] text-[#5c061d] hover:bg-[#ede0cf] cursor-pointer"
                    >
                      Piano 3
                    </button>
                  </div>
                  <p className="text-[11px] text-[#5c061d]/60 mt-1">
                    Paste any direct MP3 URL or click a preset to test different background tracks.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'letter' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1">
                    Letter Greeting
                  </label>
                  <input
                    type="text"
                    value={formData.letterGreeting}
                    onChange={(e) => setFormData({ ...formData, letterGreeting: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#5c061d] mb-1">
                    Letter Body Text
                  </label>
                  <textarea
                    rows={6}
                    value={formData.letterBody}
                    onChange={(e) => setFormData({ ...formData, letterBody: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-[#5c061d] mb-1">
                      Closing Line
                    </label>
                    <input
                      type="text"
                      value={formData.letterClosing}
                      onChange={(e) => setFormData({ ...formData, letterClosing: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-[#5c061d] mb-1">
                      Sender Signature
                    </label>
                    <input
                      type="text"
                      value={formData.letterSender}
                      onChange={(e) => setFormData({ ...formData, letterSender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#d8c29d]/60 space-y-3">
                  <h4 className="text-xs uppercase font-serif tracking-widest text-[#ab844c]">
                    Birthday Keepsake Video
                  </h4>
                  <div>
                    <label className="block text-xs font-normal text-[#5c061d] mb-1">
                      Video URL (MP4 link, YouTube URL, or cloud video)
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://.../video.mp4 or https://youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-[#5c061d] mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={formData.videoTitle || ''}
                      onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                      placeholder="e.g. A Heartfelt Birthday Video for Alex"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c29d] bg-[#f5ecdf] text-[#5c061d] text-sm focus:border-[#5c061d] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'memories' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5c061d] font-normal">
                    Add or edit polaroid cards shown in the Memory Gallery
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMemory}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5c061d] text-[#fbf5eb] text-xs font-normal shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#e6cb9d]" />
                    <span>Add Memory</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="p-4 rounded-2xl border border-[#d8c29d] bg-[#f5ecdf] relative space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveMemory(mem.id)}
                        className="absolute top-3 right-3 text-[#5c061d] hover:text-rose-700 p-1 cursor-pointer"
                        title="Delete memory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-normal text-[#5c061d] mb-0.5">
                            Memory Title
                          </label>
                          <input
                            type="text"
                            value={mem.title}
                            onChange={(e) => handleMemoryChange(mem.id, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#d8c29d] bg-[#fcf9f2] text-[#5c061d] text-xs focus:border-[#5c061d] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-normal text-[#5c061d] mb-0.5">
                            Date / Month
                          </label>
                          <input
                            type="text"
                            value={mem.date}
                            onChange={(e) => handleMemoryChange(mem.id, 'date', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#d8c29d] bg-[#fcf9f2] text-[#5c061d] text-xs focus:border-[#5c061d] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-normal text-[#5c061d] mb-0.5 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-[#ab844c]" />
                          Photo Image URL
                        </label>
                        <input
                          type="url"
                          value={mem.imageUrl}
                          onChange={(e) => handleMemoryChange(mem.id, 'imageUrl', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#d8c29d] bg-[#fcf9f2] text-[#5c061d] text-xs focus:border-[#5c061d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-normal text-[#5c061d] mb-0.5">
                          Memory Caption
                        </label>
                        <textarea
                          rows={2}
                          value={mem.caption}
                          onChange={(e) => handleMemoryChange(mem.id, 'caption', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#d8c29d] bg-[#fcf9f2] text-[#5c061d] text-xs focus:border-[#5c061d] outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#d8c29d]">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#5c061d] hover:bg-[#ede0cf] text-xs font-normal transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#ab844c]" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[#5c061d] text-xs font-normal hover:bg-[#ede0cf] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5c061d] hover:bg-[#700924] text-[#fbf5eb] text-xs font-normal shadow-xs transition-transform hover:scale-103 cursor-pointer border border-[#480315]"
                >
                  <Save className="w-3.5 h-3.5 text-[#e6cb9d]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
