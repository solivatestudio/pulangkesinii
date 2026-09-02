import React from 'react';
import { Sparkles, ArrowRight, MessageSquare, Heart } from 'lucide-react';

interface FinalCtaProps {
  onExploreClick: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onExploreClick }) => {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-[#0EADAD] via-[#00B4EB] to-[#108080] text-white relative overflow-hidden">
      
      {/* Background Subtle Star Accents */}
      <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
        <img src="/assets/star-yellow.png" alt="Star" className="w-64 h-64 object-contain" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-white text-xs font-heading font-bold px-4 py-1.5 rounded-full border border-white/30 shadow-2xs">
          <Heart className="w-3.5 h-3.5 fill-[#FFE066] text-[#FFE066]" />
          <span>#TEMANPULANGKAMU</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white leading-tight tracking-tight">
          Sudah Siap Menemukan Tempat Pulangmu? 🏡
        </h2>

        <p className="text-sm sm:text-lg text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">
          Pilih kegiatan, bertemu orang-orang baik, dan mulai perjalanan kebaikanmu bersama komunitas Pulangkesinii.
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto bg-[#FFE066] hover:bg-[#FFD166] text-[#172B32] font-heading font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#172B32]" />
            <span>Cari Kegiatan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii,%20saya%20ingin%20bergabung%20dengan%20kegiatan%20volunteer."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl border border-white/40 backdrop-blur-xs transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hubungi Kami</span>
          </a>
        </div>

      </div>
    </section>
  );
};
