import React from 'react';
import { Calendar, MapPin, Sparkles, CheckCircle2, Clock, Users, ArrowRight, Shield } from 'lucide-react';
import { VolunteerBatch } from '../types';

interface OpenRecruitmentPassProps {
  batch: VolunteerBatch;
  onOpenRecruitment: () => void;
}

export const OpenRecruitmentPass: React.FC<OpenRecruitmentPassProps> = ({
  batch,
  onOpenRecruitment,
}) => {
  const percentage = Math.round((batch.quotaFilled / batch.quotaMax) * 100);

  return (
    <section id="recruitment" className="py-16 bg-[#FAF9F5] relative overflow-hidden">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#FFE066] text-[#2D3748] text-xs font-heading font-bold px-3 py-1 rounded-full border border-[#2D3748]/15 shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2D3748]" />
            <span>OPEN RECRUITMENT ACTIVE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2D3748]">
            Siap Jadi Volunteer Selanjutnya? 🌟
          </h2>
          <p className="text-base text-[#4A5568] mt-2 font-medium">
            Bergabunglah dengan ratusan anak muda lainnya di <span className="font-bold text-[#4ECDC4]">Volunteer Batch 39</span>. Tempat mengabdi, belajar hal baru, dan bikin teman seumur hidup.
          </p>
        </div>

        {/* Ticket Pass Scrapbook Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border-2 border-[#2D3748]/15 shadow-[4px_4px_0px_0px_rgba(78,205,196,0.3)] sm:shadow-[8px_8px_0px_0px_rgba(78,205,196,0.3)] overflow-hidden relative">
          
          {/* Top Ticket Strip */}
          <div className="bg-gradient-to-r from-[#4ECDC4] via-[#56C5B6] to-[#00B4D8] p-3.5 sm:p-4 text-white flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 border-b-2 border-dashed border-white/40">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="bg-[#FFE066] text-[#2D3748] font-heading font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-2xs">
                BATCH {batch.batchNumber} PASS
              </span>
              <span className="font-heading font-bold text-xs sm:text-base text-white">
                #TemanPulangKamu Ticket
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-[#FFE066] shrink-0" />
              <span>Penutupan: 5 Hari Lagi!</span>
            </div>
          </div>

          {/* Ticket Main Body */}
          <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#2D3748]">
                  {batch.title}
                </h3>
                <p className="text-sm font-semibold text-[#00838F] mt-1">
                  {batch.subtitle}
                </p>
              </div>

              <p className="text-sm text-[#4A5568] leading-relaxed">
                {batch.description}
              </p>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-[#2D3748]">
                <div className="flex items-center gap-2.5 bg-[#FAF9F5] p-3 rounded-2xl border border-[#E2E8F0]">
                  <Calendar className="w-4 h-4 text-[#4ECDC4]" />
                  <span>{batch.startDate} – {batch.endDate}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FAF9F5] p-3 rounded-2xl border border-[#E2E8F0]">
                  <MapPin className="w-4 h-4 text-[#FFB7B2]" />
                  <span>{batch.location}</span>
                </div>
              </div>

              {/* Division Choices */}
              <div>
                <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                  Divisi Terbuka untuk Kamu:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#E0F7FA] text-[#00838F] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#00838F]/10">
                    🎪 Acara & Mentoring
                  </span>
                  <span className="bg-[#FFF9DB] text-[#B45309] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#B45309]/10">
                    📢 Humas & Outreach
                  </span>
                  <span className="bg-[#FCE4EC] text-[#C2185B] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#C2185B]/10">
                    🎨 Media & Kreatif
                  </span>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#2E7D32]/10">
                    📦 Logistik & Perlengkapan
                  </span>
                </div>
              </div>

              {/* Highlights Checklist */}
              <div className="space-y-1.5 pt-1">
                {batch.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#2D3748] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#4ECDC4] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Quota & Action Column */}
            <div className="md:col-span-5 bg-[#F0FDF4]/70 p-6 rounded-2xl border-2 border-[#4ECDC4]/30 space-y-6 text-center">
              
              {/* Quota Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#2D3748]">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#4ECDC4]" />
                    <span>Sisa Kuota Batch 39</span>
                  </span>
                  <span className="text-[#00838F]">{batch.quotaFilled} / {batch.quotaMax} Slot</span>
                </div>

                <div className="w-full h-3.5 bg-white rounded-full p-0.5 border border-[#4ECDC4]/40 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FFE066] to-[#4ECDC4] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#718096] font-semibold">
                  🔥 Hampir penuh! Tinggal <span className="text-[#C2185B] font-bold">{batch.quotaMax - batch.quotaFilled} slot tersisa</span>.
                </p>
              </div>

              {/* Guarantees */}
              <div className="bg-white p-3 rounded-xl border border-[#2D3748]/10 text-left text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#2D3748] font-semibold">
                  <Shield className="w-3.5 h-3.5 text-[#4ECDC4]" />
                  <span>100% Ramah First Timer</span>
                </div>
                <p className="text-[11px] text-[#718096]">
                  Gak perlu pengalaman volunteer sebelumnya! Ada sesi pembekalan & mentor ramah yang siap nemenin kamu.
                </p>
              </div>

              {/* Big CTA */}
              <button
                onClick={onOpenRecruitment}
                className="w-full bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-bold text-base py-3.5 px-6 rounded-2xl border-2 border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#2D3748]" />
                <span>Isi Form Pendaftaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-[#718096]">
                Proses kilat 2 menit • Dapatkan ID Card Pass Instant!
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
