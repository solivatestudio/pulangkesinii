import React from 'react';
import { Heart, Instagram, MessageCircle, Star, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenRecruitment: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRecruitment }) => {
  return (
    <footer className="bg-[#2D3748] text-white pt-16 pb-12 border-t-4 border-[#4ECDC4] relative overflow-hidden">
      
      {/* Decorative Washi Tape Decor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFE066] text-[#2D3748] rounded-2xl flex items-center justify-center font-heading font-extrabold text-xl shadow-xs">
                P
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                pulangkesinii
              </span>
            </div>

            <p className="text-sm text-white/80 leading-relaxed font-medium max-w-md">
              ❤️🩹 <span className="italic">"Pulang bukan sekedar tempat, tapi ketujuan."</span><br />
              Ruang pengabdian, relasi & kreativitas bagi anak muda. Mari menebar senyum dan menemukan rumah dalam kebaikan.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="bg-[#FFE066] text-[#2D3748] font-heading font-bold text-xs px-3 py-1 rounded-full">
                #TemanPulangKamu
              </span>
              <span className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded-full">
                38+ Batch Selesai
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-base text-[#FFE066]">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-white/80">
              <li><a href="#hero" className="hover:text-[#4ECDC4] transition-colors">Beranda</a></li>
              <li><a href="#recruitment" className="hover:text-[#4ECDC4] transition-colors">Volunteer Batch 39 (Open)</a></li>
              <li><a href="#programs" className="hover:text-[#4ECDC4] transition-colors">Program Activity</a></li>
              <li><a href="#memory-wall" className="hover:text-[#4ECDC4] transition-colors">Memory Wall Scrapbook</a></li>
              <li><a href="#stories" className="hover:text-[#4ECDC4] transition-colors">Pulang Bercerita (Diary)</a></li>
              <li><a href="#faq" className="hover:text-[#4ECDC4] transition-colors">FAQ & Tanya Jawab</a></li>
            </ul>
          </div>

          {/* Socials & Recruitment Callout */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading font-bold text-base text-[#FFE066]">
              Mari Berjejaring
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com/pulangkesinii"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold p-3 rounded-2xl transition-all"
              >
                <Instagram className="w-4 h-4 text-[#FFE066]" />
                <span>Instagram @pulangkesinii (21.2K)</span>
              </a>

              <a
                href="https://whatsapp.com/channel/0029Vb7x44LFXUuSeqigEW0B"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold p-3 rounded-2xl transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#4ECDC4]" />
                <span>WhatsApp Broadcast Channel</span>
              </a>
            </div>

            <button
              onClick={onOpenRecruitment}
              className="w-full bg-[#4ECDC4] hover:bg-[#3AAFA9] text-white font-heading font-bold text-xs py-3 px-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Daftar Volunteer Batch 39</span>
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 font-medium gap-3">
          <p>© 2026 Komunitas Pulangkesinii. Made with ❤️ for #TemanPulangKamu.</p>
          <p className="flex items-center gap-1">
            <span>Tempat Pulang • Volunteer • Fun Activity</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
