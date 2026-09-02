import React, { useState } from 'react';
import { Heart, Sparkles, Quote, MapPin, Calendar, X, Star } from 'lucide-react';
import { TESTIMONIALS_DATA, MEMORY_GALLERY } from '../data/mockData';
import { MemoryStoryPhoto } from '../types';

export const MemoryWall: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryStoryPhoto | null>(null);
  const [likesState, setLikesState] = useState<Record<string, number>>({});

  const handleLike = (id: string, initialLikes: number) => {
    setLikesState((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1
    }));
  };

  return (
    <section id="cerita" className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-[#FCE4EC] text-[#C2185B] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#FFB7B2] mb-2">
            <Heart className="w-3.5 h-3.5" />
            <span>CERITA & DOKUMENTASI HANGAT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32]">
            Cerita dari Mereka yang "Pulang" 💬
          </h2>
          <p className="text-xs sm:text-sm text-[#647A80] mt-2 font-medium">
            Kesan mendalam, canda tawa, dan alasan kenapa mereka selalu rindu untuk kembali berkontribusi.
          </p>
        </div>

        {/* Testimonial Cards (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8FBFB] p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs hover:border-[#0EADAD] card-hover-lift flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#0EADAD]/40" />
                <p className="text-xs sm:text-sm text-[#172B32] italic leading-relaxed font-medium">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#0EADAD]/30"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#172B32]">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#647A80]">
                      {item.roleOrBatch}
                    </p>
                  </div>
                </div>

                <span className="bg-[#E6F7F7] text-[#0EADAD] text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {item.activityTag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery / Scrapbook Photo Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#172B32]">
                Galeri Momen Kebaikan 📸
              </h3>
              <p className="text-xs text-[#647A80]">
                Potret tulus interaksi bersama adik-adik dan masyarakat.
              </p>
            </div>

            <a
              href="https://instagram.com/pulangkesinii"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#0EADAD] hover:underline"
            >
              Lihat di Instagram @pulangkesinii →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MEMORY_GALLERY.map((photo) => {
              const currentLikes = likesState[photo.id] ?? photo.likesCount;
              return (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-white p-3 rounded-2xl border border-[#E2E8F0] hover:border-[#0EADAD] shadow-soft card-hover-lift cursor-pointer space-y-2.5"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F8FBFB]">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-[#FFE066] text-[#172B32] font-heading font-bold text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                      {photo.batchTag}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-heading font-bold text-xs text-[#172B32] line-clamp-1">
                      {photo.title}
                    </p>
                    <p className="text-[11px] text-[#647A80] line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-[11px] text-[#647A80]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#00B4EB]" />
                      <span>{photo.location}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(photo.id, photo.likesCount);
                      }}
                      className="flex items-center gap-1 text-[#C2185B] font-bold hover:scale-110 transition-transform"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#FFB7B2]" />
                      <span>{currentLikes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Lightbox Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B32]/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-6 space-y-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-1.5 bg-[#F8FBFB] hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5 text-[#172B32]" />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-16/10 bg-[#F8FBFB]">
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#FFE066] text-[#172B32] font-heading font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {selectedPhoto.batchTag}
                </span>
                <span className="bg-[#E6F7F7] text-[#0EADAD] font-heading font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {selectedPhoto.category}
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-[#172B32]">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#647A80] leading-relaxed">
                {selectedPhoto.caption}
              </p>

              {selectedPhoto.quoteText && (
                <div className="p-3.5 bg-[#E6F7F7] border-l-4 border-[#0EADAD] rounded-r-xl italic text-xs text-[#172B32]">
                  "{selectedPhoto.quoteText}"
                  <p className="font-bold font-heading not-italic text-[#0EADAD] mt-0.5">
                    — {selectedPhoto.quoteAuthor}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
