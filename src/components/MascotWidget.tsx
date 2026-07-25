import React, { useState } from 'react';
import { Sparkles, X, Heart, Star, Smile } from 'lucide-react';

interface MascotWidgetProps {
  onOpenRecruitment: () => void;
}

export const MascotWidget: React.FC<MascotWidgetProps> = ({ onOpenRecruitment }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const mascotQuotes = [
    '“Pulang itu bukan cuma tempat, tapi orang-orangnya!” ❤️',
    '“Udah siap bikin kenangan hangat baru di Batch 39?” 🌟',
    '“First-timer volunteer? Tenang, Mimin rangkul dari awal!” 🤝',
    '“Satu senyummu bisa bikin hari orang lain lebih cerah!” ✨'
  ];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % mascotQuotes.length);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Speech Bubble */}
      {isOpen && (
        <div className="bg-white p-4 rounded-3xl border-2 border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] max-w-xs mb-3 animate-fadeIn relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-[#718096] hover:text-[#2D3748] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-2.5">
            <span className="text-2xl animate-bounce">⭐</span>
            <div>
              <p className="font-heading font-bold text-xs text-[#2D3748]">
                Bintang Pulang
              </p>
              <p
                onClick={handleNextQuote}
                className="text-xs text-[#4A5568] mt-1 font-medium cursor-pointer hover:text-[#00838F] transition-colors"
                title="Klik untuk ubah quote"
              >
                {mascotQuotes[quoteIndex]}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={onOpenRecruitment}
                  className="bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-bold text-[11px] px-3 py-1.5 rounded-xl border border-[#2D3748] shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Daftar B39</span>
                </button>

                <button
                  onClick={handleNextQuote}
                  className="text-[10px] text-[#718096] hover:underline font-bold"
                >
                  Quote Lain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mascot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-[#FFE066] hover:bg-[#FFD166] w-14 h-14 rounded-full border-2 border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] flex items-center justify-center text-2xl transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title="Sapa Bintang Pulang"
      >
        <span>⭐</span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ECDC4] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#4ECDC4] border border-white"></span>
        </span>
      </button>

    </div>
  );
};
