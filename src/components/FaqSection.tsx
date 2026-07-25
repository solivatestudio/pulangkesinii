import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 bg-[#FAF9F5] border-t border-[#E2E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <span className="bg-[#FFF9DB] text-[#B45309] text-xs font-heading font-bold px-3 py-1 rounded-full border border-[#FFE066]">
            — FAQ & INFORMATION —
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2D3748] mt-2">
            Pertanyaan yang Sering Ditanyakan ❓
          </h2>
          <p className="text-sm text-[#4A5568] mt-1 font-medium">
            Masih ragu atau ada yang pengen kamu tanyakan seputar pendaftaran & kegiatan?
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border-2 transition-all overflow-hidden ${
                  isOpen
                    ? 'border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(78,205,196,1)]'
                    : 'border-[#E2E8F0] hover:border-[#4ECDC4]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg text-[#2D3748] focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E0F7FA] text-[#00838F] flex items-center justify-center shrink-0 font-bold text-sm">
                      ?
                    </span>
                    <span>{item.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#4ECDC4] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-[#4A5568] leading-relaxed border-t border-[#E2E8F0]/60 font-medium animate-fadeIn">
                    <p className="pt-3">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-8 text-center bg-[#F0FDF4] p-4 rounded-2xl border border-[#4ECDC4]/30 text-xs text-[#2D3748] font-semibold">
          Ada pertanyaan lain? Kirim DM ke Instagram <a href="https://instagram.com/pulangkesinii" target="_blank" rel="noopener noreferrer" className="text-[#00838F] underline font-bold">@pulangkesinii</a>, Mimin selalu siap nemenin kamu!
        </div>

      </div>
    </section>
  );
};
