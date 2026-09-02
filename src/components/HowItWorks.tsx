import React from 'react';
import { Compass, CheckSquare, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onExploreClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onExploreClick }) => {
  const steps = [
    {
      number: '01',
      title: 'Pilih Kegiatan',
      description: 'Temukan kegiatan volunteer atau voluntrip yang sesuai dengan minat, waktu, dan kota tempat tinggalmu.',
      icon: Compass,
      bgColor: 'bg-[#E6F7F7]',
      borderColor: 'border-[#0EADAD]/30',
      textColor: 'text-[#0EADAD]'
    },
    {
      number: '02',
      title: 'Lengkapi Pendaftaran',
      description: 'Baca detail kegiatan, lengkapi formulir pendaftaran singkat (2 menit), dan dapatkan ID Pass resmi pendaftaran.',
      icon: CheckSquare,
      bgColor: 'bg-[#E0F4FD]',
      borderColor: 'border-[#00B4EB]/30',
      textColor: 'text-[#00B4EB]'
    },
    {
      number: '03',
      title: 'Datang & Bertumbuh',
      description: 'Temui orang-orang baru, berbagi peran, menebar senyum, dan pulang membawa pengalaman sosial yang bermakna.',
      icon: HeartHandshake,
      bgColor: 'bg-[#FFF9DB]',
      borderColor: 'border-[#FFE066]/60',
      textColor: 'text-[#B45309]'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-[#E2E8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#E6F7F7] text-[#0EADAD] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#0EADAD]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ALUR MUDAH BERGABUNG</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32]">
            Tiga Langkah Menuju Cerita Baikmu 👣
          </h2>
          <p className="text-xs sm:text-sm text-[#647A80] mt-2 font-medium">
            Tidak perlu bingung harus mulai dari mana. Alur bergabung dibuat mudah, ramah, dan transparan.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className={`relative p-6 sm:p-8 rounded-3xl ${step.bgColor} border ${step.borderColor} shadow-soft card-hover-lift flex flex-col justify-between`}
              >
                {/* Step Number Stamp */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xs border border-[#E2E8F0]">
                    <IconComponent className={`w-6 h-6 ${step.textColor}`} />
                  </div>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#172B32]/30">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#172B32]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#647A80] leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                {idx === 0 && (
                  <div className="pt-4 mt-4 border-t border-[#0EADAD]/20">
                    <button
                      onClick={onExploreClick}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0EADAD] hover:underline cursor-pointer"
                    >
                      <span>Cari kegiatan aktif sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
