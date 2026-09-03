import React from 'react';
import { CalendarDays, Tag } from 'lucide-react';

export interface PublicActivityCardItem {
  id: string | number;
  category: string;
  city: string;
  photo: string;
  title?: string;
  startDate?: string;
  priceLabel?: string;
  color?: string;
  status?: string;
  urgentClosing?: boolean;
}

export const PublicActivityCard: React.FC<{ 
  item: PublicActivityCardItem; 
  compact?: boolean; 
  onOpen?: (item: PublicActivityCardItem) => void 
}> = ({ item, compact = false, onOpen }) => {
  const isMeaningful = (val?: string) => Boolean(val && !val.trim().startsWith('[') && !val.trim().endsWith(']'));
  const isDummy = !isMeaningful(item.title);
  const displayTitle = item.title || '[Judul Kegiatan]';
  const displayDate = item.startDate || '[Tanggal Pelaksanaan]';
  const displayPrice = item.priceLabel || '[Biaya/Gratis]';

  return (
    <article className={`activity-card ${compact ? 'compact-card' : ''}`}>
      {onOpen && (
        <button 
          className="card-link" 
          aria-label={`Lihat detail ${displayTitle}`} 
          onClick={() => onOpen(item)} 
        />
      )}
      <div className={`activity-cover cover-${item.color || 'cyan'} photo-cover`}>
        <img 
          src={item.photo || '/images/web/activity-04.webp'} 
          alt={`Dokumentasi kegiatan ${item.category} Pulangkesinii`} 
          loading="lazy" 
        />
        <span className="placeholder-label">
          {item.urgentClosing && !isDummy ? 'Segera Ditutup' : 'Slot terbatas tanpa seleksi'}
        </span>
        <div className="cover-copy">
          <small>{item.category} · {item.city}</small>
          {isDummy ? (
            <strong>Jadwal berikutnya<br />segera hadir</strong>
          ) : (
            <strong>{displayTitle}</strong>
          )}
        </div>
      </div>
      <div className="activity-info">
        <h3>{displayTitle}</h3>
        <div className="activity-meta">
          <span><CalendarDays /> {displayDate}</span>
          <span><Tag /> {displayPrice}</span>
        </div>
      </div>
    </article>
  );
};

