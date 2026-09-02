import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  ShieldCheck, 
  MessageSquare,
  Gift,
  HelpCircle,
  AlertCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityDetailModalProps {
  activity: ActivityItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRegistration: (activity: ActivityItem) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
  onOpenRegistration,
}) => {
  const [activeTab, setActiveTab] = useState<'tentang' | 'rundown' | 'benefit' | 'syarat' | 'faq'>('tentang');
  const [copiedLink, setCopiedLink] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !activity) return null;

  const percentage = Math.min(100, Math.round((activity.quotaFilled / activity.quota) * 100));
  const remainingQuota = Math.max(0, activity.quota - activity.quotaFilled);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-[#172B32]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="bg-[#F8FBFB] px-4 sm:px-6 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#647A80] truncate">
            <span className="text-[#0EADAD] font-bold">Kegiatan #{activity.batchNumber}</span>
            <span>/</span>
            <span className="bg-[#E6F7F7] text-[#0EADAD] font-bold px-2 py-0.5 rounded-md text-[11px]">
              {activity.category}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline truncate">{activity.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#E6F7F7] text-[#172B32] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0EADAD]" />
              <span className="hidden xs:inline">{copiedLink ? 'Tersalin!' : 'Bagikan'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-white hover:bg-slate-100 text-[#172B32] rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Banner Cover Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-[#F8FBFB] border border-[#E2E8F0]">
                <img
                  src={activity.coverImage}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#FFE066] text-[#172B32] font-heading font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
                  Batch {activity.batchNumber} Official ⭐
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {activity.locationName} • {activity.city}
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#172B32] leading-tight">
                  {activity.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#0EADAD] font-bold mt-1">
                  #TemanPulangKamu • {activity.category} Care
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'tentang', label: 'Tentang' },
                  { id: 'rundown', label: 'Aktivitas & Rundown' },
                  { id: 'benefit', label: 'Benefit & Fasilitas' },
                  { id: 'syarat', label: 'Persyaratan & Bawaan' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#E6F7F7] text-[#0EADAD] font-bold border border-[#0EADAD]/30'
                        : 'text-[#647A80] hover:text-[#172B32] hover:bg-[#F8FBFB]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Tentang Kegiatan */}
              {activeTab === 'tentang' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="prose prose-sm text-[#172B32]">
                    <p className="text-sm leading-relaxed text-[#172B32] font-medium">
                      {activity.description}
                    </p>
                  </div>

                  {/* Highlight Box */}
                  <div className="bg-[#E6F7F7] p-4 rounded-2xl border border-[#0EADAD]/30 space-y-2">
                    <div className="flex items-center gap-2 font-heading font-bold text-xs text-[#0EADAD]">
                      <Sparkles className="w-4 h-4 text-[#0EADAD]" />
                      <span>Mengapa Kegiatan Ini Istimewa?</span>
                    </div>
                    <p className="text-xs text-[#172B32] leading-relaxed">
                      Kegiatan ini dirancang dengan pendekatan kekeluargaan dan ramah relawan pemula. Kamu bukan sekadar datang untuk menjalankan tugas, melainkan untuk saling mendengarkan, merangkul, dan pulang membawa pengalaman sosial yang berarti.
                    </p>
                  </div>

                  {/* Gallery Preview */}
                  {activity.gallery && activity.gallery.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-[#647A80] uppercase tracking-wider">
                        Dokumentasi Suasana:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {activity.gallery.map((imgUrl, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden aspect-4/3 bg-[#F8FBFB] border border-[#E2E8F0]">
                            <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Rundown */}
              {activeTab === 'rundown' && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-[#647A80]">
                    Jadwal perkiraan kegiatan di hari pelaksanaan:
                  </p>

                  <div className="space-y-2.5">
                    {activity.rundown.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F8FBFB] p-3.5 rounded-2xl border border-[#E2E8F0] flex items-start gap-3"
                      >
                        <div className="bg-[#0EADAD] text-white font-heading font-bold text-[11px] px-2.5 py-1 rounded-lg shrink-0">
                          {item.time}
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-[#172B32] pt-0.5">
                          {item.activity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#647A80] italic">
                    *Rundown final dan pembagian kelompok teknis akan dibagikan via grup WhatsApp batch H-2 acara.
                  </p>
                </div>
              )}

              {/* Tab 3: Benefits */}
              {activeTab === 'benefit' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activity.benefits.map((bnf, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F8FBFB] p-3.5 rounded-2xl border border-[#E2E8F0] flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0EADAD] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-[#172B32]">{bnf}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FFF9DB] p-4 rounded-2xl border border-[#FFE066] text-xs text-[#B45309] space-y-1">
                    <p className="font-bold">✨ E-Sertifikat Resmi Terverifikasi</p>
                    <p>Sertifikat dikirimkan maksimal H+2 setelah kegiatan selesai dan dapat diverifikasi langsung.</p>
                  </div>
                </div>
              )}

              {/* Tab 4: Requirements & Items to Bring */}
              {activeTab === 'syarat' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-sm text-[#172B32]">
                      Persyaratan Relawan
                    </h4>
                    <div className="space-y-2">
                      {activity.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#172B32]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0EADAD] shrink-0 mt-2"></span>
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                    <h4 className="font-heading font-bold text-sm text-[#172B32]">
                      Apa yang Perlu Dibawa?
                    </h4>
                    <div className="space-y-2">
                      {activity.itemsToBring.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#172B32]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00B4EB] shrink-0 mt-2"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Person Bar */}
              <div className="bg-[#F8FBFB] p-4 rounded-2xl border border-[#E2E8F0] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6F7F7] text-[#0EADAD] flex items-center justify-center font-heading font-bold text-sm">
                    💬
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs sm:text-sm text-[#172B32]">
                      {activity.contactPerson.name}
                    </p>
                    <p className="text-[11px] text-[#647A80]">
                      {activity.contactPerson.role}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${activity.contactPerson.whatsapp}?text=Halo%20Kak,%20saya%20ingin%20bertanya%20seputar%20${encodeURIComponent(activity.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-[#E6F7F7] text-[#0EADAD] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#0EADAD]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Right Sticky Registration Side Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-4 bg-[#F8FBFB] p-5 sm:p-6 rounded-3xl border-2 border-[#0EADAD]/30 shadow-soft space-y-5">
                
                {/* Price & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <p className="text-[11px] font-bold text-[#647A80] uppercase tracking-wider">Biaya Kontribusi</p>
                    <p className="font-heading font-extrabold text-2xl text-[#0EADAD]">
                      {activity.priceLabel}
                    </p>
                  </div>

                  <span className="bg-[#FFE066] text-[#172B32] font-heading font-bold text-xs px-3 py-1 rounded-full border border-[#172B32]/10">
                    Batch #{activity.batchNumber}
                  </span>
                </div>

                {/* Key Summary Details */}
                <div className="space-y-3 text-xs sm:text-sm text-[#172B32]">
                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0]">
                    <Calendar className="w-4 h-4 text-[#0EADAD] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#172B32]">Waktu Pelaksanaan</p>
                      <p className="text-[#647A80] text-xs mt-0.5">{activity.startDate} {activity.endDate !== activity.startDate ? `– ${activity.endDate}` : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0]">
                    <Clock className="w-4 h-4 text-[#00B4EB] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#172B32]">Batas Pendaftaran</p>
                      <p className="text-red-500 font-bold text-xs mt-0.5">{activity.registrationDeadline}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0]">
                    <MapPin className="w-4 h-4 text-[#FFB7B2] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#172B32]">Lokasi & Wilayah</p>
                      <p className="text-[#647A80] text-xs mt-0.5">{activity.locationName}, {activity.city}</p>
                    </div>
                  </div>
                </div>

                {/* Quota Meter */}
                {activity.status !== 'completed' && (
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#647A80]">Sisa Kuota Pendaftar</span>
                      <span className="text-[#0EADAD]">{remainingQuota} Slot Tersisa ({percentage}% Terisi)</span>
                    </div>

                    <div className="w-full h-2.5 bg-[#F8FBFB] rounded-full overflow-hidden border border-[#E2E8F0]">
                      <div
                        className="h-full bg-gradient-to-r from-[#00B4EB] to-[#0EADAD] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Big Action Button */}
                <div>
                  {activity.status === 'completed' ? (
                    <div className="bg-slate-100 text-[#647A80] text-center font-heading font-bold text-sm py-3.5 px-4 rounded-2xl">
                      Kegiatan Ini Telah Selesai
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenRegistration(activity)}
                      className="w-full bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-teal-glow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-[#FFE066]" />
                      <span>Daftar Sekarang (Gratis)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  
                  <p className="text-[11px] text-[#647A80] text-center mt-2 font-medium">
                    Proses 2 menit • Dapatkan ID Card Pass Digital Instan!
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
