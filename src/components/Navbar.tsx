import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Calendar, 
  Heart, 
  Info, 
  MessageSquare, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Compass,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onNavigateSection,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'kegiatan', label: 'Cari Kegiatan', icon: Calendar, highlight: true },
    { id: 'program', label: 'Program', icon: Compass },
    { id: 'tentang-kami', label: 'Tentang Kami', icon: Info },
    { id: 'cerita', label: 'Cerita Relawan', icon: Heart },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'kolaborasi', label: 'Kemitraan', icon: PhoneCall },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Urgent Alert Bar */}
      {!announcementDismissed && (
        <div className="bg-gradient-to-r from-[#0EADAD] via-[#00B4EB] to-[#0EADAD] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 relative shadow-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
              <span className="bg-white/25 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full tracking-wider animate-pulse shrink-0">
                Pendaftaran B39
              </span>
              <span className="truncate">
                🔥 <strong>Volunteer Batch 39 — Semesta Senyum</strong> sedang dibuka (Sisa 16 slot)!
              </span>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleNavClick('kegiatan')}
                className="inline-flex items-center gap-1 bg-white text-[#0EADAD] hover:bg-[#E6F7F7] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs transition-all cursor-pointer"
              >
                <span>Lihat Kegiatan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded-full ml-2 cursor-pointer shrink-0"
            aria-label="Tutup pengumuman"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2E8F0]' 
            : 'bg-white/90 backdrop-blur-xs border-b border-[#E2E8F0]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Star Asset */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-none"
          >
            <div className="relative flex items-center justify-center">
              <img 
                src="/assets/star-yellow.png" 
                alt="Pulangkesinii Star Mascot" 
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-xs"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#172B32] tracking-tight group-hover:text-[#0EADAD] transition-colors">
                  pulangkesinii
                </span>
                <span className="bg-[#E6F7F7] text-[#0EADAD] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0EADAD]/20 hidden xs:inline-block">
                  Community
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#647A80] font-medium hidden sm:block">
                Setiap Kebaikan Selalu Punya Tempat Pulang
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E6F7F7] text-[#0EADAD] font-bold'
                      : 'text-[#172B32] hover:text-[#0EADAD] hover:bg-[#F8FBFB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0EADAD]' : 'text-[#647A80]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-[#647A80] hover:text-[#0EADAD] hover:bg-[#E6F7F7] transition-all cursor-pointer border border-[#E2E8F0]"
              title="Cari Kegiatan"
              aria-label="Cari Kegiatan"
            >
              <Search className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii,%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#E6F7F7] hover:bg-[#0EADAD] hover:text-white text-[#0EADAD] text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#0EADAD]/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tanya Admin</span>
            </a>

            <button
              onClick={() => handleNavClick('kegiatan')}
              className="inline-flex items-center gap-2 bg-[#0EADAD] hover:bg-[#108080] text-white text-xs sm:text-sm font-heading font-bold px-5 py-2.5 rounded-xl shadow-teal-glow active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFE066]" />
              <span>Daftar Kegiatan</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('kegiatan')}
              className="bg-[#0EADAD] text-white text-xs font-heading font-bold px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow-xs"
            >
              Daftar
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#172B32] bg-[#F8FBFB] rounded-xl border border-[#E2E8F0] hover:bg-[#E6F7F7] focus:outline-none cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-[#0EADAD] text-white font-bold'
                        : 'bg-[#F8FBFB] text-[#172B32] hover:bg-[#E6F7F7]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full bg-[#F8FBFB] text-[#172B32] font-semibold text-xs py-3 px-4 rounded-xl border border-[#E2E8F0] flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-[#0EADAD]" />
                <span>Cari Kegiatan / Lokasi</span>
              </button>

              <a
                href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii,%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0EADAD] text-white font-heading font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Admin WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Ergonomic Mobile UX */}
      <div className="block lg:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-lg rounded-2xl p-1.5 flex items-center justify-around">
          <button
            onClick={() => handleNavClick('hero')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeSection === 'hero' ? 'text-[#0EADAD] font-bold bg-[#E6F7F7]' : 'text-[#647A80]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => handleNavClick('kegiatan')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all relative ${
              activeSection === 'kegiatan' ? 'text-[#0EADAD] font-bold bg-[#E6F7F7]' : 'text-[#647A80]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#0EADAD]" />
            <span>Kegiatan</span>
            <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#00B4EB] rounded-full"></span>
          </button>

          <button
            onClick={() => handleNavClick('tentang-kami')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeSection === 'tentang-kami' ? 'text-[#0EADAD] font-bold bg-[#E6F7F7]' : 'text-[#647A80]'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Tentang</span>
          </button>

          <button
            onClick={() => handleNavClick('cerita')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeSection === 'cerita' ? 'text-[#0EADAD] font-bold bg-[#E6F7F7]' : 'text-[#647A80]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Cerita</span>
          </button>

          <button
            onClick={() => handleNavClick('kegiatan')}
            className="flex flex-col items-center justify-center bg-[#0EADAD] text-white px-3.5 py-1 rounded-xl font-heading font-bold text-[10px] shadow-xs active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE066]" />
            <span>Daftar</span>
          </button>
        </div>
      </div>
    </>
  );
};
