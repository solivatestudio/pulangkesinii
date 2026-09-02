import React from 'react';
import { Heart, Instagram, MessageCircle, Mail, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#172B32] text-white pt-14 sm:pt-18 pb-10 border-t-4 border-[#0EADAD] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Tagline (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/star-yellow.png"
                alt="Pulangkesinii Star"
                className="w-10 h-10 object-contain drop-shadow-xs"
              />
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                pulangkesinii
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium max-w-sm">
              <strong className="text-[#FFE066]">“Setiap Kebaikan Selalu Punya Tempat Pulang”</strong><br />
              Ruang pengabdian, relasi, kreativitas, dan tempat pulang bagi siapa pun yang ingin bertumbuh melalui kebaikan.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-white/70">
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00B4EB]" />
                <span>Basecamp Jakarta Timur</span>
              </span>
              <span className="bg-[#0EADAD]/30 text-[#96D2D0] px-3 py-1 rounded-full border border-[#0EADAD]/40">
                #TemanPulangKamu
              </span>
            </div>
          </div>

          {/* Column 2: Navigasi (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#FFE066] uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li>
                <button onClick={() => onNavigateSection('hero')} className="hover:text-[#00B4EB] transition-colors cursor-pointer">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('kegiatan')} className="hover:text-[#00B4EB] transition-colors cursor-pointer">
                  Katalog Kegiatan Volunteer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('program')} className="hover:text-[#00B4EB] transition-colors cursor-pointer">
                  Program & Voluntrip
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('tentang-kami')} className="hover:text-[#00B4EB] transition-colors cursor-pointer">
                  Our Story & Profil
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('cerita')} className="hover:text-[#00B4EB] transition-colors cursor-pointer">
                  Cerita Relawan & Galeri
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('faq')} className="hover:text-[#00B4EB] transition-colors cursor-pointer">
                  Pertanyaan Umum (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('kolaborasi')} className="hover:text-[#00B4EB] transition-colors cursor-pointer">
                  Kemitraan & Kolaborasi
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Kanal Resmi & Kontak (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#FFE066] uppercase tracking-wider">
              Kanal Resmi & Media
            </h4>
            
            <div className="space-y-2 text-xs">
              <a
                href="https://instagram.com/pulangkesinii"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-colors text-white/90"
              >
                <Instagram className="w-4 h-4 text-[#FFB7B2]" />
                <span>Instagram: <strong>@pulangkesinii</strong> (21.2K)</span>
              </a>

              <a
                href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii,%20saya%20ingin%20bertanya%20seputar%20kegiatan."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-colors text-white/90"
              >
                <MessageCircle className="w-4 h-4 text-[#00B4EB]" />
                <span>WhatsApp: <strong>+62 857-7932-1681</strong></span>
              </a>

              <a
                href="mailto:pulangkesinii@gmail.com"
                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-colors text-white/90"
              >
                <Mail className="w-4 h-4 text-[#FFE066]" />
                <span>Email: <strong>pulangkesinii@gmail.com</strong></span>
              </a>
            </div>

            <div className="pt-1 flex items-center gap-3 text-xs text-white/60">
              <a href="https://tiktok.com/@pulangkesinii_" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok: @pulangkesinii_</a>
              <span>•</span>
              <a href="https://threads.net/@pulangkesinii" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Threads</a>
              <span>•</span>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 font-medium gap-3">
          <p>© {currentYear} Pulangkesinii. Seluruh hak dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
