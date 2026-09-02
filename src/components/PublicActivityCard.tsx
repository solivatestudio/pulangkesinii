import React from 'react';
import { CalendarDays, Tag } from 'lucide-react';

export interface PublicActivityCardItem {
  id: string | number; category: string; city: string; photo: string; title?: string;
  startDate?: string; priceLabel?: string; color?: string;
}

export const PublicActivityCard: React.FC<{ item: PublicActivityCardItem; compact?: boolean; onOpen?: (item: PublicActivityCardItem) => void }> = ({ item, compact = false, onOpen }) => (
  <article className={`activity-card ${compact ? 'compact-card' : ''}`}>
    {onOpen && <button className="card-link" aria-label={`Lihat detail ${item.title || item.category}`} onClick={() => onOpen(item)} />}
    <div className={`activity-cover cover-${item.color || 'cyan'} photo-cover`}>
      <img src={item.photo} alt={`Dokumentasi kegiatan ${item.category} Pulangkesinii`} loading="lazy" />
      <span className="placeholder-label">Slot terbatas tanpa seleksi</span>
      <div className="cover-copy"><small>{item.category} · {item.city}</small><strong>Jadwal berikutnya<br />segera hadir</strong></div>
    </div>
    <div className="activity-info">
      <h3>{item.title || '[Judul Kegiatan]'}</h3>
      <div className="activity-meta"><span><CalendarDays /> {item.startDate || '[Tanggal Pelaksanaan]'}</span><span><Tag /> {item.priceLabel || '[Biaya/Gratis]'}</span></div>
    </div>
  </article>
);
