import React, { useState } from 'react';
import { Sparkles, Menu, X, Heart, Users, Calendar, MessageCircle, HelpCircle, Star, ArrowRight, Home, Flame } from 'lucide-react';

interface NavbarProps {
  onOpenRecruitmentModal: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRecruitmentModal,
  activeSection,
  setActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementClosed, setAnnouncementClosed] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Beranda', icon: Home },
    { id: 'recruitment', label: 'Batch 39 (Open)', icon: Calendar, highlight: true },
    { id: 'programs', label: 'Program', icon: Heart },
    { id: 'memory-wall', label: 'Memory Wall', icon: Users },
    { id: 'stories', label: 'Pulang Bercerita', icon: MessageCircle },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Cute Announcement Bar */}
      {!announcementClosed && (
        <div className="bg-gradient-to-r from-[#4ECDC4] via-[#56C5B6] to-[#FFE066] text-[#2D3748] px-3 py-1.5 text-xs font-heading font-bold flex items-center justify-between border-b border-[#2D3748]/10 transition-all z-50 relative">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center sm:justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-[#2D3748] text-[#FFE066] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold shrink-0">
                LIVE NOW
              </span>
              <span className="truncate">
                ✨ Open Recruitment Volunteer Batch 39 Is Live! (Depok & Jakarta)
              </span>
            </div>
            <button
              onClick={onOpenRecruitmentModal}
              className="hidden sm:inline-flex items-center gap-1 bg-[#2D3748] hover:bg-black text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-3 h-3 text-[#FFE066]" />
            </button>
          </div>
          <button
            onClick={() => setAnnouncementClosed(true)}
            className="text-[#2D3748]/70 hover:text-[#2D3748] p-1 ml-2 rounded-full focus:outline-none shrink-0"
            aria-label="Tutup pengumuman"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E2E8F0]/80 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-15 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-tr from-[#4ECDC4] via-[#56C5B6] to-[#00B4D8] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xs transform group-hover:rotate-6 transition-transform border border-[#2D3748]/10">
              <span className="text-white font-heading font-extrabold text-lg sm:text-2xl tracking-tight drop-shadow-2xs">P</span>
              {/* Cute Yellow Star Mascot Accent */}
              <div className="absolute -top-1 -right-1 bg-[#FFE066] text-[#2D3748] rounded-full p-0.5 shadow-2xs animate-bounce border border-[#2D3748]/20">
                <Star className="w-2.5 h-2.5 sm:w-3 h-3 fill-[#FFE066] stroke-[#2D3748]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-base sm:text-xl text-[#2D3748] tracking-tight group-hover:text-[#4ECDC4] transition-colors">
                  pulangkesinii
                </span>
                <span className="bg-[#FFE066] text-[#2D3748] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#2D3748]/15 shadow-2xs">
                  Community
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ECDC4] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4ECDC4]"></span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-[#718096] font-semibold">
                  Batch 39 Open Recruitment
                </p>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-[#CBD5E0]/60 shadow-2xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4ECDC4] text-white shadow-xs'
                      : 'text-[#4A5568] hover:text-[#2D3748] hover:bg-[#E0F7FA]/70'
                  } ${item.highlight ? 'relative' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#4ECDC4]'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFE066] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFE066] border border-white"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenRecruitmentModal}
              className="group relative inline-flex items-center gap-2 bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-2xl border-2 border-[#2D3748] shadow-[3px_3px_0px_0px_rgba(45,55,72,0.9)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#2D3748] group-hover:rotate-12 transition-transform shrink-0" />
              <span>Daftar Volunteer</span>
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenRecruitmentModal}
              className="bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-bold text-xs px-3 py-1.5 rounded-xl border-2 border-[#2D3748]/80 shadow-[2px_2px_0px_0px_rgba(45,55,72,0.8)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
            >
              <Star className="w-3 h-3 fill-[#2D3748] stroke-none" />
              <span>Daftar B39</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2D3748] bg-white rounded-xl border border-[#CBD5E0] shadow-2xs hover:bg-[#E0F7FA] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#2D3748]" /> : <Menu className="w-5 h-5 text-[#2D3748]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer Modal Card */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF9F5] border-b-2 border-[#2D3748]/20 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            
            {/* Drawer Status Banner */}
            <div className="bg-[#E0F7FA] p-3.5 rounded-2xl border border-[#4ECDC4]/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#4ECDC4] text-white rounded-xl">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-heading font-bold text-xs text-[#2D3748]">
                    Open Recruitment Batch 39
                  </p>
                  <p className="text-[10px] text-[#718096]">
                    Kuota Terisi: 78% • Penutupan 5 Hari Lagi!
                  </p>
                </div>
              </div>
              <span className="bg-[#FFE066] text-[#2D3748] text-[9px] font-bold px-2 py-1 rounded-full border border-[#2D3748]/10">
                LIMITED
              </span>
            </div>

            {/* Nav Cards */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-heading font-bold transition-all text-left ${
                      isActive
                        ? 'bg-[#4ECDC4] text-white shadow-xs border border-[#2D3748]/20'
                        : 'bg-white text-[#2D3748] border border-[#E2E8F0] hover:bg-[#E0F7FA]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#4ECDC4]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Drawer Main Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRecruitmentModal();
                }}
                className="w-full bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-extrabold text-sm py-3 px-4 rounded-2xl border-2 border-[#2D3748] shadow-[3px_3px_0px_0px_rgba(45,55,72,0.9)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#2D3748]" />
                <span>Daftar Volunteer Batch 39 Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <div className="block md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-auto">
        <div className="bg-[#FAF9F5]/95 backdrop-blur-md border-2 border-[#2D3748]/20 shadow-[0_8px_20px_rgba(45,55,72,0.15)] rounded-2xl p-1.5 flex items-center justify-around">
          
          <button
            onClick={() => handleNavClick('hero')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-heading font-bold transition-all ${
              activeSection === 'hero' ? 'text-[#00838F] bg-[#E0F7FA]' : 'text-[#718096]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => handleNavClick('recruitment')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-heading font-bold transition-all relative ${
              activeSection === 'recruitment' ? 'text-[#00838F] bg-[#E0F7FA]' : 'text-[#718096]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#4ECDC4]" />
            <span>Batch 39</span>
            <span className="absolute top-0 right-2 w-2 h-2 bg-[#FFE066] rounded-full border border-[#2D3748]"></span>
          </button>

          <button
            onClick={() => handleNavClick('memory-wall')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-heading font-bold transition-all ${
              activeSection === 'memory-wall' ? 'text-[#00838F] bg-[#E0F7FA]' : 'text-[#718096]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Memory</span>
          </button>

          <button
            onClick={() => handleNavClick('stories')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-heading font-bold transition-all ${
              activeSection === 'stories' ? 'text-[#00838F] bg-[#E0F7FA]' : 'text-[#718096]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Bercerita</span>
          </button>

          <button
            onClick={onOpenRecruitmentModal}
            className="flex flex-col items-center justify-center gap-0.5 bg-[#FFE066] text-[#2D3748] px-3 py-1 rounded-xl border border-[#2D3748]/30 font-heading font-extrabold text-[10px] shadow-2xs active:scale-95 transition-transform cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daftar</span>
          </button>

        </div>
      </div>
    </>
  );
};
