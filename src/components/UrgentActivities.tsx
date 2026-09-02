import React from 'react';
import { Flame, Clock, ArrowRight, Sparkles, MapPin, Calendar, Users } from 'lucide-react';
import { ActivityItem } from '../types';

interface UrgentActivitiesProps {
  urgentActivities: ActivityItem[];
  onSelectActivity: (activity: ActivityItem) => void;
  onQuickRegister: (activity: ActivityItem) => void;
}

export const UrgentActivities: React.FC<UrgentActivitiesProps> = ({
  urgentActivities,
  onSelectActivity,
  onQuickRegister,
}) => {
  if (!urgentActivities || urgentActivities.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-[#F8FBFB] to-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-heading font-bold px-3 py-1 rounded-full border border-red-200 mb-2">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
              <span>SEGERA DITUTUP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#172B32]">
              Jangan Sampai Ketinggalan 🔥
            </h2>
            <p className="text-xs sm:text-sm text-[#647A80] mt-1 font-medium">
              Pendaftaran kegiatan ini segera ditutup. Ambil bagian dalam perjalanan kebaikan berikutnya!
            </p>
          </div>
        </div>

        {/* Urgent Activities Highlight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {urgentActivities.map((act) => {
            const percentage = Math.round((act.quotaFilled / act.quota) * 100);
            const remaining = act.quota - act.quotaFilled;

            return (
              <div
                key={act.id}
                className="lg:col-span-12 bg-white rounded-3xl border-2 border-red-200/80 shadow-soft overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 hover:border-red-400 transition-all card-hover-lift"
              >
                {/* Left Image Cover */}
                <div className="md:col-span-5 relative aspect-16/10 md:aspect-auto bg-[#F8FBFB] overflow-hidden">
                  <img
                    src={act.coverImage}
                    alt={act.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-heading font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tutup 2 Hari Lagi!</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {act.city} • {act.category}
                  </div>
                </div>

                {/* Right Details Panel */}
                <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#E6F7F7] text-[#0EADAD] text-xs font-bold px-2.5 py-0.5 rounded-lg border border-[#0EADAD]/20">
                        Batch #{act.batchNumber} Official
                      </span>
                      <span className="text-[#0EADAD] font-heading font-extrabold text-sm sm:text-base bg-[#FFE066] px-3 py-1 rounded-full text-[#172B32]">
                        {act.priceLabel}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#172B32] leading-tight">
                      {act.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#647A80] leading-relaxed">
                      {act.shortDescription}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#172B32] font-semibold pt-1">
                      <div className="flex items-center gap-2 bg-[#F8FBFB] p-2.5 rounded-xl border border-[#E2E8F0]">
                        <Calendar className="w-4 h-4 text-[#0EADAD]" />
                        <span>{act.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#F8FBFB] p-2.5 rounded-xl border border-[#E2E8F0]">
                        <MapPin className="w-4 h-4 text-[#00B4EB]" />
                        <span>{act.locationName}</span>
                      </div>
                    </div>

                    {/* Quota Progress */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#647A80]">Sisa Kuota Pendaftar</span>
                        <span className="text-red-500 font-extrabold">{remaining} Slot Tersisa ({percentage}% Terisi)</span>
                      </div>
                      <div className="w-full h-3 bg-[#F8FBFB] rounded-full overflow-hidden border border-[#E2E8F0]">
                        <div
                          className="h-full bg-gradient-to-r from-[#FFE066] to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => onQuickRegister(act)}
                      className="w-full sm:flex-1 bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-teal-glow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#FFE066]" />
                      <span>Daftar Sekarang (2 Menit)</span>
                    </button>

                    <button
                      onClick={() => onSelectActivity(act)}
                      className="w-full sm:w-auto bg-[#F8FBFB] hover:bg-[#E6F7F7] text-[#172B32] font-semibold text-xs sm:text-sm py-3 px-5 rounded-xl border border-[#CBD5E0] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Lihat Rundown & Syarat</span>
                      <ArrowRight className="w-4 h-4 text-[#0EADAD]" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
