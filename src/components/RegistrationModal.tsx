import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Share2, 
  ArrowRight, 
  Send, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShieldCheck,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActivityItem, VolunteerRegistration } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  activity: ActivityItem | null;
  onClose: () => void;
  onSuccess: (reg: VolunteerRegistration) => void;
  existingPass: VolunteerRegistration | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  activity,
  onClose,
  onSuccess,
  existingPass,
}) => {
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [domicile, setDomicile] = useState('Jakarta');
  const [age, setAge] = useState<number>(20);
  const [division, setDivision] = useState('Acara & Mentoring');
  const [motivation, setMotivation] = useState('');
  const [funFact, setFunFact] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⭐');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeResultPass, setActiveResultPass] = useState<VolunteerRegistration | null>(existingPass);

  if (!isOpen || !activity) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0EADAD', '#00B4EB', '#FFE066', '#FFB7B2', '#96D2D0']
    });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nickname || !whatsapp) {
      alert('Mohon lengkapi Nama Lengkap, Panggilan, dan Nomor WhatsApp kamu ya!');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('Mohon menyetujui komitmen bersama kegiatan.');
      return;
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newReg: VolunteerRegistration = {
      id: `reg-${Date.now()}`,
      registrationCode: `PULKES-B${activity.batchNumber}-${randomId}`,
      activityId: activity.id,
      activityTitle: activity.title,
      batchNumber: activity.batchNumber,
      fullName,
      nickname,
      email: email || `${nickname.toLowerCase().replace(/\s+/g, '')}@pulangkesinii.id`,
      whatsapp,
      domicile,
      age: Number(age) || 20,
      division,
      motivation: motivation || 'Ingin mencari pengalaman baru, berteman dengan orang baik, dan berbagi kebahagiaan bersama adik-adik.',
      funFact: funFact || 'Suka mendengarkan musik santai saat perjalanan pulang.',
      avatarSticker: selectedAvatar,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'terdaftar'
    };

    setActiveResultPass(newReg);
    onSuccess(newReg);
    setStep(3);
    triggerConfetti();
  };

  const copyRegistrationCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#172B32]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="bg-[#0EADAD] px-4 sm:px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFE066] text-[#172B32] rounded-xl flex items-center justify-center font-heading font-extrabold text-sm shadow-2xs">
              {activity.batchNumber}
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                Pendaftaran {activity.title}
              </h3>
              <p className="text-[11px] text-white/80">
                #TemanPulangKamu • Kuota Terbatas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors cursor-pointer text-white"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
          
          {/* Step 1: Data Diri */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4 sm:space-y-5">
              
              <div className="bg-[#E6F7F7] p-3 rounded-2xl border border-[#0EADAD]/30 text-xs text-[#0EADAD] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Langkah 1 dari 2: Data Diri & Kontak Relawan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Alya Rahmawati"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F8FBFB] border border-[#CBD5E0] focus:border-[#0EADAD] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                    Nama Panggilan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Alya"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-[#F8FBFB] border border-[#CBD5E0] focus:border-[#0EADAD] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#F8FBFB] border border-[#CBD5E0] focus:border-[#0EADAD] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    placeholder="alya@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8FBFB] border border-[#CBD5E0] focus:border-[#0EADAD] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                    Domisili Saat Ini
                  </label>
                  <select
                    value={domicile}
                    onChange={(e) => setDomicile(e.target.value)}
                    className="w-full bg-[#F8FBFB] border border-[#CBD5E0] focus:border-[#0EADAD] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#172B32] focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Jakarta">Jakarta</option>
                    <option value="Depok">Depok</option>
                    <option value="Tangerang">Tangerang / Tangsel</option>
                    <option value="Bekasi">Bekasi</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Jogja">D.I. Yogyakarta</option>
                    <option value="Surabaya">Surabaya & Malang</option>
                    <option value="Luar Kota (Hybrid)">Luar Kota (Hybrid)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                    Usia (Tahun)
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="45"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-[#F8FBFB] border border-[#CBD5E0] focus:border-[#0EADAD] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-teal-glow active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Lanjut ke Pilihan Divisi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* Step 2: Divisi & Motivasi */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 sm:space-y-5">
              
              <div className="bg-[#FFF9DB] p-3 rounded-2xl border border-[#FFE066] text-xs text-[#B45309] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                  <span>Langkah 2 dari 2: Pilihan Divisi & Stiker ID Pass</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="underline font-bold cursor-pointer"
                >
                  Kembali
                </button>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#172B32] mb-1.5">
                  Pilih Divisi Peran Kamu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'Acara & Mentoring', label: '🎪 Acara & Pendamping', desc: 'Mendampingi adik-adik, ice-breaking & games' },
                    { id: 'Humas & Outreach', label: '📢 Humas & Relasi', desc: 'Komunikasi peserta, koordinasi panti & tamu' },
                    { id: 'Media & Kreatif', label: '🎨 Media & Dokumentasi', desc: 'Foto/video interaktif, live report & konten' },
                    { id: 'Logistik & Konsumsi', label: '📦 Logistik & Perlengkapan', desc: 'Persiapan alat kreasi, snack & kelancaran acara' },
                  ].map((div) => (
                    <button
                      type="button"
                      key={div.id}
                      onClick={() => setDivision(div.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        division === div.id
                          ? 'bg-[#E6F7F7] border-[#0EADAD] shadow-2xs'
                          : 'bg-[#F8FBFB] border-[#E2E8F0] hover:border-[#CBD5E0]'
                      }`}
                    >
                      <p className="font-heading font-bold text-xs text-[#172B32]">{div.label}</p>
                      <p className="text-[11px] text-[#647A80] mt-0.5">{div.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                  Apa motivasimu ingin ikut kegiatan ini?
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pengen berbagi senyum sama adik-adik dan mencari teman baru yang positif."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full bg-[#F8FBFB] border border-[#CBD5E0] focus:border-[#0EADAD] focus:bg-white rounded-xl p-3 text-xs sm:text-sm font-medium focus:outline-none transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#172B32] mb-1">
                  Pilih Stiker Avatar untuk ID Card Pass Kamu
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  {[
                    { emoji: '⭐', label: 'Bintang' },
                    { emoji: '❤️', label: 'Cinta' },
                    { emoji: '🌱', label: 'Tumbuh' },
                    { emoji: '🎨', label: 'Kreatif' },
                    { emoji: '🎈', label: 'Ceria' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.emoji}
                      onClick={() => setSelectedAvatar(item.emoji)}
                      className={`p-2.5 sm:p-3 rounded-2xl text-2xl border transition-all cursor-pointer ${
                        selectedAvatar === item.emoji
                          ? 'bg-[#FFE066] border-[#172B32] scale-110 shadow-xs'
                          : 'bg-[#F8FBFB] border-[#E2E8F0] hover:scale-105'
                      }`}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#0EADAD] focus:ring-[#0EADAD] cursor-pointer"
                />
                <label htmlFor="agree" className="text-[11px] text-[#647A80] cursor-pointer leading-tight">
                  Saya berkomitmen untuk hadir tepat waktu, bersikap saling menghargai, dan menjaga nama baik komunitas selama kegiatan.
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#647A80] hover:text-[#172B32]"
                >
                  ← Ke Data Diri
                </button>

                <button
                  type="submit"
                  className="bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-teal-glow active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pendaftaran & Buat ID Pass</span>
                </button>
              </div>

            </form>
          )}

          {/* Step 3: Digital Pass Result Card */}
          {step === 3 && activeResultPass && (
            <div className="space-y-6 text-center animate-fadeIn">
              
              <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] font-heading font-bold text-xs px-4 py-1.5 rounded-full border border-[#81C784]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pendaftaran Berhasil Terkirim! 🎉</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#172B32]">
                  Selamat Datang, {activeResultPass.nickname}! 💌
                </h3>
                <p className="text-xs text-[#647A80] mt-1 max-w-md mx-auto">
                  Ini adalah Kartu ID Pass Relawan resmi kamu. Simpan kode pendaftaran ini untuk verifikasi di grup koordinasi.
                </p>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-[#E6F7F7] via-white to-[#FFF9DB] p-5 sm:p-6 rounded-3xl border-2 border-[#0EADAD]/40 shadow-soft text-left relative overflow-hidden">
                
                {/* Floating Avatar */}
                <div className="absolute top-4 right-4 bg-[#FFE066] w-12 h-12 rounded-2xl border border-[#172B32]/20 flex items-center justify-center text-2xl shadow-xs animate-bounce">
                  {activeResultPass.avatarSticker}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="bg-[#0EADAD] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      OFFICIAL VOLUNTEER PASS
                    </span>
                    <p className="font-heading font-extrabold text-sm text-[#0EADAD] mt-1 tracking-wider">
                      {activeResultPass.registrationCode}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#647A80]">Nama Relawan</p>
                    <p className="font-heading font-extrabold text-lg sm:text-xl text-[#172B32]">
                      {activeResultPass.fullName} ({activeResultPass.nickname})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#647A80]">Divisi</p>
                      <p className="font-semibold text-[#172B32]">{activeResultPass.division}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#647A80]">Domisili</p>
                      <p className="font-semibold text-[#172B32]">{activeResultPass.domicile}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dashed border-[#0EADAD]/30 flex items-center justify-between text-[11px] text-[#647A80]">
                    <span>Batch {activeResultPass.batchNumber} • Pulangkesinii</span>
                    <span className="font-bold text-[#0EADAD]">#TemanPulangKamu</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => copyRegistrationCode(activeResultPass.registrationCode)}
                  className="bg-white hover:bg-[#F8FBFB] text-[#172B32] font-heading font-bold text-xs px-4 py-2.5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[#0EADAD]" />
                  <span>{copiedCode ? 'Tersalin! ✅' : 'Salin Kode Pass'}</span>
                </button>

                <button
                  onClick={() => alert('Kartu Pass berhasil disimpan ke perangkatmu!')}
                  className="bg-[#FFE066] hover:bg-[#FFD166] text-[#172B32] font-heading font-bold text-xs px-4 py-2.5 rounded-xl border border-[#172B32]/10 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share ke Instagram Story</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]">
                <button
                  onClick={onClose}
                  className="bg-[#0EADAD] text-white font-heading font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs hover:bg-[#108080] transition-colors cursor-pointer"
                >
                  Selesai & Jelajahi Kegiatan Lain
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
