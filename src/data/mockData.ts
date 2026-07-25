import { VolunteerBatch, MemoryPhoto, CommunityStory, FaqItem, ActivityCategory } from '../types';

export const INITIAL_BATCHES: VolunteerBatch[] = [
  {
    id: 'batch-39',
    batchNumber: 39,
    title: 'Volunteer Batch 39 — Semesta Senyum',
    subtitle: 'Ruang Tumbuh & Berbagi Kebahagiaan Bersama Adik-Adik Marjinal',
    status: 'open',
    startDate: '10 Agustus 2026',
    endDate: '24 Agustus 2026',
    location: 'Jakarta, Depok & Online Hybrid',
    quotaMax: 120,
    quotaFilled: 94,
    activityTypes: ['Pendidikan', 'Social Care', 'Fun Activity'],
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    description: 'Di Batch 39 ini, kita bakal berkolaborasi mengajar kreasi mewarnai, permainan edukasi interaktif, dan berbagi makanan sehat untuk adik-adik di area pinggiran Jakarta & Depok. Tempat di mana senyummu adalah energi untuk mereka!',
    highlights: ['Mengajar & Crafts', 'Piknik Volunteer & Sharing Circle', 'Sertifikat Resmi & Relasi Selamanya']
  },
  {
    id: 'batch-38',
    batchNumber: 38,
    title: 'Batch 38 — Lentera Cerita',
    subtitle: 'Membaca, Menggambar, & Tebar Hangat di Rumah Singgah',
    status: 'completed',
    startDate: '12 Juni 2026',
    endDate: '26 Juni 2026',
    location: 'Tangerang Selatan',
    quotaMax: 100,
    quotaFilled: 100,
    activityTypes: ['Pendidikan', 'Community Gathering'],
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    description: 'Aksi nyata 100 volunteer yang berkumpul mengajar pojok baca, mewarnai dongeng, dan membuat pohon cita-cita bersama 85 adik-adik.',
    highlights: ['Pojok Baca Baru', 'Pohon Cita-cita', 'Acoustic Night Volunteer']
  },
  {
    id: 'batch-37',
    batchNumber: 37,
    title: 'Batch 37 — Jejak Hijau',
    subtitle: 'Aksi Bersih Taman, Seed Bomb Workshop & Green Education',
    status: 'completed',
    startDate: '10 Mei 2026',
    endDate: '20 Mei 2026',
    location: 'Taman Kota Jakarta',
    quotaMax: 90,
    quotaFilled: 90,
    activityTypes: ['Environment', 'Fun Activity'],
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    description: 'Aksi kepedulian lingkungan dengan membuat 500+ seed bomb (bola benih) dan menanam tanaman obat keluarga bersama warga lokal.',
    highlights: ['500+ Seed Bomb', 'Eko-edukasi Anak', 'Picnic & Games']
  },
  {
    id: 'batch-36',
    batchNumber: 36,
    title: 'Batch 36 — Sapa Lansia & Kasih',
    subtitle: 'Ruang Dengar, Karaoke Bersama & Cek Kesehatan Panti Jompo',
    status: 'completed',
    startDate: '14 April 2026',
    endDate: '22 April 2026',
    location: 'Bekasi',
    quotaMax: 80,
    quotaFilled: 80,
    activityTypes: ['Social Care', 'Community Gathering'],
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    description: 'Menemani Opa & Oma mengobrol, mendengarkan nostalgia kisah masa muda, hingga bernyanyi lagu kenangan bersama.',
    highlights: ['Ruang Dengar Hangat', 'Pemeriksaan Kesehatan Free', 'Hadiah Kado Senja']
  }
];

export const MEMORY_PHOTOS: MemoryPhoto[] = [
  {
    id: 'mem-1',
    title: 'Absen yang Kangen Ikut Volunteer! 💛',
    batchTag: 'Batch 38',
    batchNumber: 38,
    category: 'Pendidikan',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    caption: 'Momen heboh saat adik-adik pamer hasil karya mewarnai mereka. Senyum tulus kaya gini yang selalu bikin pengen balik lagi.',
    quoteAuthor: 'Kak Nanda (Volunteer B38)',
    quoteText: 'Ikut Pulangkesinii bikin sadar kalau kebahagiaan itu menular banget!',
    location: 'Jakarta Selatan',
    date: '18 Juni 2026',
    likesCount: 342,
    stickerLabel: 'Core Memory Unlocked ✨'
  },
  {
    id: 'mem-2',
    title: 'Kalian Tim Mana: Ikut Volunteer / Rebahan? 🎨',
    batchTag: 'Batch 38',
    batchNumber: 38,
    category: 'Fun Activity',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    caption: 'Foto bareng tim divisi media & kreatif sehabis bikin dekorasi panggung mini. Capeknya hilang diganti tawa se-geng!',
    quoteAuthor: 'Kak Bima (Media Team)',
    quoteText: 'Dari strangers jadi kaya saudara kandung cuma dalam seminggu!',
    location: 'Depok',
    date: '21 Juni 2026',
    likesCount: 512,
    stickerLabel: 'Vibe 100/100 🔥'
  },
  {
    id: 'mem-3',
    title: 'Creating Memories: Definisi Bahagia Paling Sederhana 🤝',
    batchTag: 'Batch 37',
    batchNumber: 37,
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    caption: 'Aksi pembuatan seed bomb & bersih taman kota. Kotor-kotoran bareng tapi hatinya adem banget.',
    quoteAuthor: 'Kak Sarah (B37)',
    quoteText: 'Satu aksi kecil dari kita, arti besar buat bumi dan sekitar.',
    location: 'Taman Tebet',
    date: '15 Mei 2026',
    likesCount: 289,
    stickerLabel: 'Teman Pulang 🌿'
  },
  {
    id: 'mem-4',
    title: 'Tempat untuk Kembali Percaya Bahwa Kebaikan Masih Ada ❤️',
    batchTag: 'Batch 36',
    batchNumber: 36,
    category: 'Social Care',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    caption: 'Nenek Suminah tersenyum lebar waktu diajak nyanyi lagu Keroncong favorit beliau. Momen haru tak terlupakan.',
    quoteAuthor: 'Kak Tari (B36)',
    quoteText: 'Mendengar cerita Oma membuat kita belajar arti bersyukur.',
    location: 'Bekasi',
    date: '19 April 2026',
    likesCount: 421,
    stickerLabel: 'Ruang Dengar 💌'
  },
  {
    id: 'mem-5',
    title: 'Shake It Up — Spread The Kindness! 🌟',
    batchTag: 'Batch 35',
    batchNumber: 35,
    category: 'Community Gathering',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    caption: 'Malam keakraban & acoustic circle antar alumni volunteer dari berbagai batch. Cerita, gitaran, dan tawa hangat!',
    quoteAuthor: 'Kak Rian (B35)',
    quoteText: 'Di sini gak ada yang merasa sendirian.',
    location: 'Hutan Kota GBK',
    date: '28 Maret 2026',
    likesCount: 610,
    stickerLabel: 'Piknik & Music 🎶'
  },
  {
    id: 'mem-6',
    title: 'Look At Us: Serunya Ikut Volunteer ☀️',
    batchTag: 'Batch 34',
    batchNumber: 34,
    category: 'Pendidikan',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    caption: 'Penyerahan bingkisan sekolah dan buku dongeng buatan volunteer untuk anak-anak di Kampung Pemungut.',
    quoteAuthor: 'Kak Maya (B34)',
    quoteText: 'Senyum adik-adik pas terima buku adalah kado terbaik.',
    location: 'Cilincing',
    date: '10 Februari 2026',
    likesCount: 388,
    stickerLabel: 'Semangat Adik 🎒'
  }
];

export const INITIAL_STORIES: CommunityStory[] = [
  {
    id: 'story-1',
    authorName: 'Alya Rahma',
    authorRole: 'Volunteer Batch 37 & 38',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    storyText: 'Awalnya cuma iseng daftar pas lagi ngerasa jenuh banget sama rutinitas kuliah. Ternyata pas pertama kali datang di Batch 37, semua kaku langsung cair! Kakak-kakak panitianya menyambut ramah banget. Beneran merasa "pulang" ke tempat di mana kita diterima apa adanya.',
    batchTag: 'Batch 37',
    date: '3 Juli 2026',
    likes: 89,
    highlightPhrase: 'Beneran merasa "pulang" ke tempat di mana kita diterima apa adanya.'
  },
  {
    id: 'story-2',
    authorName: 'Fikri Ardiansyah',
    authorRole: 'Volunteer Batch 35 (Divisi Logistik)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    storyText: 'Dulu gue tipe orang yang introvert banget dan pemalu kalau ngobrol sama orang baru. Tapi di Pulangkesinii, ekosistemnya tuh supportive parah. Gak ada senioritas, semua saling rangkul. Sekarang gue punya circle baru yang frekuensinya sama!',
    batchTag: 'Batch 35',
    date: '24 Juni 2026',
    likes: 124,
    highlightPhrase: 'Gak ada senioritas, semua saling rangkul!'
  },
  {
    id: 'story-3',
    authorName: 'Clarissa Putri',
    authorRole: 'Volunteer Batch 36',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    storyText: 'Momen pas ngerawat Opa Oma di panti jompo bikin gue nangis terharu. Ternyata yang mereka butuhkan cuma didengarkan dengan tulus. Terima kasih Pulangkesinii udah memfasilitasi ruang kebaikan hangat ini.',
    batchTag: 'Batch 36',
    date: '12 Mei 2026',
    likes: 102,
    highlightPhrase: 'Terima kasih udah memfasilitasi ruang kebaikan hangat ini.'
  }
];

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'cat-pendidikan',
    name: 'Pendidikan & Mentoring',
    iconName: 'BookOpen',
    colorBg: 'bg-[#FFF9DB]',
    colorText: 'text-[#D97706]',
    description: 'Mengajar kreasi mewarnai, membaca dongeng, & permainan edukasi adik-adik marjinal.',
    countText: '14+ Aksi Selesai'
  },
  {
    id: 'cat-social',
    name: 'Pengabdian & Social Care',
    iconName: 'HeartHandshake',
    colorBg: 'bg-[#E0F7FA]',
    colorText: 'text-[#00838F]',
    description: 'Berbagi makanan, sapa lansia panti, paket kebaikan & aksi respon kemanusiaan.',
    countText: '18+ Aksi Selesai'
  },
  {
    id: 'cat-env',
    name: 'Environment & Green Earth',
    iconName: 'Sprout',
    colorBg: 'bg-[#E8F5E9]',
    colorText: 'text-[#2E7D32]',
    description: 'Tanam pohon, seed bomb workshop, & gerakan kebersihan fasilitas publik.',
    countText: '8+ Aksi Selesai'
  },
  {
    id: 'cat-fun',
    name: 'Creative & Fun Activity',
    iconName: 'Sparkles',
    colorBg: 'bg-[#FCE4EC]',
    colorText: 'text-[#C2185B]',
    description: 'Piknik volunteer, art therapy, games keakraban, & acoustic night kebersamaan.',
    countText: '20+ Fun Gathering'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Gue first-timer ikut volunteer, bakal kikuk atau garing gak ya?',
    answer: 'Sama sekali enggak! 80% volunteer di Pulangkesinii adalah first-timer. Kita punya sesi Ice Breaking & Buddy System khusus biar kamu langsung akrab sama tim sejak menit pertama.',
    category: 'pendaftaran'
  },
  {
    id: 'faq-2',
    question: 'Apakah pendaftaran volunteer di Pulangkesinii berbayar?',
    answer: 'Pendaftaran Pulangkesinii 100% GRATIS! Untuk kebutuhan merchandise/t-shirt kit (jika ada) sifatnya opsional sesuai kesepakatan batch.',
    category: 'pendaftaran'
  },
  {
    id: 'faq-3',
    question: 'Ada batasan umur atau domisili untuk join?',
    answer: 'Umumnya terbuka untuk usia 15 – 30 tahun (Pelajar, Mahasiswa, & First Jobber) dari wilayah Jabodetabek maupun area hybrid/online.',
    category: 'kegiatan'
  },
  {
    id: 'faq-4',
    question: 'Gimana cara dapat Sertifikat Volunteer?',
    answer: 'Setiap volunteer yang mengikuti rangkaian briefing & hari H kegiatan secara komplit bakal dapet e-Sertifikat Resmi bertandatangan Komunitas Pulangkesinii.',
    category: 'kegiatan'
  },
  {
    id: 'faq-5',
    question: 'Gue mau mau usul tempat/panti untuk aksi selanjutnya, bisa gak?',
    answer: 'Bisa banget! Kamu bisa kirim ide lokasi atau rekomendasi panti lewat form "Pulang Bercerita" atau via DM Instagram @pulangkesinii.',
    category: 'komunitas'
  }
];
