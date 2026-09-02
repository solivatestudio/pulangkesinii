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
}

export const defaultFormConfig: FormConfig = {
  formTitle: 'Formulir Pendaftaran',
  formDescription: 'Ruang untuk berbuat baik & bertumbuh bersama',
  contributionPolicyUrl: 'https://drive.google.com/file/d/1jFwMZQ45khHNXf9myhwoadQEd3Gc3Myk/view',
  officialChannelName: 'WhatsApp Pulangkesinii',
  officialChannelUrl: 'https://whatsapp.com/channel/0029Vb7x44LFXUuSeqigEW0B',
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
};

export const normalizeFormConfig = (value: unknown): FormConfig => {
  const config = value && typeof value === 'object' ? value as Partial<FormConfig> : {};
  return {
    ...defaultFormConfig,
    ...config,
    customFields: Array.isArray(config.customFields) ? config.customFields : [],
  };
};
