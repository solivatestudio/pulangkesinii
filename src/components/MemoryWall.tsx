import React, { useState } from 'react';
import { Heart, Sparkles, Filter, MapPin, Calendar, MessageCircle, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { MemoryPhoto } from '../types';

interface MemoryWallProps {
  photos: MemoryPhoto[];
  selectedCategoryFilter: string | null;
  onClearFilter: () => void;
}

export const MemoryWall: React.FC<MemoryWallProps> = ({
  photos,
  selectedCategoryFilter,
  onClearFilter,
}) => {
  const [activeBatchFilter, setActiveBatchFilter] = useState<string>('Semua');
  const [likedPhotoIds, setLikedPhotoIds] = useState<Record<string, number>>({});
  const [activePhotoModal, setActivePhotoModal] = useState<MemoryPhoto | null>(null);

  const batchOptions = ['Semua', 'Batch 38', 'Batch 37', 'Batch 36', 'Batch 35', 'Batch 34'];

  const filteredPhotos = photos.filter((photo) => {
    const matchCategory = !selectedCategoryFilter || photo.category === selectedCategoryFilter;
    const matchBatch = activeBatchFilter === 'Semua' || photo.batchTag === activeBatchFilter;
    return matchCategory && matchBatch;
  });

  const handleLike = (id: string, currentLikes: number) => {
    setLikedPhotoIds((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentLikes) + 1
    }));
  };

  return (
    <section id="memory-wall" className="py-16 bg-[#FAF9F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FFF9DB] text-[#B45309] text-xs font-heading font-bold px-3 py-1 rounded-full border border-[#FFE066] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIGITAL SCRAPBOOK GALLERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2D3748]">
              Memory Wall & Core Memories 📸
            </h2>
            <p className="text-sm text-[#4A5568] mt-1 font-medium">
              Kumpulan momen tulus, canda tawa, dan cerita inspiratif dari tiap batch #TemanPulangKamu.
            </p>
          </div>

          {/* Active Category Filter Pill */}
          {selectedCategoryFilter && (
            <div className="bg-[#E0F7FA] text-[#00838F] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-[#4ECDC4]/40">
              <span>Filter: {selectedCategoryFilter}</span>
              <button onClick={onClearFilter} className="hover:text-red-500 font-extrabold cursor-pointer">×</button>
            </div>
          )}
        </div>

        {/* Batch Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 pb-3 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-xs font-bold text-[#718096] mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Batch:
          </span>
          {batchOptions.map((batch) => (
            <button
              key={batch}
              onClick={() => setActiveBatchFilter(batch)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs font-heading font-bold transition-all shrink-0 cursor-pointer ${
                activeBatchFilter === batch
                  ? 'bg-[#4ECDC4] text-white shadow-xs border-2 border-[#2D3748]'
                  : 'bg-white text-[#4A5568] hover:bg-[#E0F7FA] border border-[#CBD5E0]'
              }`}
            >
              {batch}
            </button>
          ))}
        </div>

        {/* Polaroid Scrapbook Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo, index) => {
            const likes = likedPhotoIds[photo.id] ?? photo.likesCount;
            const tiltClass = index % 2 === 0 ? 'sm:rotate-1' : 'sm:-rotate-1';

            return (
              <div
                key={photo.id}
                className={`group bg-white p-3.5 sm:p-4 pb-5 sm:pb-6 rounded-2xl sm:rounded-3xl border-2 border-[#E2E8F0] hover:border-[#2D3748] polaroid-shadow transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 ${tiltClass} hover:rotate-0 relative`}
              >
                {/* Top Washi Tape Decor */}
                <div className="tape-top-center"></div>

                {/* Sticker Badge Label */}
                {photo.stickerLabel && (
                  <div className="absolute top-6 left-6 z-10 bg-[#FFE066] text-[#2D3748] text-[11px] font-heading font-bold px-3 py-1 rounded-full border border-[#2D3748]/15 shadow-xs">
                    {photo.stickerLabel}
                  </div>
                )}

                {/* Photo Container */}
                <div
                  onClick={() => setActivePhotoModal(photo)}
                  className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#FAF9F5] cursor-pointer group-hover:opacity-95 transition-opacity"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#4ECDC4]" />
                    <span>{photo.location}</span>
                  </div>
                </div>

                {/* Caption & Metadata */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-[#E0F7FA] text-[#00838F] font-bold px-2.5 py-0.5 rounded-lg">
                      {photo.batchTag}
                    </span>
                    <span className="text-[#718096] text-[11px] font-medium">
                      {photo.date}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#2D3748] leading-snug">
                    {photo.title}
                  </h3>

                  <p className="text-xs text-[#4A5568] line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>

                  {/* Interactive Like & Lightbox Trigger */}
                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <button
                      onClick={() => handleLike(photo.id, photo.likesCount)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#C2185B] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-[#FFB7B2] text-[#C2185B]" />
                      <span>{likes} Loves</span>
                    </button>

                    <button
                      onClick={() => setActivePhotoModal(photo)}
                      className="text-xs font-bold text-[#4ECDC4] hover:underline cursor-pointer"
                    >
                      Baca Cerita Lengkap →
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#CBD5E0]">
            <p className="font-heading font-bold text-lg text-[#718096]">Belum ada foto untuk filter ini 😊</p>
            <p className="text-xs text-[#A0AEC0] mt-1">Coba pilih filter batch lain di atas ya!</p>
          </div>
        )}

      </div>

      {/* Lightbox Memory Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3748]/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-[#2D3748] shadow-2xl overflow-hidden my-8 p-6">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-[#FAF9F5] rounded-full border border-[#2D3748]/20 hover:bg-[#FFE066] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-[#2D3748]" />
            </button>

            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-16/9 bg-[#FAF9F5]">
                <img
                  src={activePhotoModal.imageUrl}
                  alt={activePhotoModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-[#FFE066] text-[#2D3748] font-heading font-bold text-xs px-3 py-1 rounded-full">
                  {activePhotoModal.batchTag}
                </span>
                <span className="bg-[#E0F7FA] text-[#00838F] font-heading font-bold text-xs px-3 py-1 rounded-full">
                  {activePhotoModal.category}
                </span>
              </div>

              <h3 className="font-heading font-bold text-2xl text-[#2D3748]">
                {activePhotoModal.title}
              </h3>

              <p className="text-sm text-[#4A5568] leading-relaxed">
                {activePhotoModal.caption}
              </p>

              {activePhotoModal.quoteText && (
                <div className="p-4 bg-[#F0FDF4] border-l-4 border-[#4ECDC4] rounded-r-2xl italic text-xs text-[#2D3748]">
                  "{activePhotoModal.quoteText}"
                  <p className="font-bold font-heading not-italic text-[#00838F] mt-1">
                    — {activePhotoModal.quoteAuthor}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-[#718096]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#4ECDC4]" />
                  <span>{activePhotoModal.location} • {activePhotoModal.date}</span>
                </div>

                <button
                  onClick={() => handleLike(activePhotoModal.id, activePhotoModal.likesCount)}
                  className="flex items-center gap-1 bg-[#FCE4EC] text-[#C2185B] font-bold px-3 py-1.5 rounded-full border border-[#FFB7B2] cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-[#FFB7B2]" />
                  <span>{likedPhotoIds[activePhotoModal.id] ?? activePhotoModal.likesCount} Loves</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
