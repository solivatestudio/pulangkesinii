import React from 'react';
import { Layers, Users, HeartHandshake, MapPin } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      id: 'batches',
      number: '38+',
      label: 'Batch Volunteer Completed',
      subtext: 'Generasi kebaikan & relasi hangat',
      icon: Layers,
      bgColor: 'bg-[#E0F7FA]',
      borderColor: 'border-[#4ECDC4]',
      textColor: 'text-[#00838F]',
      sticker: 'Generasi 38 ⭐'
    },
    {
      id: 'volunteers',
      number: '2,100+',
      label: 'Teman Pulang Joined',
      subtext: 'Pelajar, mahasiswa, & first-jobber',
      icon: Users,
      bgColor: 'bg-[#FFF9DB]',
      borderColor: 'border-[#FFE066]',
      textColor: 'text-[#B45309]',
      sticker: 'Relasi Baru 🤝'
    },
    {
      id: 'activities',
      number: '45+',
      label: 'Aksi Sosial & Fun Event',
      subtext: 'Mengajar, sapa panti, green & art',
      icon: HeartHandshake,
      bgColor: 'bg-[#FCE4EC]',
      borderColor: 'border-[#FFB7B2]',
      textColor: 'text-[#C2185B]',
      sticker: 'Penuh Senyum ❤️'
    },
    {
      id: 'locations',
      number: '15+',
      label: 'Titik Lokasi Impact',
      subtext: 'Jabodetabek & area hybrid',
      icon: MapPin,
      bgColor: 'bg-[#E8F5E9]',
      borderColor: 'border-[#81C784]',
      textColor: 'text-[#2E7D32]',
      sticker: 'Rumah Kebaikan 📍'
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-[#4ECDC4] uppercase">
            — Dampak Kebersamaan Kita —
          </p>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#2D3748] mt-1">
            Jejak Hangat #TemanPulangKamu 💌
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`relative p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl ${item.bgColor} border-2 ${item.borderColor} shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 group`}
              >
                {/* Sticker Badge */}
                <div className="absolute -top-2.5 right-2 sm:right-4 bg-white text-[#2D3748] text-[9px] sm:text-[11px] font-heading font-bold px-2 sm:px-2.5 py-0.5 rounded-full border border-[#2D3748]/15 shadow-2xs truncate max-w-[85%]">
                  {item.sticker}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-1 sm:mt-0">
                  <div className="p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-2xs border border-[#2D3748]/10 group-hover:scale-110 transition-transform">
                    <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${item.textColor}`} />
                  </div>
                  <div>
                    <span className={`text-2xl sm:text-4xl font-heading font-extrabold ${item.textColor}`}>
                      {item.number}
                    </span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-xs sm:text-base text-[#2D3748] leading-tight">
                  {item.label}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#718096] mt-0.5 sm:mt-1 font-medium hidden xs:block sm:block">
                  {item.subtext}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
