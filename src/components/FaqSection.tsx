import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="faq" className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#E6F7F7] text-[#0EADAD] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#0EADAD]/30 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PUSAT INFORMASI & FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32]">
            Pertanyaan yang Sering Ditanyakan ❓
          </h2>
          <p className="text-xs sm:text-sm text-[#647A80] mt-2 font-medium">
            Temukan jawaban cepat seputar pendaftaran, ketentuan kegiatan, sertifikat, dan relasi.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Semua Pertanyaan' },
            { id: 'pendaftaran', label: 'Pendaftaran' },
            { id: 'kegiatan', label: 'Kegiatan & Sertifikat' },
            { id: 'partner', label: 'Kolaborasi' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0EADAD] text-white shadow-2xs font-bold'
                  : 'bg-[#F8FBFB] text-[#647A80] hover:bg-[#E6F7F7] hover:text-[#0EADAD] border border-[#E2E8F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-[#0EADAD] bg-[#F8FBFB] shadow-2xs'
                    : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E0]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-xs sm:text-sm text-[#172B32] focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E6F7F7] text-[#0EADAD] flex items-center justify-center shrink-0 font-bold text-xs">
                      ?
                    </span>
                    <span>{item.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0EADAD] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#647A80] leading-relaxed border-t border-[#E2E8F0]/60 font-medium animate-fadeIn">
                    <p className="pt-3">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-8 text-center bg-[#E6F7F7] p-4 rounded-2xl border border-[#0EADAD]/30 text-xs text-[#172B32] font-semibold flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Punya pertanyaan lain yang belum terjawab?</span>
          <a
            href="https://wa.me/6285779321681?text=Halo%20Admin%20Pulangkesinii,%20saya%20ada%20pertanyaan%20seputar%20kegiatan."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0EADAD] underline font-bold inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat Admin WhatsApp Kami</span>
          </a>
        </div>

      </div>
    </section>
  );
};
