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
  shortDescription?: string;
  color?: string;
  status?: string;
  urgentClosing?: boolean;
}

const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const humanizeDate = (value?: string): string | undefined => {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
  }
  return value;
};

const daysUntil = (value?: string): number | null => {
  const target = parseDate(value);
  if (!target) return null;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((target.getTime() - today) / 86400000);
};

export const PublicActivityCard: React.FC<{
  item: PublicActivityCardItem;
  compact?: boolean;
  onOpen?: (item: PublicActivityCardItem) => void;
}> = ({ item, compact = false, onOpen }) => {
  const isMeaningful = (val?: string) => Boolean(val && !val.trim().startsWith('[') && !val.trim().endsWith(']'));
  const isDummy = !isMeaningful(item.title);
  const displayTitle = item.title || '[Judul Kegiatan]';
  const displayDate = humanizeDate(item.startDate) || '[Tanggal Pelaksanaan]';
  const displayPrice = item.priceLabel || '[Biaya/Gratis]';
  const description = isMeaningful(item.shortDescription) ? item.shortDescription : undefined;

  const remaining = daysUntil(item.startDate);
  const badgeText = isDummy
    ? 'Segera Hadir'
    : item.urgentClosing
      ? 'Segera Ditutup'
      : remaining === null
        ? undefined
        : remaining <= 0
          ? 'Hari Ini'
          : `${remaining} Hari Lagi`;

  return (
    <article
      className={`group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-200 ${
        onOpen ? 'cursor-pointer hover:shadow-md' : ''
      } ${compact ? 'w-[280px] shrink-0 snap-start sm:w-full' : 'w-full'}`}
    >
      {onOpen && (
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`Lihat detail ${displayTitle}`}
          onClick={() => onOpen(item)}
        />
      )}

      <div className="relative">
        <img
          className="aspect-video w-full object-cover"
          src={item.photo || '/images/web/activity-04.webp'}
          alt={`Dokumentasi kegiatan ${item.category} Pulangkesinii`}
          loading="lazy"
        />

        {badgeText && (
          <div className="absolute left-2 top-2 rounded-md bg-[#FED3D1]/90 px-3 py-1 text-xs font-semibold text-[#C9382B]">
            {badgeText}
          </div>
        )}

        <div className="absolute bottom-0 flex w-full items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-2">
          <span className="flex h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
            <img className="h-full w-full object-cover" src="/assets/logo-palette.png" alt={`Logo ${item.category}`} />
          </span>
          <span className="text-sm font-semibold text-white">{item.category}</span>
        </div>
      </div>

      <div className="p-3">
        <div className="line-clamp-2 text-sm font-semibold leading-6 text-[#2B2B2B]">{displayTitle}</div>
        {description && (
          <div className="mt-1.5 line-clamp-1 text-xs font-normal leading-4 text-[#9B9B9B]">{description}</div>
        )}
        <div className="mt-1.5 flex w-full items-center gap-2 text-xs font-normal leading-4 text-[#20252B]">
          <CalendarDays size={12} color="#FF7614" aria-hidden="true" />
          <span className="truncate">{displayDate}</span>
        </div>
        <div className="mt-1.5 flex w-full items-center gap-2 text-xs font-normal leading-4 text-[#20252B]">
          <Tag size={12} color="#37499D" aria-hidden="true" />
          <span className="font-semibold text-[#20252B]">{displayPrice}</span>
        </div>
      </div>
    </article>
  );
};
