import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  CheckCircle2,
  Smile,
  Compass
} from 'lucide-react';
import { ActivityCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ActivityCategory;
  setSelectedCategory: (cat: ActivityCategory) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  onExploreClick,
}) => {
  const categoryChips: { label: ActivityCategory; icon: string }[] = [
    { label: 'Semua', icon: '✨' },
    { label: 'Volunteer', icon: '🤝' },
    { label: 'Voluntrip', icon: '🌲' },
    { label: 'Fun Activity', icon: '🎨' },
    { label: 'Social Care', icon: '❤️' },
    { label: 'Lingkungan', icon: '🌱' },
  ];

  const cityOptions = [
    'Semua Kota',
    'Jakarta',
    'Depok',
    'Tangerang',
    'Bandung',
    'Jogja',
    'Surabaya'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreClick();
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-20 bg-gradient-to-b from-[#E6F7F7]/60 via-[#F8FBFB] to-[#F8FBFB]">
      
      {/* Decorative Brand Elements */}
      <div className="absolute top-6 left-8 hidden lg:block opacity-75 pointer-events-none animate-float-gentle">
        <img 
          src="/assets/star-blue.png" 
          alt="Blue Star Accent" 
          className="w-14 h-14 object-contain"
        />
      </div>

      <div className="absolute top-16 right-10 hidden lg:block opacity-85 pointer-events-none animate-float-gentle" style={{ animationDelay: '1.5s' }}>
        <img 
          src="/assets/star-yellow.png" 
          alt="Yellow Star Accent" 
          className="w-16 h-16 object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Search Box */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-[#0EADAD]/30 shadow-2xs text-xs sm:text-sm font-bold text-[#0EADAD]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EADAD] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0EADAD]"></span>
              </span>
              <span>Temukan ruang untuk berbuat baik</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-[#172B32] leading-[1.15] tracking-tight">
                Setiap Kebaikan Selalu Punya{' '}
                <span className="relative inline-block text-[#0EADAD]">
                  Tempat Pulang
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#FFE066] -z-10" 
                    viewBox="0 0 100 20" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0 15 Q50 0 100 15" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-[#647A80] font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed pt-1">
                Temukan kegiatan volunteer, voluntrip, dan aktivitas sosial yang sesuai dengan waktu, minat, serta tempat pulangmu.
              </p>
            </div>

            {/* Kitabisa-Inspired Interactive Search Box Card */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#CBD5E0]/70 shadow-soft max-w-2xl mx-auto lg:mx-0">
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Search Input and City Select */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[#0EADAD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari kegiatan, lokasi, atau tema..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F8FBFB] border border-[#E2E8F0] focus:border-[#0EADAD] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#172B32] focus:outline-none transition-all placeholder:text-[#647A80]/70"
                    />
                  </div>

                  <div className="relative w-full sm:w-44">
                    <MapPin className="w-4 h-4 text-[#00B4EB] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-[#F8FBFB] border border-[#E2E8F0] focus:border-[#0EADAD] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#172B32] focus:outline-none transition-all cursor-pointer appearance-none"
                    >
                      {cityOptions.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl shadow-teal-glow active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Cari Kegiatan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[#647A80] font-medium">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E2E8F0] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#0EADAD]" />
                <span>100% Ramah First-Timer</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E2E8F0] shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#00B4EB]" />
                <span>E-Sertifikat Resmi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E2E8F0] shadow-2xs">
                <Heart className="w-4 h-4 text-[#FFB7B2]" />
                <span>21.2K+ Followers Komunitas</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Collage Cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            <div className="relative w-full max-w-md">
              
              {/* Main Photo Card */}
              <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-[#CBD5E0]/80 shadow-soft card-hover-lift relative z-20">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#F8FBFB]">
                  <img
                    src="/assets/decor-1.png"
                    alt="Volunteer Batch 39 Community"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFE066] text-[#172B32] font-heading font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
                    Batch 39 Active ⭐
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Jakarta & Depok
                  </div>
                </div>

                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#0EADAD] font-bold">Pendidikan & Social Care</span>
                    <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                      🔥 Sisa 16 Slot
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#172B32]">
                    Volunteer Batch 39 — Semesta Senyum
                  </h3>
                  <p className="text-xs text-[#647A80] line-clamp-2">
                    Berbagi tawa, mewarnai kreasi, dan menghadirkan keceriaan bagi adik-adik panti asuhan.
                  </p>
                </div>
              </div>

              {/* Floating Mini Highlight Card */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-md z-30 flex items-center gap-3 animate-float-gentle">
                <div className="w-10 h-10 bg-[#E6F7F7] rounded-xl flex items-center justify-center text-xl">
                  🏡
                </div>
                <div>
                  <p className="font-heading font-bold text-xs text-[#172B32]">
                    Teman Pulang Kamu
                  </p>
                  <p className="text-[10px] text-[#647A80]">
                    38+ Batch Telah Terlaksana
                  </p>
                </div>
              </div>

              {/* Floating Quote Stamp */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-[#FFE066] p-2.5 rounded-2xl border border-[#172B32]/10 shadow-sm z-30 transform rotate-6 animate-pulse-subtle">
                <p className="font-handwriting font-bold text-sm sm:text-base text-[#172B32] px-1">
                  "Pulang bukan sekadar tempat, tapi tujuan ❤️"
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
