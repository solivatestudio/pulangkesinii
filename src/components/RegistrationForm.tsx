import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  FileCheck,
  Send,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { uploadFiles } from '../utils/uploadthing';

export interface RegistrationFormData {
  fullName: string;
  birthDate: string;
  domicile: string;
  whatsapp: string;
  followedChannel: string;
  activityChoice: string;
  contributionProof: {
    file: File | null;
    fileName: string;
    fileSize: number;
    previewUrl: string;
  };
  paymentMethod: string;
  tagFriendsProof: {
    file: File | null;
    fileName: string;
    fileSize: number;
    previewUrl: string;
  };
  repostStoryProof: {
    file: File | null;
    fileName: string;
    fileSize: number;
    previewUrl: string;
  };
  reason: string;
}

interface RegistrationFormProps {
  onClose?: () => void;
  onSubmitSuccess?: (data: RegistrationFormData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onClose,
  onSubmitSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    birthDate: '',
    domicile: '',
    whatsapp: '',
    followedChannel: '',
    activityChoice: '',
    contributionProof: { file: null, fileName: '', fileSize: 0, previewUrl: '' },
    paymentMethod: '',
    tagFriendsProof: { file: null, fileName: '', fileSize: 0, previewUrl: '' },
    repostStoryProof: { file: null, fileName: '', fileSize: 0, previewUrl: '' },
    reason: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [formConfig, setFormConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings/registration_form_config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.value) {
          setFormConfig(data.value);
        }
      })
      .catch(() => {});
  }, []);

  // File input refs
  const contributionInputRef = useRef<HTMLInputElement>(null);
  const tagFriendsInputRef = useRef<HTMLInputElement>(null);
  const repostStoryInputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    const scrollParent = formContainerRef.current?.closest('.form-sheet, .detail-sheet');
    if (scrollParent) {
      scrollParent.scrollTop = 0;
    }
  };

  // Auto-focus with preventScroll and listen to Escape key directly within component
  useEffect(() => {
    formContainerRef.current?.focus({ preventScroll: true });
    scrollToTop();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27 || e.which === 27) {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleEsc, true);
    document.addEventListener('keydown', handleEsc, true);
    window.addEventListener('keyup', handleEsc, true);
    document.addEventListener('keyup', handleEsc, true);

    return () => {
      window.removeEventListener('keydown', handleEsc, true);
      document.removeEventListener('keydown', handleEsc, true);
      window.removeEventListener('keyup', handleEsc, true);
      document.removeEventListener('keyup', handleEsc, true);
    };
  }, [onClose]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'contributionProof' | 'tagFriendsProof' | 'repostStoryProof'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      setFormData(prev => ({
        ...prev,
        [field]: {
          file,
          fileName: file.name,
          fileSize: file.size,
          previewUrl
        }
      }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRemoveFile = (field: 'contributionProof' | 'tagFriendsProof' | 'repostStoryProof') => {
    if (formData[field].previewUrl) {
      URL.revokeObjectURL(formData[field].previewUrl);
    }
    setFormData(prev => ({
      ...prev,
      [field]: { file: null, fileName: '', fileSize: 0, previewUrl: '' }
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Tanggal lahir wajib diisi';
    }
    if (!formData.domicile.trim()) {
      newErrors.domicile = 'Lokasi domisili wajib diisi';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    }
    if (!formData.followedChannel) {
      newErrors.followedChannel = 'Wajib mengonfirmasi telah mengikuti saluran resmi';
    }

    setErrors(newErrors);

    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.activityChoice) {
      newErrors.activityChoice = 'Pilihan kegiatan wajib dipilih';
    }
    if (formConfig?.enableContributionProof !== false && formConfig?.contributionProofRequired !== false) {
      if (!formData.contributionProof.file) {
        newErrors.contributionProof = 'Bukti pembayaran contribution fee wajib diupload';
      }
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Metode pembayaran wajib dipilih';
    }
    if (formConfig?.enableTagFriends !== false && formConfig?.tagFriendsRequired !== false) {
      if (!formData.tagFriendsProof.file) {
        newErrors.tagFriendsProof = `${formConfig?.tagFriendsLabel || 'Bukti tag 3 teman'} wajib diupload`;
      }
    }
    if (formConfig?.enableRepostStory !== false && formConfig?.repostStoryRequired !== false) {
      if (!formData.repostStoryProof.file) {
        newErrors.repostStoryProof = `${formConfig?.repostStoryLabel || 'Bukti repost IG Story'} wajib diupload`;
      }
    }
    if (formConfig?.reasonRequired !== false && !formData.reason.trim()) {
      newErrors.reason = `${formConfig?.reasonLabel || 'Alasan bergabung'} wajib diisi`;
    }

    setErrors(newErrors);

    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      setTimeout(scrollToTop, 50);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setTimeout(scrollToTop, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    let contributionProofUrl = '';
    let tagFriendsProofUrl = '';
    let repostStoryProofUrl = '';

    try {
      if (formData.contributionProof.file) {
        const res = await uploadFiles('proofUploader', {
          files: [formData.contributionProof.file],
        });
        if (res && res[0]) {
          contributionProofUrl = res[0].ufsUrl || res[0].url;
        }
      }
      if (formData.tagFriendsProof.file) {
        const res = await uploadFiles('proofUploader', {
          files: [formData.tagFriendsProof.file],
        });
        if (res && res[0]) {
          tagFriendsProofUrl = res[0].ufsUrl || res[0].url;
        }
      }
      if (formData.repostStoryProof.file) {
        const res = await uploadFiles('proofUploader', {
          files: [formData.repostStoryProof.file],
        });
        if (res && res[0]) {
          repostStoryProofUrl = res[0].ufsUrl || res[0].url;
        }
      }
    } catch (uploadErr) {
      console.warn('Upload error, proceeding:', uploadErr);
    }

    const payload = {
      fullName: formData.fullName.trim(),
      birthDate: formData.birthDate,
      domicile: formData.domicile.trim(),
      whatsapp: formData.whatsapp.trim(),
      followedChannel: formData.followedChannel,
      activityChoice: formData.activityChoice,
      paymentMethod: formData.paymentMethod,
      reason: formData.reason.trim(),
      contributionProofUrl,
      tagFriendsProofUrl,
      repostStoryProofUrl,
      submittedAt: new Date().toISOString()
    };

    console.log('=== DATA SUBMIT FORM (NEON DB) ===', payload);

    try {
      await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (apiErr) {
      console.error('Failed to submit to /api/registrations', apiErr);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(formData);
    }
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0eadad', '#FFE066', '#FF6B6B', '#4ECDC4']
      });
    } catch (err) {
      console.warn('Confetti error:', err);
    }
  };

  const handleReset = () => {
    if (window.confirm('Kosongkan semua isian formulir?')) {
      setFormData({
        fullName: '',
        birthDate: '',
        domicile: '',
        whatsapp: '',
        followedChannel: '',
        activityChoice: '',
        contributionProof: { file: null, fileName: '', fileSize: 0, previewUrl: '' },
        paymentMethod: '',
        tagFriendsProof: { file: null, fileName: '', fileSize: 0, previewUrl: '' },
        repostStoryProof: { file: null, fileName: '', fileSize: 0, previewUrl: '' },
        reason: ''
      });
      setErrors({});
      setCurrentStep(1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full space-y-4 py-2">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2e8f0] shadow-xs text-center space-y-4">
          <div className="w-14 h-14 bg-[#e0f7f6] text-[#0eadad] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#173f42]">
              Terima kasih, {formData.fullName || 'Kak'}! ❤️
            </h2>
            <p className="text-xs text-[#687479] mt-1.5 leading-relaxed">
              Tanggapan kamu untuk <strong className="text-[#0eadad]">Batch 43 Pulangkesinii</strong> telah berhasil dicatat. Tim kami akan melakukan verifikasi berkas dan bukti pembayaran.
            </p>
          </div>

          {/* Summary details */}
          <div className="bg-[#f8fafc] rounded-xl p-3.5 text-left text-xs space-y-2 border border-[#edf2f7]">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2">
              <span className="text-[#64748b]">Nama Lengkap</span>
              <span className="font-semibold text-[#1e293b]">{formData.fullName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2">
              <span className="text-[#64748b]">Nomor WhatsApp</span>
              <span className="font-semibold text-[#1e293b]">{formData.whatsapp}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2">
              <span className="text-[#64748b]">Kegiatan</span>
              <span className="font-semibold text-[#0eadad] text-right truncate max-w-[180px]">{formData.activityChoice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b]">Metode Pembayaran</span>
              <span className="font-semibold text-[#1e293b]">{formData.paymentMethod}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 bg-[#0eadad] hover:bg-[#0c9696] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Selesai & Tutup</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              className="w-full h-10 bg-white hover:bg-slate-50 border border-[#d9dde1] text-[#173f42] font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Kirim tanggapan lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={formContainerRef} 
      tabIndex={-1} 
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
          e.stopPropagation();
          onClose?.();
        }
      }}
      className="w-full pt-1 focus:outline-none"
    >
      {/* Top Banner Header inside Modal */}
      <div className="bg-gradient-to-r from-[#0eadad] to-[#128a8c] text-white p-4 sm:p-5 relative overflow-hidden rounded-2xl shadow-xs mb-3.5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FFE066] text-[#173f42] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-2xs">
              BATCH 43
            </span>
            <span className="text-[11px] text-[#dff6f5] font-semibold">
              Pulangkesinii Volunteer
            </span>
          </div>

          <h2 id="form-modal-title" className="text-lg sm:text-xl font-extrabold text-white leading-tight">
            {formConfig?.formTitle || 'Formulir Pendaftaran'}
          </h2>
          <p className="text-xs text-[#dff6f5] mt-0.5">
            {formConfig?.formDescription || 'Ruang untuk berbuat baik & bertumbuh bersama'}
          </p>
        </div>
      </div>

      {/* 2-Step Progress Indicator */}
      <div className="bg-[#f0fbfb] p-2.5 rounded-xl border border-[#d2f0ef] mb-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
            currentStep === 1 ? 'bg-[#0eadad] text-white' : 'bg-[#dff6f5] text-[#087c7e]'
          }`}>
            1
          </span>
          <span className={`text-[11px] font-semibold ${
            currentStep === 1 ? 'text-[#173f42] font-bold' : 'text-[#64748b]'
          }`}>
            Data Diri & Kontak
          </span>
        </div>

        <div className="flex-1 h-1 bg-[#d2f0ef] mx-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0eadad] transition-all duration-300 rounded-full"
            style={{ width: currentStep === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
            currentStep === 2 ? 'bg-[#0eadad] text-white' : 'bg-[#dff6f5] text-[#087c7e]'
          }`}>
            2
          </span>
          <span className={`text-[11px] font-semibold ${
            currentStep === 2 ? 'text-[#173f42] font-bold' : 'text-[#64748b]'
          }`}>
            Kegiatan & Bukti
          </span>
        </div>
      </div>

      {/* =========================================================================
          BAGIAN 1: DATA DIRI & KONTAK
      ========================================================================= */}
      {currentStep === 1 && (
        <form onSubmit={handleNextStep} className="space-y-3 sm:space-y-3.5 pb-2">
          
          {/* FIELD 1: Nama Lengkap Kamu */}
          <div 
            id="field-fullName"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.fullName ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-1">
              Nama Lengkap Kamu <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[#687479] italic mb-3">
              (Huruf awal kapital contoh Ilham Nur Sidik)
            </p>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, fullName: e.target.value }));
                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
              }}
              placeholder="Jawaban Anda"
              className="w-full h-11 px-3.5 bg-[#fbfcfc] border border-[#cbd5e1] focus:border-[#0eadad] focus:bg-white rounded-xl text-sm outline-none transition-all focus:ring-3 focus:ring-[#0eadad]/15 text-[#173f42]"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* FIELD 2: Tanggal Lahir Kamu */}
          <div 
            id="field-birthDate"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.birthDate ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-1">
              Tanggal Lahir Kamu <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[#687479] mb-2.5">
              Tanggal
            </p>
            <input
              type="date"
              value={formData.birthDate}
              max="2076-01-01"
              onChange={(e) => {
                setFormData(prev => ({ ...prev, birthDate: e.target.value }));
                if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: '' }));
              }}
              className="w-full h-11 px-3.5 bg-[#fbfcfc] border border-[#cbd5e1] focus:border-[#0eadad] focus:bg-white rounded-xl text-sm outline-none transition-all focus:ring-3 focus:ring-[#0eadad]/15 text-[#173f42]"
            />
            {errors.birthDate && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.birthDate}</span>
              </p>
            )}
          </div>

          {/* FIELD 3: Kamu Tinggal Dimana Niehhh */}
          <div 
            id="field-domicile"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.domicile ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-2.5">
              Kamu Tinggal Dimana Niehhh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.domicile}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, domicile: e.target.value }));
                if (errors.domicile) setErrors(prev => ({ ...prev, domicile: '' }));
              }}
              placeholder="Jawaban Anda"
              className="w-full h-11 px-3.5 bg-[#fbfcfc] border border-[#cbd5e1] focus:border-[#0eadad] focus:bg-white rounded-xl text-sm outline-none transition-all focus:ring-3 focus:ring-[#0eadad]/15 text-[#173f42]"
            />
            {errors.domicile && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.domicile}</span>
              </p>
            )}
          </div>

          {/* FIELD 4: Nomor WA kamu 08 berapaaa🫣 */}
          <div 
            id="field-whatsapp"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.whatsapp ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-2.5">
              Nomor WA kamu 08 berapaaa🫣 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, whatsapp: e.target.value }));
                if (errors.whatsapp) setErrors(prev => ({ ...prev, whatsapp: '' }));
              }}
              placeholder="Jawaban Anda"
              className="w-full h-11 px-3.5 bg-[#fbfcfc] border border-[#cbd5e1] focus:border-[#0eadad] focus:bg-white rounded-xl text-sm outline-none transition-all focus:ring-3 focus:ring-[#0eadad]/15 text-[#173f42]"
            />
            {errors.whatsapp && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.whatsapp}</span>
              </p>
            )}
          </div>

          {/* FIELD 5: Sebelum lanjut, yukk ikuti saluran resmi kita untuk mendapatkan info menarik lainnya! ❤️ */}
          <div 
            id="field-followedChannel"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.followedChannel ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <div className="mb-3">
              <h3 className="text-sm font-bold text-[#173f42] leading-snug">
                Sebelum lanjut, yukk ikuti saluran resmi kita untuk mendapatkan info menarik lainnya! ❤️ <span className="text-red-500">*</span>
              </h3>
              <a 
                href="https://whatsapp.com/channel/0029Vb7x44LFXUuSeqigEW0B" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0eadad] hover:text-[#0a7577] underline mt-2"
              >
                <span>Klik disinii yaaa!</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2 mt-3">
              <label 
                onClick={() => {
                  setFormData(prev => ({ ...prev, followedChannel: 'Sudahhh kakkk!!' }));
                  if (errors.followedChannel) setErrors(prev => ({ ...prev, followedChannel: '' }));
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.followedChannel === 'Sudahhh kakkk!!'
                    ? 'bg-[#e0f7f6] border-[#0eadad] text-[#087c7e] font-semibold'
                    : 'bg-white border-[#cbd5e1] hover:bg-slate-50 text-[#2D3748]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  formData.followedChannel === 'Sudahhh kakkk!!'
                    ? 'border-[#0eadad] bg-[#0eadad]'
                    : 'border-[#94a3b8] bg-white'
                }`}>
                  {formData.followedChannel === 'Sudahhh kakkk!!' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-xs sm:text-sm">Sudahhh kakkk!!</span>
              </label>
            </div>
            {errors.followedChannel && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.followedChannel}</span>
              </p>
            )}
          </div>

          {/* Action Button Step 1 */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full h-12 bg-[#0eadad] hover:bg-[#097b7d] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Bagian 2 (Kegiatan & Bukti)</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-[#64748b] hover:text-[#0eadad] transition-colors cursor-pointer"
              >
                Kosongkan formulir
              </button>
              <span className="text-[11px] text-[#94a3b8]">
                Langkah 1 dari 2
              </span>
            </div>
          </div>

        </form>
      )}

      {/* =========================================================================
          BAGIAN 2: KEGIATAN, PEMBAYARAN & BUKTI
      ========================================================================= */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 pb-2">
          
          {/* FIELD 6: Pilihan Kegiatan✨ */}
          <div 
            id="field-activityChoice"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.activityChoice ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-1">
              Pilihan Kegiatan✨ <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[#687479] italic mb-3">
              (Tersisa Jogja ajaa yaa gaiss)
            </p>

            <div className="space-y-2">
              <label 
                onClick={() => {
                  setFormData(prev => ({ 
                    ...prev, 
                    activityChoice: 'Sabtu (Panti Asuhan Al Wahhaab Sinar Melati 11 Jogja)' 
                  }));
                  if (errors.activityChoice) setErrors(prev => ({ ...prev, activityChoice: '' }));
                }}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.activityChoice === 'Sabtu (Panti Asuhan Al Wahhaab Sinar Melati 11 Jogja)'
                    ? 'bg-[#e0f7f6] border-[#0eadad] text-[#087c7e] font-semibold'
                    : 'bg-white border-[#cbd5e1] hover:bg-slate-50 text-[#2D3748]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  formData.activityChoice === 'Sabtu (Panti Asuhan Al Wahhaab Sinar Melati 11 Jogja)'
                    ? 'border-[#0eadad] bg-[#0eadad]'
                    : 'border-[#94a3b8] bg-white'
                }`}>
                  {formData.activityChoice === 'Sabtu (Panti Asuhan Al Wahhaab Sinar Melati 11 Jogja)' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-xs sm:text-sm leading-snug">
                  Sabtu (Panti Asuhan Al Wahhaab Sinar Melati 11 Jogja)
                </span>
              </label>
            </div>
            {errors.activityChoice && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.activityChoice}</span>
              </p>
            )}
          </div>

          {/* FIELD 7: Upload bukti contribution fee */}
          <div 
            id="field-contributionProof"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.contributionProof ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <div className="space-y-2.5 mb-4">
              <h3 className="text-sm font-bold text-[#173f42] leading-snug">
                Upload bukti contribution fee untuk kegiatan yang kamu pilih dengan biaya sebesar: <span className="text-red-500">*</span>
              </h3>
              
              <div className="bg-[#f0fbfb] p-3 rounded-xl border border-[#d2f0ef] text-xs text-[#173f42] space-y-1">
                <p className="font-semibold text-[#087c7e]">Biaya Kontribusi:</p>
                <p>• Rp. 80.000 rupiah</p>
                <p>• Rp. 90.000 rupiah (Khusus Jakarta 1)</p>
              </div>

              <div className="bg-[#fff9db] p-3 rounded-xl border border-[#ffe066]/50 text-xs text-[#2D3748] space-y-1.5">
                <p className="font-bold text-[#92400e]">Pembayaran melalui :</p>
                <div className="space-y-1 font-medium">
                  <div className="flex items-center justify-between">
                    <span>1. Mandiri = <strong className="font-bold">60012878900</strong></span>
                    <button 
                      type="button" 
                      onClick={() => handleCopy('60012878900', 'Mandiri')}
                      className="text-[10px] bg-white border border-[#d9dde1] px-2 py-0.5 rounded text-[#173f42] font-semibold flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>{copiedAccount === 'Mandiri' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. Seabank = <strong className="font-bold">901468640854</strong></span>
                    <button 
                      type="button" 
                      onClick={() => handleCopy('901468640854', 'Seabank')}
                      className="text-[10px] bg-white border border-[#d9dde1] px-2 py-0.5 rounded text-[#173f42] font-semibold flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>{copiedAccount === 'Seabank' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. Gopay = <strong className="font-bold">088976190966</strong></span>
                    <button 
                      type="button" 
                      onClick={() => handleCopy('088976190966', 'Gopay')}
                      className="text-[10px] bg-white border border-[#d9dde1] px-2 py-0.5 rounded text-[#173f42] font-semibold flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>{copiedAccount === 'Gopay' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#78350f] pt-0.5 font-bold">A/N Ilham Nur Sidik</p>
                </div>
              </div>

              <p className="text-[11px] text-[#687479] leading-relaxed">
                Program ini menggunakan contribution fee yang digunakan untuk operasional kegiatan, pengembangan impact, serta sustainability gerakan.
              </p>

              <div className="pt-1">
                <p className="text-xs font-bold text-[#173f42] mb-1">
                  Untuk Kebijakan terkait biaya kontribusi, dapat dilihat pada link dibawah ini:
                </p>
                <a 
                  href="https://drive.google.com/file/d/1jFwMZQ45khHNXf9myhwoadQEd3Gc3Myk/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#0eadad] hover:text-[#087c7e] underline break-all inline-flex items-center gap-1 font-medium"
                >
                  <span>https://drive.google.com/file/d/1jFwMZQ45khHNXf9myhwoadQEd3Gc3Myk/view</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* File Upload Box */}
            <div className="pt-2 border-t border-[#edf2f7]">
              <input
                type="file"
                ref={contributionInputRef}
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, 'contributionProof')}
                className="hidden"
              />

              {!formData.contributionProof.file ? (
                <div 
                  onClick={() => contributionInputRef.current?.click()}
                  className="border-2 border-dashed border-[#cbd5e1] hover:border-[#0eadad] hover:bg-[#f2fbfb] rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e0f7f6] text-[#0eadad] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0eadad] bg-white border border-[#0eadad] px-3.5 py-1.5 rounded-lg shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tambahkan file</span>
                    </span>
                    <p className="text-[10px] text-[#94a3b8] mt-1.5">
                      Upload 1 file yang didukung. Maks 1 GB.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    {formData.contributionProof.previewUrl ? (
                      <img 
                        src={formData.contributionProof.previewUrl} 
                        alt="Bukti pembayaran" 
                        className="w-10 h-10 rounded-lg object-cover border border-[#cbd5e1] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#e0f7f6] text-[#0eadad] flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-semibold text-[#1e293b] truncate">
                        {formData.contributionProof.fileName}
                      </p>
                      <p className="text-[10px] text-[#64748b]">
                        {formatFileSize(formData.contributionProof.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('contributionProof')}
                    className="p-1.5 text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Hapus file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {errors.contributionProof && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.contributionProof}</span>
              </p>
            )}
          </div>

          {/* FIELD 8: Pembayaran Melalui */}
          <div 
            id="field-paymentMethod"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.paymentMethod ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-3">
              Pembayaran Melalui <span className="text-red-500">*</span>
            </label>

            <div className="space-y-2">
              {['Mandiri', 'Seabank', 'Gopay'].map((method) => (
                <label 
                  key={method}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, paymentMethod: method }));
                    if (errors.paymentMethod) setErrors(prev => ({ ...prev, paymentMethod: '' }));
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === method
                      ? 'bg-[#e0f7f6] border-[#0eadad] text-[#087c7e] font-semibold'
                      : 'bg-white border-[#cbd5e1] hover:bg-slate-50 text-[#2D3748]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData.paymentMethod === method
                      ? 'border-[#0eadad] bg-[#0eadad]'
                      : 'border-[#94a3b8] bg-white'
                  }`}>
                    {formData.paymentMethod === method && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{method}</span>
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.paymentMethod}</span>
              </p>
            )}
          </div>

          {/* FIELD 9: Bukti screenshoot tag 3 teman kamu di kolom komentar poster batch 43 Pulangkesinii */}
          <div 
            id="field-tagFriendsProof"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.tagFriendsProof ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-3 leading-snug">
              Bukti screenshoot tag 3 teman kamu di kolom komentar poster batch 43 Pulangkesinii <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              ref={tagFriendsInputRef}
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'tagFriendsProof')}
              className="hidden"
            />

            {!formData.tagFriendsProof.file ? (
              <div 
                onClick={() => tagFriendsInputRef.current?.click()}
                className="border-2 border-dashed border-[#cbd5e1] hover:border-[#0eadad] hover:bg-[#f2fbfb] rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#e0f7f6] text-[#0eadad] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0eadad] bg-white border border-[#0eadad] px-3.5 py-1.5 rounded-lg shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tambahkan file</span>
                  </span>
                  <p className="text-[10px] text-[#94a3b8] mt-1.5">
                    Upload 1 file yang didukung. Maks 1 GB.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  {formData.tagFriendsProof.previewUrl ? (
                    <img 
                      src={formData.tagFriendsProof.previewUrl} 
                      alt="Bukti Tag Teman" 
                      className="w-10 h-10 rounded-lg object-cover border border-[#cbd5e1] shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#e0f7f6] text-[#0eadad] flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#1e293b] truncate">
                      {formData.tagFriendsProof.fileName}
                    </p>
                    <p className="text-[10px] text-[#64748b]">
                      {formatFileSize(formData.tagFriendsProof.fileSize)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile('tagFriendsProof')}
                  className="p-1.5 text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Hapus file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.tagFriendsProof && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.tagFriendsProof}</span>
              </p>
            )}
          </div>

          {/* FIELD 10: Bukti repost poster batch 43 Pulangkesinii ke IG Story */}
          <div 
            id="field-repostStoryProof"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.repostStoryProof ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-3 leading-snug">
              Bukti repost poster batch 43 Pulangkesinii ke IG Story <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              ref={repostStoryInputRef}
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'repostStoryProof')}
              className="hidden"
            />

            {!formData.repostStoryProof.file ? (
              <div 
                onClick={() => repostStoryInputRef.current?.click()}
                className="border-2 border-dashed border-[#cbd5e1] hover:border-[#0eadad] hover:bg-[#f2fbfb] rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#e0f7f6] text-[#0eadad] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0eadad] bg-white border border-[#0eadad] px-3.5 py-1.5 rounded-lg shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tambahkan file</span>
                  </span>
                  <p className="text-[10px] text-[#94a3b8] mt-1.5">
                    Upload 1 file yang didukung. Maks 1 GB.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  {formData.repostStoryProof.previewUrl ? (
                    <img 
                      src={formData.repostStoryProof.previewUrl} 
                      alt="Bukti Repost Story" 
                      className="w-10 h-10 rounded-lg object-cover border border-[#cbd5e1] shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#e0f7f6] text-[#0eadad] flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#1e293b] truncate">
                      {formData.repostStoryProof.fileName}
                    </p>
                    <p className="text-[10px] text-[#64748b]">
                      {formatFileSize(formData.repostStoryProof.fileSize)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile('repostStoryProof')}
                  className="p-1.5 text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Hapus file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.repostStoryProof && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.repostStoryProof}</span>
              </p>
            )}
          </div>

          {/* FIELD 11: Alasan kamu mau Pulangkesinii? 🥺❤️ */}
          <div 
            id="field-reason"
            className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
              errors.reason ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e2e8f0]'
            }`}
          >
            <label className="block text-sm font-bold text-[#173f42] mb-3 leading-snug">
              Alasan kamu mau Pulangkesinii? 🥺❤️ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.reason}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, reason: e.target.value }));
                if (errors.reason) setErrors(prev => ({ ...prev, reason: '' }));
              }}
              placeholder="Jawaban Anda"
              className="w-full min-h-[96px] p-3.5 bg-[#fbfcfc] border border-[#cbd5e1] focus:border-[#0eadad] focus:bg-white rounded-xl text-sm outline-none transition-all focus:ring-3 focus:ring-[#0eadad]/15 text-[#173f42] resize-y"
            />
            {errors.reason && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.reason}</span>
              </p>
            )}
          </div>

          {/* Action Buttons Step 2 */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-1/3 h-12 bg-white hover:bg-slate-50 border border-[#cbd5e1] text-[#173f42] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#173f42]" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 h-12 bg-[#0eadad] hover:bg-[#097b7d] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengirim...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Kirim Pendaftaran</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-[#64748b] hover:text-[#0eadad] transition-colors cursor-pointer"
              >
                Kosongkan formulir
              </button>
              <span className="text-[11px] text-[#94a3b8]">
                Langkah 2 dari 2
              </span>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};
