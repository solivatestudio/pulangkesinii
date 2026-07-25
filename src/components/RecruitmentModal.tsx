import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Copy, Download, Share2, Heart, Star, ArrowRight, ShieldCheck, User, MapPin, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VolunteerApplication } from '../types';

interface RecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationSuccess: (app: VolunteerApplication) => void;
  userPass: VolunteerApplication | null;
}

export const RecruitmentModal: React.FC<RecruitmentModalProps> = ({
  isOpen,
  onClose,
  onApplicationSuccess,
  userPass
}) => {
  const [step, setStep] = useState<number>(userPass ? 3 : 1);
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [domicile, setDomicile] = useState('Jakarta');
  const [age, setAge] = useState<number>(20);
  const [division, setDivision] = useState('Acara & Mentoring');
  const [motivation, setMotivation] = useState('');
  const [funFact, setFunFact] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⭐');
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen) return null;

  const handleAvatarSelect = (emoji: string) => {
    setSelectedAvatar(emoji);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ECDC4', '#FFE066', '#FFB7B2', '#80DEEA']
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nickname || !whatsapp) {
      alert('Mohon lengkapi Nama Lengkap, Panggilan, dan WhatsApp kamu ya!');
      return;
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newPass: VolunteerApplication = {
      id: `app-${Date.now()}`,
      passNumber: `PULANG-B39-${randomId}`,
      fullName,
      nickname,
      whatsapp,
      instagram: instagram.startsWith('@') ? instagram : `@${instagram || nickname}`,
      domicile,
      age: Number(age),
      division,
      motivation: motivation || 'Pengen menambah teman baru dan berbagi keceriaan bersama adik-adik.',
      funFact: funFact || 'Suka ngopi sore sambil dengar musik akustik.',
      selectedAvatar,
      batchNumber: 39,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'terdaftar'
    };

    onApplicationSuccess(newPass);
    setStep(3); // Go to ID Pass Result step
    triggerConfetti();
  };

  const copyPassCode = (passCode: string) => {
    navigator.clipboard.writeText(passCode);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const activePass = userPass || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#2D3748]/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF9F5] rounded-2xl sm:rounded-3xl border-2 border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] sm:shadow-[8px_8px_0px_0px_rgba(45,55,72,1)] overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="bg-[#4ECDC4] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b-2 border-[#2D3748] text-white shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FFE066] text-[#2D3748] rounded-lg sm:rounded-xl flex items-center justify-center font-heading font-bold text-xs sm:text-base shadow-2xs shrink-0">
              39
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Pendaftaran Volunteer Batch 39
              </h3>
              <p className="text-[10px] sm:text-xs text-white/90">
                #TemanPulangKamu • Kuota Terbatas!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
          
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
              <div className="bg-[#E0F7FA] p-3 rounded-2xl border border-[#00838F]/20 text-xs text-[#00838F] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-[#00838F]" />
                <span>Langkah 1 dari 2: Data Diri & Kontak</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Alya Rahmawati"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                    Nama Panggilan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Alya"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                    Username Instagram
                  </label>
                  <input
                    type="text"
                    placeholder="@alyarahma"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                    Domisili Saat Ini
                  </label>
                  <select
                    value={domicile}
                    onChange={(e) => setDomicile(e.target.value)}
                    className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition-colors"
                  >
                    <option value="Jakarta">Jakarta</option>
                    <option value="Depok">Depok</option>
                    <option value="Tangerang / Tangsel">Tangerang / Tangsel</option>
                    <option value="Bekasi">Bekasi</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Luar Jabodetabek (Hybrid/Online)">Luar Jabodetabek (Hybrid/Online)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                    Usia (Tahun)
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="40"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#4ECDC4] hover:bg-[#3AAFA9] text-white font-heading font-bold text-sm px-6 py-3 rounded-2xl border-2 border-[#2D3748] shadow-[3px_3px_0px_0px_rgba(45,55,72,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Lanjut Ke Divisi & Motivasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-[#FFF9DB] p-3 rounded-2xl border border-[#B45309]/20 text-xs text-[#B45309] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                  <span>Langkah 2 dari 2: Divisi & Kartu Identitas</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs underline font-bold"
                >
                  Kembali
                </button>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                  Pilih Divisi Pilihan Kamu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Acara & Mentoring', label: '🎪 Acara & Mentoring', desc: 'Merancang game, ice breaking & pendamping adik-adik' },
                    { id: 'Humas & Outreach', label: '📢 Humas & Outreach', desc: 'Komunikasi peserta, panti & relasi komunitas' },
                    { id: 'Media & Kreatif', label: '🎨 Media & Kreatif', desc: 'Dokumentasi foto/video, kover feed & desain' },
                    { id: 'Logistik & Perlengkapan', label: '📦 Logistik & Perlengkapan', desc: 'Persiapan alat, bingkisan & kelancaran acara' },
                  ].map((div) => (
                    <button
                      type="button"
                      key={div.id}
                      onClick={() => setDivision(div.id)}
                      className={`text-left p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        division === div.id
                          ? 'bg-[#E0F7FA] border-[#4ECDC4] shadow-xs'
                          : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E0]'
                      }`}
                    >
                      <p className="font-heading font-bold text-xs text-[#2D3748]">{div.label}</p>
                      <p className="text-[11px] text-[#718096] mt-0.5">{div.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                  Apa motivasimu pengen "pulang" & gabung di Batch 39?
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pengen ngisi akhir pekan dengan hal positif, nambah teman baru, dan berbagi kebahagiaan sama adik-adik."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full bg-white border-2 border-[#CBD5E0] focus:border-[#4ECDC4] rounded-xl p-3 text-sm font-medium focus:outline-none transition-colors"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#2D3748] mb-1">
                  Pilih Maskot Stiker untuk ID Card Pass Kamu
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { emoji: '⭐', label: 'Bintang Pulang' },
                    { emoji: '❤️', label: 'Cinta Hangat' },
                    { emoji: '🌿', label: 'Daun Hijau' },
                    { emoji: '🎨', label: 'Kreatif' },
                    { emoji: '🎈', label: 'Ceria' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.emoji}
                      onClick={() => handleAvatarSelect(item.emoji)}
                      className={`p-3 rounded-2xl text-2xl border-2 transition-all cursor-pointer ${
                        selectedAvatar === item.emoji
                          ? 'bg-[#FFE066] border-[#2D3748] scale-110 shadow-xs'
                          : 'bg-white border-[#E2E8F0] hover:scale-105'
                      }`}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#718096] hover:text-[#2D3748]"
                >
                  ← Ke Data Diri
                </button>

                <button
                  type="submit"
                  className="bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-bold text-sm px-7 py-3.5 rounded-2xl border-2 border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#2D3748]" />
                  <span>Kirim Pendaftaran & Dapatkan ID Pass</span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && activePass && (
            <div className="space-y-6 text-center">
              
              <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] font-heading font-bold text-xs px-4 py-1.5 rounded-full border border-[#81C784]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pendaftaran Berhasil Terkirim! 🎉</span>
              </div>

              <h3 className="text-2xl font-heading font-bold text-[#2D3748]">
                Selamat Datang, {activePass.nickname}! 💌
              </h3>
              <p className="text-xs text-[#4A5568]">
                Ini dia Kartu Identitas Volunteer Pass kamu untuk <span className="font-bold">Batch 39</span>. Tim admin akan segera menghubungimu via WhatsApp.
              </p>

              {/* Digital Scrapbook Ticket Result */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-[#E0F7FA] via-white to-[#FFF9DB] p-6 rounded-3xl border-2 border-[#2D3748] shadow-[6px_6px_0px_0px_rgba(45,55,72,1)] text-left relative overflow-hidden">
                
                {/* Sticker Avatar */}
                <div className="absolute top-4 right-4 bg-[#FFE066] w-12 h-12 rounded-2xl border-2 border-[#2D3748] flex items-center justify-center text-2xl shadow-xs animate-bounce">
                  {activePass.selectedAvatar}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="bg-[#4ECDC4] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      OFFICIAL VOLUNTEER PASS
                    </span>
                    <p className="font-heading font-bold text-xs text-[#00838F] mt-1">
                      {activePass.passNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#718096]">Nama Volunteer</p>
                    <p className="font-heading font-extrabold text-xl text-[#2D3748]">
                      {activePass.fullName} ({activePass.nickname})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#718096]">Divisi</p>
                      <p className="font-semibold text-[#2D3748]">{activePass.division}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#718096]">Domisili</p>
                      <p className="font-semibold text-[#2D3748]">{activePass.domicile}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-[#2D3748]/20 flex items-center justify-between text-[11px] text-[#718096]">
                    <span>Batch 39 • Semesta Senyum</span>
                    <span className="font-bold text-[#4ECDC4]">pulangkesinii</span>
                  </div>
                </div>

              </div>

              {/* Action Tools */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => copyPassCode(activePass.passNumber)}
                  className="bg-white hover:bg-[#FAF9F5] text-[#2D3748] font-heading font-bold text-xs px-4 py-2.5 rounded-xl border-2 border-[#2D3748] shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[#4ECDC4]" />
                  <span>{copiedPass ? 'Tersalin! ✅' : 'Salin Kode Pass'}</span>
                </button>

                <button
                  onClick={() => alert('Fitur simulasi: Kartu Pass kamu telah tersimpan di browser untuk dipamerkan ke Instagram Story!')}
                  className="bg-[#FFE066] hover:bg-[#FFD166] text-[#2D3748] font-heading font-bold text-xs px-4 py-2.5 rounded-xl border-2 border-[#2D3748] shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share ke Story Instagram</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0]">
                <button
                  onClick={onClose}
                  className="bg-[#4ECDC4] text-white font-heading font-bold text-sm px-6 py-2.5 rounded-xl border-2 border-[#2D3748] shadow-xs hover:bg-[#3AAFA9] transition-all cursor-pointer"
                >
                  Selesai & Jelajahi Website
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
