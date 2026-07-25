export interface VolunteerBatch {
  id: string;
  batchNumber: number;
  title: string;
  subtitle: string;
  status: 'open' | 'ongoing' | 'completed';
  startDate: string;
  endDate: string;
  location: string;
  quotaMax: number;
  quotaFilled: number;
  activityTypes: string[];
  coverImage: string;
  description: string;
  highlights: string[];
}

export interface VolunteerApplication {
  id: string;
  passNumber: string;
  fullName: string;
  nickname: string;
  whatsapp: string;
  instagram: string;
  domicile: string;
  age: number;
  division: string;
  motivation: string;
  funFact: string;
  selectedAvatar: string;
  batchNumber: number;
  createdAt: string;
  status: 'terdaftar' | 'terkonfirmasi';
}

export interface MemoryPhoto {
  id: string;
  title: string;
  batchTag: string;
  batchNumber: number;
  category: 'Pendidikan' | 'Social Care' | 'Environment' | 'Fun Activity' | 'Community Gathering';
  imageUrl: string;
  caption: string;
  quoteAuthor?: string;
  quoteText?: string;
  location: string;
  date: string;
  likesCount: number;
  stickerLabel?: string;
}

export interface CommunityStory {
  id: string;
  authorName: string;
  authorRole: string; // e.g., 'Volunteer Batch 37'
  avatarUrl: string;
  storyText: string;
  batchTag: string;
  date: string;
  likes: number;
  userLiked?: boolean;
  highlightPhrase?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'pendaftaran' | 'kegiatan' | 'komunitas';
}

export interface ActivityCategory {
  id: string;
  name: string;
  iconName: string;
  colorBg: string;
  colorText: string;
  description: string;
  countText: string;
}
