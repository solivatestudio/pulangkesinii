import React from 'react';
import { Heart, Compass, Handshake, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ActivityCategory } from '../types';

interface ProgramPillarsProps {
  onSelectCategoryFilter: (category: ActivityCategory) => void;
  onOpenPartnership: () => void;
}

export const ProgramPillars: React.FC<ProgramPillarsProps> = ({
  onSelectCategoryFilter,
  onOpenPartnership,
}) => {
  const programs = [
    {
      id: 'prog-volunteer',
      title: 'Community Event Volunteer',
      badge: 'Kegiatan Sosial Tematik',
      category: 'Volunteer' as ActivityCategory,
      description: 'Kegiatan sosial tematik seperti berbagi di panti asuhan, panti werdha, sekolah inklusi, rumah singgah, hingga aksi peduli lingkungan di berbagai kota.',
      highlights: [
        'Aksi interaktif & edukasi adik binaan',
        'Sapa lansia & ruang dengar kasih',
        '100% ramah untuk relawan first-timer'
      ],
      coverImage: '/assets/decor-1.png',
      ctaText: 'Lihat Kegiatan Volunteer',
      action: 'filter_volunteer'
    },
    {
      id: 'prog-voluntrip',
      title: 'Community Event Voluntrip',
      badge: 'Relawan & Jelajah Alam',
      category: 'Voluntrip' as ActivityCategory,
      description: 'Program khas yang memadukan kegiatan pengabdian sosial dengan eksplorasi alam, workshop edukasi lingkungan, dan malam keakraban bersama teman baru.',
      highlights: [
        'Aksi tanam pohon & seed bomb workshop',
        'Acoustic circle & networking hangat',
        'Eksplorasi wisata edukasi lokal'
      ],
      coverImage: '/assets/decor-3.png',
      ctaText: 'Jelajahi Program Voluntrip',
      action: 'filter_voluntrip'
    },
    {
      id: 'prog-partnership',
      title: 'Partnership & Collaboration',
      badge: 'CSR & Sinergi Komunitas',
      category: 'Semua' as ActivityCategory,
      description: 'Kolaborasi bersama perusahaan, organisasi kampus, institusi pendidikan, media, dan komunitas dalam menciptakan program sosial yang berdampak lebih luas.',
      highlights: [
        'Employee volunteering & CSR program',
        'Aktivasi sosial kampus & organisasi',
        'Laporan dampak dan dokumentasi profesional'
      ],
      coverImage: '/assets/decor-4.png',
      ctaText: 'Ajak Kami Berkolaborasi',
      action: 'open_collab'
    }
  ];

  return (
    <section id="program" className="py-14 sm:py-20 bg-[#F8FBFB] border-b border-[#E2E8F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#E0F4FD] text-[#00B4EB] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#00B4EB]/30 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>PILAR PROGRAM PULANGKESINII</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32]">
            Ruang Bertumbuh & Berbagi Kebaikan 🏡
          </h2>
          <p className="text-xs sm:text-sm text-[#647A80] mt-2 font-medium">
            Tiga pilar utama yang menghadirkan aksi nyata, pengalaman bermakna, dan kolaborasi positif bagi generasi muda.
          </p>
        </div>

        {/* 3 Program Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-soft card-hover-lift overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-16/9 bg-[#F8FBFB] overflow-hidden">
                  <img
                    src={prog.coverImage}
                    alt={prog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#0EADAD] font-heading font-bold text-xs px-3 py-1 rounded-full border border-[#0EADAD]/20 shadow-2xs">
                    {prog.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#172B32]">
                    {prog.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#647A80] leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0]/60">
                    {prog.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#172B32] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0EADAD] shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    if (prog.action === 'open_collab') {
                      onOpenPartnership();
                    } else {
                      onSelectCategoryFilter(prog.category);
                    }
                  }}
                  className="w-full bg-[#E6F7F7] hover:bg-[#0EADAD] text-[#0EADAD] hover:text-white font-heading font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-[#0EADAD]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{prog.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
