export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  options?: string[];
  placeholder?: string;
  required: boolean;
  step: 1 | 2;
}

export interface FormConfig {
  formTitle: string;
  formDescription: string;
  contributionPolicyUrl: string;
  officialChannelName: string;
  officialChannelUrl: string;
  whatsappGroupUrl: string;
  enableTagFriends: boolean;
  tagFriendsRequired: boolean;
  tagFriendsLabel: string;
  enableRepostStory: boolean;
  repostStoryRequired: boolean;
  repostStoryLabel: string;
  enableContributionProof: boolean;
  contributionProofRequired: boolean;
  contributionProofLabel: string;
  reasonLabel: string;
  reasonRequired: boolean;
  customFields: CustomFormField[];
  fields: CoreFormField[];
  paymentMethods: string[];
}

export type CoreFieldId = 'fullName' | 'birthDate' | 'domicile' | 'whatsapp' | 'followedChannel' | 'activityChoice' | 'contributionProof' | 'paymentMethod' | 'tagFriendsProof' | 'repostStoryProof' | 'reason';
export interface CoreFormField { id: CoreFieldId; label: string; helperText?: string; placeholder?: string; enabled: boolean; required: boolean; step: 1 | 2; type: 'text' | 'date' | 'tel' | 'confirmation' | 'activity' | 'file' | 'payment' | 'textarea'; }

export const defaultCoreFields: CoreFormField[] = [
  { id: 'fullName', label: 'Nama Lengkap Kamu', helperText: '(Huruf awal kapital contoh Ilham Nur Sidik)', placeholder: 'Jawaban Anda', enabled: true, required: true, step: 1, type: 'text' },
  { id: 'birthDate', label: 'Tanggal Lahir Kamu', helperText: 'Tanggal', enabled: true, required: true, step: 1, type: 'date' },
  { id: 'domicile', label: 'Kamu Tinggal Dimana Niehhh', placeholder: 'Jawaban Anda', enabled: true, required: true, step: 1, type: 'text' },
  { id: 'whatsapp', label: 'Nomor WA kamu 08 berapaaa🫣', placeholder: 'Jawaban Anda', enabled: true, required: true, step: 1, type: 'tel' },
  { id: 'followedChannel', label: 'Sebelum lanjut, yukk ikuti saluran resmi kita untuk mendapatkan info menarik lainnya! ❤️', enabled: true, required: true, step: 1, type: 'confirmation' },
  { id: 'activityChoice', label: 'Pilihan Kegiatan✨', enabled: true, required: true, step: 2, type: 'activity' },
  { id: 'contributionProof', label: 'Bukti pembayaran contribution fee', enabled: true, required: true, step: 2, type: 'file' },
  { id: 'paymentMethod', label: 'Pembayaran Melalui', enabled: true, required: true, step: 2, type: 'payment' },
  { id: 'tagFriendsProof', label: 'Bukti screenshoot tag 3 teman kamu di kolom komentar poster Pulangkesinii', enabled: true, required: true, step: 2, type: 'file' },
  { id: 'repostStoryProof', label: 'Bukti repost poster Pulangkesinii ke IG Story', enabled: true, required: true, step: 2, type: 'file' },
  { id: 'reason', label: 'Alasan kamu mau Pulangkesinii? 🥺❤️', placeholder: 'Jawaban Anda', enabled: true, required: true, step: 2, type: 'textarea' },
];

export const defaultFormConfig: FormConfig = {
  formTitle: 'Formulir Pendaftaran',
  formDescription: 'Ruang untuk berbuat baik & bertumbuh bersama',
  contributionPolicyUrl: 'https://drive.google.com/file/d/1jFwMZQ45khHNXf9myhwoadQEd3Gc3Myk/view',
  officialChannelName: 'WhatsApp Pulangkesinii',
  officialChannelUrl: 'https://whatsapp.com/channel/0029Vb7x44LFXUuSeqigEW0B',
  whatsappGroupUrl: 'https://chat.whatsapp.com/invite',
  enableTagFriends: true,
  tagFriendsRequired: true,
  tagFriendsLabel: 'Bukti screenshoot tag 3 teman kamu di kolom komentar poster Pulangkesinii',
  enableRepostStory: true,
  repostStoryRequired: true,
  repostStoryLabel: 'Bukti repost poster Pulangkesinii ke IG Story',
  enableContributionProof: true,
  contributionProofRequired: true,
  contributionProofLabel: 'Bukti pembayaran contribution fee',
  reasonLabel: 'Alasan kamu mau Pulangkesinii? 🥺❤️',
  reasonRequired: true,
  customFields: [],
  fields: defaultCoreFields,
  paymentMethods: ['Mandiri', 'Seabank', 'Gopay'],
};

export const normalizeFormConfig = (value: unknown): FormConfig => {
  const config = value && typeof value === 'object' ? value as Partial<FormConfig> : {};
  const legacy = config as Partial<FormConfig>;
  const storedFields = Array.isArray(config.fields) ? config.fields : [];
  const fields = defaultCoreFields.map((field) => {
    const stored = storedFields.find((item) => item?.id === field.id);
    const merged = { ...field, ...stored };
    if (!stored) {
      if (field.id === 'contributionProof') return { ...merged, enabled: legacy.enableContributionProof ?? field.enabled, required: legacy.contributionProofRequired ?? field.required, label: legacy.contributionProofLabel || field.label };
      if (field.id === 'tagFriendsProof') return { ...merged, enabled: legacy.enableTagFriends ?? field.enabled, required: legacy.tagFriendsRequired ?? field.required, label: legacy.tagFriendsLabel || field.label };
      if (field.id === 'repostStoryProof') return { ...merged, enabled: legacy.enableRepostStory ?? field.enabled, required: legacy.repostStoryRequired ?? field.required, label: legacy.repostStoryLabel || field.label };
      if (field.id === 'reason') return { ...merged, required: legacy.reasonRequired ?? field.required, label: legacy.reasonLabel || field.label };
    }
    return merged;
  });
  return {
    ...defaultFormConfig,
    ...config,
    customFields: Array.isArray(config.customFields) ? config.customFields : [],
    fields,
    paymentMethods: Array.isArray(config.paymentMethods) && config.paymentMethods.length ? config.paymentMethods : defaultFormConfig.paymentMethods,
  };
};
