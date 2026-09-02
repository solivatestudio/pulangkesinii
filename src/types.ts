export type ActivityCategory = 
  | 'Semua'
  | 'Volunteer' 
  | 'Voluntrip' 
  | 'Fun Activity' 
  | 'Pendidikan' 
  | 'Social Care' 
  | 'Lingkungan';

export type ActivityStatus = 'open' | 'closing_soon' | 'full' | 'completed';

export interface ActivityRundown {
  time: string;
  activity: string;
}

export interface ActivityContact {
  name: string;
  role: string;
  whatsapp: string;
}

export interface ActivityItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: 'Volunteer' | 'Voluntrip' | 'Fun Activity' | 'Pendidikan' | 'Social Care' | 'Lingkungan';
  status: ActivityStatus;
  coverImage: string;
  gallery: string[];
  locationName: string;
  city: 'Jakarta' | 'Depok' | 'Tangerang' | 'Bandung' | 'Jogja' | 'Solo' | 'Malang' | 'Surabaya' | 'Hybrid';
  address: string;
  mapUrl?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  closingDaysLeft?: number;
  price: number; // 0 = Gratis
  priceLabel: string; // 'Gratis' or 'Rp 65.000'
  quota: number;
  quotaFilled: number;
  batchNumber: number;
  benefits: string[];
  requirements: string[];
  itemsToBring: string[];
  rundown: ActivityRundown[];
  contactPerson: ActivityContact;
  featured?: boolean;
  urgentClosing?: boolean;
}

export interface VolunteerRegistration {
  id: string;
  registrationCode: string;
  activityId: string;
  activityTitle: string;
  batchNumber: number;
  fullName: string;
  nickname: string;
  email: string;
  whatsapp: string;
  domicile: string;
  age: number;
  division: string;
  motivation: string;
  funFact?: string;
  avatarSticker: string;
  createdAt: string;
  status: 'terdaftar' | 'terkonfirmasi';
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
  status: 'terdaftar' | 'terkonfirmasi' | 'active';
}

export interface TestimonialItem {
  id: string;
  name: string;
  roleOrBatch: string;
  quote: string;
  photo: string;
  activityTag: string;
  likes: number;
}

export interface MemoryStoryPhoto {
  id: string;
  title: string;
  batchTag: string;
  category: string;
  imageUrl: string;
  caption: string;
  quoteAuthor?: string;
  quoteText?: string;
  location: string;
  date: string;
  likesCount: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'kegiatan' | 'pendaftaran' | 'komunitas' | 'partner';
}

export interface ValueItem {
  name: string;
  microcopy: string;
  description: string;
  iconName: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export interface CityRegion {
  id: string;
  cityName: string;
  activeActivitiesCount: number;
  description: string;
  coverImage: string;
  popularLocations: string[];
}
