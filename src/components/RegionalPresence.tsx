import React from 'react';
import { MapPin, Sparkles, Compass, Users } from 'lucide-react';
import { CITY_REGIONS } from '../data/mockData';

interface RegionalPresenceProps {
  onSelectCityFilter: (cityName: string) => void;
}

export const RegionalPresence: React.FC<RegionalPresenceProps> = ({ onSelectCityFilter }) => {
  return (
    <section className="py-14 sm:py-20 bg-[#F8FBFB] border-b border-[#E2E8F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#E6F7F7] text-[#0EADAD] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#0EADAD]/30 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>JANGKAUAN WILAYAH</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32]">
            Kebaikan Selalu Punya Tempat Pulang 📍
          </h2>
          <p className="text-xs sm:text-sm text-[#647A80] mt-2 font-medium">
            Saat ini, Pulangkesinii hadir melalui kegiatan dan tim relawan di berbagai kota di Indonesia.
          </p>
        </div>

        {/* 4 Regions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CITY_REGIONS.map((reg) => (
            <div
              key={reg.id}
              onClick={() => {
                const targetCity = reg.cityName.includes('Jabodetabek') ? 'Jakarta' : reg.cityName.split('&')[0].trim();
                onSelectCityFilter(targetCity);
              }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-soft card-hover-lift overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-[#F8FBFB] overflow-hidden">
                  <img
                    src={reg.coverImage}
                    alt={reg.cityName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#0EADAD] font-heading font-bold text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                    {reg.activeActivitiesCount} Kegiatan Aktif
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="font-heading font-bold text-lg text-[#172B32]">
                    {reg.cityName}
                  </h3>
                  <p className="text-xs text-[#647A80] leading-relaxed">
                    {reg.description}
                  </p>
                  
                  <div className="pt-2 flex flex-wrap gap-1">
                    {reg.popularLocations.map((loc, idx) => (
                      <span key={idx} className="bg-[#F8FBFB] text-[#647A80] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  className="w-full text-center text-xs font-bold text-[#0EADAD] hover:underline"
                >
                  Lihat Kegiatan di {reg.cityName} →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
