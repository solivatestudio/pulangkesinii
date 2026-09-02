import React, { useState } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';

interface MascotWidgetProps {
  onOpenActivities: () => void;
}

export const MascotWidget: React.FC<MascotWidgetProps> = ({ onOpenActivities }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const mascotQuotes = [
    '“Setiap Kebaikan Selalu Punya Tempat Pulang! ❤️”',
    '“Udah siap bikin kenangan hangat baru di Batch 39?” 🌟',
    '“First-timer volunteer? Tenang, Mimin rangkul dari awal!” 🤝',
    '“Satu senyummu bisa bikin hari orang lain lebih cerah!” ✨'
  ];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % mascotQuotes.length);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Speech Bubble Dialog */}
      {isOpen && (
        <div className="bg-white p-4 rounded-3xl border border-[#0EADAD]/40 shadow-lg max-w-xs mb-3 animate-fadeIn relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-[#647A80] hover:text-[#172B32] cursor-pointer p-1"
            aria-label="Tutup sapaan"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            <img
              src="/assets/star-yellow.png"
              alt="Bintang Pulang Mascot"
              className="w-9 h-9 object-contain shrink-0 animate-bounce"
            />
            <div className="space-y-2">
              <div>
                <p className="font-heading font-bold text-xs text-[#0EADAD]">
                  Bintang Pulang ⭐
                </p>
                <p
                  onClick={handleNextQuote}
                  className="text-xs text-[#172B32] font-medium leading-relaxed mt-0.5 cursor-pointer hover:text-[#0EADAD] transition-colors"
                  title="Klik untuk ganti pesan"
                >
                  {mascotQuotes[quoteIndex]}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onOpenActivities}
                  className="bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#FFE066]" />
                  <span>Cari Kegiatan</span>
                </button>

                <button
                  onClick={handleNextQuote}
                  className="text-[10px] text-[#647A80] hover:underline font-semibold cursor-pointer"
                >
                  Pesan Lain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Star Mascot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-white hover:bg-[#E6F7F7] w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#0EADAD] shadow-md flex items-center justify-center p-2 transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title="Sapa Bintang Pulang"
        aria-label="Sapa Bintang Pulang"
      >
        <img
          src="/assets/star-yellow.png"
          alt="Mascot Icon"
          className="w-full h-full object-contain drop-shadow-2xs group-hover:rotate-12 transition-transform"
        />
        
        {/* Ping Notification */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B4EB] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00B4EB] border border-white"></span>
        </span>
      </button>

    </div>
  );
};
