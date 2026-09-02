import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Tag,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityCardProps {
  activity: ActivityItem;
  onSelectActivity: (activity: ActivityItem) => void;
  onQuickRegister?: (activity: ActivityItem) => void;
  featuredLayout?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onSelectActivity,
  onQuickRegister,
  featuredLayout = false,
}) => {
  const percentage = Math.min(100, Math.round((activity.quotaFilled / activity.quota) * 100));
  const remainingQuota = Math.max(0, activity.quota - activity.quotaFilled);

  const getStatusBadge = () => {
    switch (activity.status) {
      case 'closing_soon':
        return (
          <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs animate-pulse">
            <Flame className="w-3 h-3" />
            <span>Tutup 2 Hari Lagi</span>
          </span>
        );
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 bg-[#0EADAD] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3 text-[#FFE066]" />
            <span>Pendaftaran Dibuka</span>
          </span>
        );
      case 'full':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            <span>Kuota Penuh</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai Terlaksana</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Voluntrip':
        return 'bg-[#E0F4FD] text-[#00B4EB] border-[#00B4EB]/30';
      case 'Fun Activity':
        return 'bg-[#FFF9DB] text-[#B45309] border-[#FFE066]/60';
      case 'Social Care':
        return 'bg-[#FCE4EC] text-[#C2185B] border-[#FFB7B2]/60';
      case 'Lingkungan':
        return 'bg-[#E8F5E9] text-[#2E7D32] border-[#81C784]/60';
      case 'Pendidikan':
      default:
        return 'bg-[#E6F7F7] text-[#0EADAD] border-[#0EADAD]/30';
    }
  };

  return (
    <div
      onClick={() => onSelectActivity(activity)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] hover:border-[#0EADAD]/60 shadow-soft card-hover-lift cursor-pointer overflow-hidden flex flex-col justify-between transition-all"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-16/10 sm:aspect-16/9 bg-[#F8FBFB] overflow-hidden">
          <img
            src={activity.coverImage}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Top Status & Category Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${getCategoryColor(activity.category)}`}>
              {activity.category}
            </span>
            {getStatusBadge()}
          </div>

          {/* Bottom City & Price Chip */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
            <div className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00B4EB]" />
              <span>{activity.city}</span>
            </div>

            <div className="bg-[#FFE066] text-[#172B32] font-heading font-extrabold text-xs px-3 py-1 rounded-full shadow-2xs border border-[#172B32]/10">
              {activity.priceLabel}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Batch info & Title */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0EADAD] mb-1">
              <span>Batch #{activity.batchNumber}</span>
              <span>•</span>
              <span className="text-[#647A80] font-medium">{activity.locationName}</span>
            </div>

            <h3 className="font-heading font-bold text-base sm:text-lg text-[#172B32] leading-snug group-hover:text-[#0EADAD] transition-colors line-clamp-2">
              {activity.title}
            </h3>
          </div>

          <p className="text-xs text-[#647A80] leading-relaxed line-clamp-2">
            {activity.shortDescription}
          </p>

          {/* Dates & Deadline Metadata */}
          <div className="space-y-1.5 pt-1 text-xs text-[#647A80]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#0EADAD] shrink-0" />
              <span className="font-medium text-[#172B32]">{activity.startDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#00B4EB] shrink-0" />
              <span>Deadline: <strong className="text-[#172B32]">{activity.registrationDeadline}</strong></span>
            </div>
          </div>

          {/* Quota Progress Bar (if not completed) */}
          {activity.status !== 'completed' && (
            <div className="pt-2 space-y-1.5 border-t border-[#E2E8F0]/60">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-[#647A80] flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#0EADAD]" />
                  <span>Sisa Kuota:</span>
                </span>
                <span className="font-bold text-[#172B32]">
                  {remainingQuota > 0 ? `${remainingQuota} slot tersisa` : 'Penuh'}
                </span>
              </div>

              <div className="w-full h-2 bg-[#F8FBFB] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage >= 85 ? 'bg-red-500' : 'bg-gradient-to-r from-[#00B4EB] to-[#0EADAD]'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Card Footer Button */}
      <div className="p-4 sm:p-5 pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectActivity(activity);
          }}
          className="w-full bg-[#F8FBFB] group-hover:bg-[#0EADAD] text-[#172B32] group-hover:text-white font-heading font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-[#E2E8F0] group-hover:border-[#0EADAD] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{activity.status === 'completed' ? 'Lihat Dokumentasi Kegiatan' : 'Lihat Detail & Daftar'}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
