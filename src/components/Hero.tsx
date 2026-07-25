import React from 'react';
import { Sparkles, Heart, Users, ArrowRight, Star, Smile, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenRecruitment: () => void;
  onExploreMemoryWall: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRecruitment, onExploreMemoryWall }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 bg-gradient-to-b from-[#FAF9F5] via-[#F0FDF4]/50 to-[#FAF9F5]">
      
      {/* Decorative Washi Tape & Floating Doodles */}
      <div className="absolute top-6 left-10 hidden lg:block opacity-70 animate-float pointer-events-none">
        <div className="bg-[#FFE066] text-[#2D3748] font-heading font-bold text-xs px-3 py-1.5 rounded-full border border-[#2D3748]/10 shadow-sm flex items-center gap-1.5 transform -rotate-6">
          <Star className="w-3.5 h-3.5 fill-[#FFE066]" />
          <span>#TemanPulangKamu</span>
        </div>
      </div>

      <div className="absolute top-20 right-12 hidden lg:block opacity-80 animate-wiggle pointer-events-none">
        <div className="bg-[#FFB7B2] text-[#2D3748] font-heading font-bold text-xs px-3 py-1.5 rounded-full border border-[#2D3748]/10 shadow-sm flex items-center gap-1.5 transform rotate-6">
          <Smile className="w-3.5 h-3.5 text-[#2D3748]" />
          <span>Core Memory Unlocked ✨</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#E0F7FA] border border-[#4ECDC4]/40 px-3.5 sm:px-4 py-1.5 rounded-full shadow-xs text-xs sm:text-sm font-semibold text-[#00838F] max-w-full">
              <span className="flex h-2 w-2 shrink-0 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ECDC4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ECDC4]"></span>
              </span>
              <span className="truncate">Open Recruitment Volunteer Batch 39 Is Live! 🎉</span>
            </div>

            {/* Emotional Main Headline */}
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-heading font-bold text-[#2D3748] leading-[1.2] sm:leading-[1.15] tracking-tight">
              Pulang bukan sekadar <span className="relative inline-block text-[#00838F]">
                tempat,
                <svg className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-2.5 sm:h-3 text-[#FFE066]/80 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q50 0 100 15" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
                </svg>
              </span> tapi tujuan & orang-orangnya. ❤️
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-[#4A5568] max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Ruang pengabdian, relasi & kreativitas anak muda. Wadah hangat untuk berbagi cerita, berdampak positif, dan menemukan rumah di dalam komunitas volunteer.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onOpenRecruitment}
                className="w-full sm:w-auto min-h-[48px] bg-[#4ECDC4] hover:bg-[#3AAFA9] text-white font-heading font-bold text-base px-6 sm:px-7 py-3 rounded-2xl border-2 border-[#2D3748]/20 shadow-[3px_3px_0px_0px_rgba(45,55,72,0.8)] sm:shadow-[4px_4px_0px_0px_rgba(45,55,72,0.8)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 shrink-0" />
                <span>Daftar Volunteer Batch 39</span>
                <ArrowRight className="w-4 h-4 ml-0.5 shrink-0" />
              </button>

              <button
                onClick={onExploreMemoryWall}
                className="w-full sm:w-auto min-h-[48px] bg-white hover:bg-[#F0FDF4] text-[#2D3748] font-heading font-semibold text-base px-6 py-3 rounded-2xl border-2 border-[#CBD5E0] hover:border-[#4ECDC4] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-5 h-5 text-[#4ECDC4] shrink-0" />
                <span>Lihat Keseruan Kami</span>
              </button>
            </div>

            {/* Quick Micro Social Proof */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-[#718096] font-medium">
              <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4ECDC4]" />
                <span>100% Free & Friendly</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
                <Heart className="w-3.5 h-3.5 text-[#FFB7B2]" />
                <span>21.2K+ Instagram</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
                <Star className="w-3.5 h-3.5 text-[#FFE066] fill-[#FFE066]" />
                <span>38+ Batch Complete</span>
              </div>
            </div>

          </div>

          {/* Right Column: Digital Scrapbook Polaroid Collage */}
          <div className="lg:col-span-5 relative flex justify-center pt-2 sm:pt-0">
            
            {/* Background Scrapbook Card Wrapper */}
            <div className="relative w-full max-w-sm sm:max-w-md px-2 sm:px-0">
              
              {/* Main Polaroid 1 */}
              <div className="relative bg-white p-2.5 sm:p-3 pt-3.5 sm:pt-4 pb-5 sm:pb-6 rounded-2xl polaroid-shadow border border-[#E2E8F0] transform -rotate-2 sm:-rotate-3 hover:rotate-0 transition-transform duration-300 z-20">
                <div className="tape-top-center"></div>
                
                <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#FAF9F5]">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                    alt="Volunteers smiling together"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#FFE066] text-[#2D3748] font-heading font-bold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
                    Batch 38 🌟
                  </div>
                </div>

                <div className="mt-2.5 sm:mt-3 text-center">
                  <p className="font-heading font-bold text-[#2D3748] text-sm sm:text-base">
                    "Absen yang kangen ikut volunteer! 💛"
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#718096] mt-0.5">
                    Depok • 100 Volunteers Joined
                  </p>
                </div>
              </div>

              {/* Secondary Overlapping Polaroid 2 */}
              <div className="absolute -bottom-4 -right-1 sm:top-12 sm:-right-8 w-1/2 sm:w-3/4 bg-white p-2 sm:p-3 pt-3 sm:pt-4 pb-3 sm:pb-5 rounded-2xl polaroid-shadow border border-[#E2E8F0] transform rotate-6 sm:rotate-6 hover:rotate-2 transition-transform duration-300 z-30">
                <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#FAF9F5]">
                  <img
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80"
                    alt="Fun Activity Volunteering"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-[#FFB7B2] text-[#2D3748] font-heading font-bold text-[9px] sm:text-xs px-2 py-0.5 rounded-full shadow-xs">
                    Batch 39
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-heading font-bold text-xs text-[#2D3748]">
                    Satu senyum, ribuan kehangatan.
                  </p>
                </div>
              </div>

              {/* Cute Mascot Sticker floating on card */}
              <div className="absolute -bottom-6 -left-6 z-40 bg-[#FFE066] p-3 rounded-2xl border-2 border-[#2D3748] shadow-md transform -rotate-12 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-heading font-bold text-lg text-[#2D3748]">
                    ⭐
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-[#2D3748]">Bintang Pulang</p>
                    <p className="text-[10px] text-[#4A5568]">"Siap bikin memori baru?"</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
