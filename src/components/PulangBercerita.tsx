import React, { useState } from 'react';
import { MessageCircle, Heart, Plus, Sparkles, Send, User, Quote, CheckCircle2 } from 'lucide-react';
import { CommunityStory } from '../types';

interface PulangBerceritaProps {
  stories: CommunityStory[];
  onAddStory: (newStory: CommunityStory) => void;
}

export const PulangBercerita: React.FC<PulangBerceritaProps> = ({ stories, onAddStory }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Volunteer Batch 39');
  const [storyText, setStoryText] = useState('');
  const [likedStories, setLikedStories] = useState<Record<string, number>>({});

  const handleLikeStory = (id: string, initialLikes: number) => {
    setLikedStories((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !storyText) {
      alert('Mohon isi nama dan ceritamu ya!');
      return;
    }

    const newStoryItem: CommunityStory = {
      id: `story-${Date.now()}`,
      authorName,
      authorRole: authorRole || 'Teman Pulang',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      storyText,
      batchTag: authorRole.includes('Batch') ? authorRole : 'Teman Pulang',
      date: 'Baru Saja',
      likes: 1,
      userLiked: true,
      highlightPhrase: storyText.length > 60 ? storyText.substring(0, 60) + '...' : storyText
    };

    onAddStory(newStoryItem);
    setModalOpen(false);
    setAuthorName('');
    setStoryText('');
  };

  return (
    <section id="stories" className="py-16 bg-gradient-to-b from-[#FAF9F5] to-[#F0FDF4]/60 border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FCE4EC] text-[#C2185B] text-xs font-heading font-bold px-3 py-1 rounded-full border border-[#FFB7B2] mb-2">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>DIARY & CERITA HANGAT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2D3748]">
              "Pulang Bercerita" 💬
            </h2>
            <p className="text-base text-[#4A5568] mt-1 font-medium">
              Curhatan, kesan mendalam, dan alasan kenapa mereka terus rindu untuk kembali "pulang".
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-bold text-sm px-5 py-3 rounded-2xl border-2 border-[#2D3748] shadow-[3px_3px_0px_0px_rgba(45,55,72,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Cerita Kamu</span>
          </button>
        </div>

        {/* Story Diary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {stories.map((story) => {
            const currentLikes = likedStories[story.id] ?? story.likes;

            return (
              <div
                key={story.id}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#E2E8F0] hover:border-[#4ECDC4] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div className="space-y-4">
                  
                  {/* Quote Icon */}
                  <div className="flex items-center justify-between">
                    <Quote className="w-8 h-8 text-[#4ECDC4]/40" />
                    <span className="bg-[#E0F7FA] text-[#00838F] font-heading font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                      {story.batchTag}
                    </span>
                  </div>

                  <p className="text-sm text-[#2D3748] leading-relaxed italic font-medium">
                    "{story.storyText}"
                  </p>

                </div>

                {/* Author Info */}
                <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatarUrl}
                      alt={story.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-[#2D3748]/10"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#2D3748]">
                        {story.authorName}
                      </h4>
                      <p className="text-[11px] text-[#718096] font-medium">
                        {story.authorRole}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLikeStory(story.id, story.likes)}
                    className="flex items-center gap-1 text-xs font-bold text-[#C2185B] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-[#FFB7B2] text-[#C2185B]" />
                    <span>{currentLikes}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Modal Tulis Cerita */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D3748]/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#FAF9F5] rounded-2xl sm:rounded-3xl border-2 border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] sm:shadow-[8px_8px_0px_0px_rgba(45,55,72,1)] p-5 sm:p-8">
            <h3 className="font-heading font-bold text-2xl text-[#2D3748] mb-1">
              Bagikan Cerita Hangatmu 💌
            </h3>
            <p className="text-xs text-[#718096] mb-5">
              Punya pengalaman berkesan saat volunteer atau kesan pertama tentang Pulangkesinii?
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                  Nama / Panggilan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Maya"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                  Role / Batch
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Volunteer Batch 38 / Calon Volunteer B39"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                  Cerita atau Kesanmu <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan momen manis atau alasan kenapa tempat ini terasa seperti rumah..."
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl p-3 text-sm font-medium focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#718096] hover:text-[#2D3748] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#4ECDC4] hover:bg-[#3AAFA9] text-white font-heading font-bold text-xs px-5 py-2.5 rounded-xl border-2 border-[#2D3748] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Cerita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
