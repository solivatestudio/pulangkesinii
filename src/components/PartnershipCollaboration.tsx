import React from 'react';
import { Handshake, MessageSquare, Mail, Building, GraduationCap, Users, Sparkles } from 'lucide-react';

export const PartnershipCollaboration: React.FC = () => {
  return (
    <section id="kolaborasi" className="py-14 sm:py-20 bg-gradient-to-b from-white to-[#E6F7F7]/40 border-b border-[#E2E8F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-[#0EADAD]/30 shadow-soft p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-[#E6F7F7] text-[#0EADAD] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#0EADAD]/20">
                <Handshake className="w-3.5 h-3.5" />
                <span>KEMITRAAN & KOLABORASI</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32] leading-tight">
                Mari Ciptakan Dampak yang Lebih Luas 🤝
              </h2>

              <p className="text-xs sm:text-base text-[#647A80] leading-relaxed font-medium">
                Pulangkesinii terbuka untuk berkolaborasi dengan perusahaan, organisasi, institusi pendidikan, media, dan komunitas dalam menghadirkan program sosial yang kreatif, edukatif, dan berkelanjutan.
              </p>

              {/* 3 Pillars of Collaboration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#F8FBFB] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-1">
                  <Building className="w-5 h-5 text-[#0EADAD]" />
                  <p className="font-heading font-bold text-xs text-[#172B32]">Corporate & CSR</p>
                  <p className="text-[11px] text-[#647A80]">Employee volunteer & program berdampak.</p>
                </div>

                <div className="bg-[#F8FBFB] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-1">
                  <GraduationCap className="w-5 h-5 text-[#00B4EB]" />
                  <p className="font-heading font-bold text-xs text-[#172B32]">Kampus & Sekolah</p>
                  <p className="text-[11px] text-[#647A80]">Aktivasi pengabdian masyarakat & BEM.</p>
                </div>

                <div className="bg-[#F8FBFB] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-1">
                  <Users className="w-5 h-5 text-[#B45309]" />
                  <p className="font-heading font-bold text-xs text-[#172B32]">Media & Komunitas</p>
                  <p className="text-[11px] text-[#647A80]">Media partner & co-creation event.</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://wa.me/6285779321681?text=Halo%20Tim%20Pulangkesinii,%20kami%20dari%20[Nama%20Instansi/Perusahaan]%20ingin%20mengajak%20berkolaborasi%20program%20sosial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-teal-glow active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ajak Kami Berkolaborasi</span>
                </a>

                <a
                  href="mailto:pulangkesinii@gmail.com?subject=Inquiry%20Kolaborasi%20Pulangkesinii"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F8FBFB] text-[#172B32] font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#CBD5E0] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#0EADAD]" />
                  <span>Email Kemitraan</span>
                </a>
              </div>

            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                <div className="rounded-3xl overflow-hidden aspect-4/3 border border-[#E2E8F0] shadow-soft">
                  <img
                    src="/assets/decor-4.png"
                    alt="Kolaborasi Kebaikan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#FFE066] p-3 rounded-2xl border border-[#172B32]/10 shadow-md">
                  <p className="font-heading font-bold text-xs text-[#172B32]">
                    🤝 Terbuka untuk Sinergi
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
