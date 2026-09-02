import { ActivityItem, TestimonialItem, MemoryStoryPhoto, FaqItem, ValueItem, CityRegion } from '../types';

export const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'act-batch-39',
    slug: 'volunteer-batch-39-semesta-senyum',
    title: 'Volunteer Batch 39 — Semesta Senyum & Ruang Ceria',
    shortDescription: 'Mengajar kreasi mewarnai, permainan edukatif interaktif, dan berbagi makanan sehat bersama adik-adik panti.',
    description: 'Di Batch 39 ini, kita bakal berkolaborasi mengajar kreasi mewarnai, permainan interaktif ice-breaking, dan berbagi keceriaan untuk adik-adik di panti asuhan serta rumah singgah. Tempat di mana senyummu adalah energi baru untuk mereka!',
    category: 'Volunteer',
    status: 'closing_soon',
    coverImage: '/assets/decor-1.png',
    gallery: [
      '/assets/decor-1.png',
      '/assets/decor-3.png',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80'
    ],
    locationName: 'Panti Asuhan & Ruang Belajar Komunitas',
    city: 'Jakarta',
    address: 'Jakarta Selatan & Depok (Hybrid & Onsite)',
    mapUrl: 'https://maps.google.com',
    startDate: '29 Agustus 2026',
    endDate: '30 Agustus 2026',
    registrationDeadline: '25 Agustus 2026',
    closingDaysLeft: 2,
    price: 0,
    priceLabel: 'Gratis',
    quota: 120,
    quotaFilled: 104,
    batchNumber: 39,
    benefits: [
      'E-Sertifikat Resmi bertandatangan Komunitas Pulangkesinii',
      'Teman baru & relasi komunitas seumur hidup',
      'Konsumsi ringan & snack saat kegiatan',
      'Dokumentasi foto/video interaktif',
      'ID Card Pass & Welcome Kit Volunteer'
    ],
    requirements: [
      'Terbuka untuk pelajar, mahasiswa, fresh-graduate, atau pekerja muda (15 - 30 tahun)',
      'Memiliki komitmen hadir tepat waktu dan antusias berinteraksi dengan adik-adik',
      'Bersedia mengikuti arahan briefing online H-2 kegiatan',
      'Ramah untuk First-Timer volunteer!'
    ],
    itemsToBring: [
      'Dresscode: Atasan Bernuansa Krem/Beige/Putih & Bawahan Nyaman',
      'Tumbler air minum pribadi (bebas sampah plastik)',
      'Hand sanitizer & tisu pribadi',
      'Energi positif & senyum terbaikmu!'
    ],
    rundown: [
      { time: '12.30 – 13.00', activity: 'Briefing volunteer, persiapan konsumsi, dan doa bersama' },
      { time: '13.00 – 13.15', activity: 'Opening & welcoming ice-breaking bersama adik-adik' },
      { time: '13.15 – 14.15', activity: 'Sesi utama: Workshop mewarnai & permainan edukatif' },
      { time: '14.15 – 14.45', activity: 'Penyerahan bingkisan kebaikan & apresiasi karya' },
      { time: '14.45 – 15.30', activity: 'Foto bersama, sharing circle antar volunteer & closing' }
    ],
    contactPerson: {
      name: 'Kak Nanda (Humas Pulkes)',
      role: 'Event Coordinator',
      whatsapp: '6285779321681'
    },
    featured: true,
    urgentClosing: true
  },
  {
    id: 'act-voluntrip-04',
    slug: 'voluntrip-04-jejak-hijau-lembang',
    title: 'Voluntrip #04 — Jelajah Hutan & Edukasi Lingkungan',
    shortDescription: 'Gabungan pengabdian tanam pohon, workshop seed bomb, dan camping keakraban di sejuknya alam Lembang.',
    description: 'Voluntrip adalah program khas Pulangkesinii yang memadukan aksi sosial pelestarian alam dengan eksplorasi wisata edukasi. Bersama 45 anak muda, kita akan membuat 500+ bola benih (seed bomb), menanam bibit pohon asli, dan menikmati malam akustik di bawah bintang.',
    category: 'Voluntrip',
    status: 'open',
    coverImage: '/assets/decor-3.png',
    gallery: [
      '/assets/decor-3.png',
      '/assets/decor-4.png',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
    ],
    locationName: 'Kawasan Konservasi Hutan Lembang',
    city: 'Bandung',
    address: 'Lembang, Kabupaten Bandung Barat',
    startDate: '12 September 2026',
    endDate: '13 September 2026',
    registrationDeadline: '5 September 2026',
    closingDaysLeft: 13,
    price: 125000,
    priceLabel: 'Rp 125.000',
    quota: 45,
    quotaFilled: 28,
    batchNumber: 4,
    benefits: [
      'Transportasi bus lokal meeting point Bandung ke lokasi PP',
      'Tenda camping, makan 3x & barbecue hangat',
      'Bibit pohon & bahan workshop seed bomb',
      'E-Sertifikat Voluntrip & Merchandise Eksklusif',
      'Acoustic Circle & Networking Malam Kebersamaan'
    ],
    requirements: [
      'Sehat jasmani dan siap beraktivitas di alam terbuka',
      'Membawa pakaian ganti dan perlengkapan mandi pribadi',
      'Menjaga etika alam dan tidak membuang sampah sembarangan'
    ],
    itemsToBring: [
      'Jaket hangat / sweater',
      'Sepatu outdoor atau sneakers yang nyaman',
      'Tumbler & obat pribadi',
      'Alat ibadah'
    ],
    rundown: [
      { time: '07.00 – 08.30', activity: 'Kumpul di Meeting Point Stasiun Bandung & perjalanan' },
      { time: '09.30 – 12.00', activity: 'Aksi penanaman pohon & workshop seed bomb' },
      { time: '12.00 – 15.00', activity: 'Istirahat, makan siang bersama, dan fun outbound' },
      { time: '18.30 – 21.00', activity: 'Sharing session, api unggun & acoustic circle' },
      { time: '08.00 (H+1)', activity: 'Senam pagi, sarapan & penutupan perjalanan' }
    ],
    contactPerson: {
      name: 'Kak Bima (Voluntrip Lead)',
      role: 'Koordinator Lapangan',
      whatsapp: '6285779321681'
    },
    featured: true,
    urgentClosing: false
  },
  {
    id: 'act-batch-40-totebag',
    slug: 'batch-40-art-therapy-melukis-totebag',
    title: 'Batch 40 — Art Class Melukis Totebag Ceria',
    shortDescription: 'Mendampingi adik-adik menuangkan imajinasi dan mimpi lewat kanvas totebag yang bisa mereka bawa pulang.',
    description: 'Kegiatan seni dan kreasi anak yang hangat. Setiap volunteer akan mendampingi adik-adik membuat karya seni di totebag kanvas. Melatih kreativitas, motorik halus, sekaligus menumbuhkan rasa percaya diri mereka.',
    category: 'Fun Activity',
    status: 'open',
    coverImage: '/assets/decor-4.png',
    gallery: [
      '/assets/decor-4.png',
      '/assets/decor-5.png',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80'
    ],
    locationName: 'Rumah Singgah Sahabat Anak',
    city: 'Tangerang',
    address: 'Tangerang Selatan',
    startDate: '5 September 2026',
    endDate: '5 September 2026',
    registrationDeadline: '1 September 2026',
    closingDaysLeft: 9,
    price: 0,
    priceLabel: 'Gratis',
    quota: 50,
    quotaFilled: 32,
    batchNumber: 40,
    benefits: [
      'Cat acrylic & kuas disediakan lengkap oleh panitia',
      'E-Sertifikat Volunteer Batch 40',
      'Snack box & minuman segar',
      'Foto candid estetik untuk dokumentasi portofolio'
    ],
    requirements: [
      'Menyukai anak-anak dan aktivitas seni/gambar (tidak perlu jago melukis!)',
      'Berpakaian sopan dan nyaman untuk beraktivitas cat',
      'Bersedia hadir tepat waktu di lokasi'
    ],
    itemsToBring: [
      'Celemek / pakaian yang aman jika terkena cat',
      'Botol minum sendiri',
      'Kamera HP untuk mengabadikan momen'
    ],
    rundown: [
      { time: '13.00 – 13.30', activity: 'Briefing tim volunteer & pembagian adik dampingan' },
      { time: '13.30 – 14.30', activity: 'Sesi mewarnai & melukis totebag impian' },
      { time: '14.30 – 15.00', activity: 'Pameran mini hasil karya, pemberian hadiah, & foto bersama' }
    ],
    contactPerson: {
      name: 'Kak Clarissa (Divisi Acara)',
      role: 'Creative Team',
      whatsapp: '6285779321681'
    },
    featured: false,
    urgentClosing: false
  },
  {
    id: 'act-batch-jogja-lansia',
    slug: 'batch-jogja-sapa-lansia-ruang-dengar',
    title: 'Pulang ke Jogja — Sapa Lansia & Ruang Dengar Hangat',
    shortDescription: 'Menemani Opa Oma di panti werdha, bernyanyi lagu kenangan keroncong, dan mendengarkan kisah hidup penuh hikmah.',
    description: 'Terkadang hal yang paling berharga bagi orang tua di panti jompo adalah telinga yang mau mendengar dan tangan yang mau menggenggam. Mari hadir sebagai cucu dan teman bicara yang membawa kehangatan bagi Opa Oma.',
    category: 'Social Care',
    status: 'open',
    coverImage: '/assets/decor-5.png',
    gallery: [
      '/assets/decor-5.png',
      '/assets/decor-2.png',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'
    ],
    locationName: 'Panti Werdha Kasih Senja',
    city: 'Jogja',
    address: 'Sleman, D.I. Yogyakarta',
    startDate: '19 September 2026',
    endDate: '19 September 2026',
    registrationDeadline: '15 September 2026',
    closingDaysLeft: 23,
    price: 0,
    priceLabel: 'Gratis',
    quota: 40,
    quotaFilled: 18,
    batchNumber: 6,
    benefits: [
      'E-Sertifikat Resmi Pulangkesinii Regional Jogja',
      'Sesi refleksi diri & gratitude circle',
      'Snack tradisional & konsumsi kegiatan',
      'Relasi baru komunitas relawan Jogja'
    ],
    requirements: [
      'Memiliki rasa empati tinggi, sabar, dan santun dalam bertutur kata',
      'Tidak merokok di area panti',
      'Mematuhi protokol kebersihan kesehatan'
    ],
    itemsToBring: [
      'Pakaian sopan bernuansa pastel / batik santai',
      'Kado kecil / buah untuk dibagikan bersama (opsional)'
    ],
    rundown: [
      { time: '09.00 – 09.30', activity: 'Briefing tim & sambutan pengurus panti' },
      { time: '09.30 – 11.00', activity: 'Ruang dengar personal, karaoke lagu kenangan, & senam ringan' },
      { time: '11.00 – 11.30', activity: 'Pembagian bingkisan kasih & foto kebersamaan' }
    ],
    contactPerson: {
      name: 'Kak Tari (Lead Pulkes Jogja)',
      role: 'Regional Coordinator',
      whatsapp: '6285779321681'
    },
    featured: false,
    urgentClosing: false
  },
  {
    id: 'act-batch-surabaya-mangrove',
    slug: 'batch-surabaya-ekowisata-mangrove',
    title: 'Pulang ke Surabaya — Aksi Pesisir Bersih & Mangrove Care',
    shortDescription: 'Eksplorasi perahu menyusuri ekosistem mangrove pesisir timur Surabaya sekaligus edukasi pemilahan sampah laut.',
    description: 'Aksi nyata untuk bumi dari arek-arek Jawa Timur! Mengajak pemuda Surabaya dan sekitarnya untuk peduli pada konservasi pesisir pantai timur.',
    category: 'Lingkungan',
    status: 'open',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      '/assets/decor-1.png'
    ],
    locationName: 'Ekowisata Mangrove Wonorejo',
    city: 'Surabaya',
    address: 'Wonorejo, Rungkut, Surabaya',
    startDate: '26 September 2026',
    endDate: '26 September 2026',
    registrationDeadline: '20 September 2026',
    closingDaysLeft: 28,
    price: 0,
    priceLabel: 'Gratis',
    quota: 70,
    quotaFilled: 38,
    batchNumber: 8,
    benefits: [
      'Tiket perahu susur mangrove & sarung tangan kebersihan',
      'E-Sertifikat Relawan Lingkungan',
      'Konsumsi siang & es kelapa muda',
      'Jejaring volunteer se-Jawa Timur'
    ],
    requirements: [
      'Siap beraktivitas di luar ruangan',
      'Membawa topi pelindung sinar matahari & botol minum pribadi'
    ],
    itemsToBring: [
      'Sepatu boots/sandal gunung',
      'Topi/kacamata hitam',
      'Pakaian ganti cadangan'
    ],
    rundown: [
      { time: '07.30 – 08.00', activity: 'Kumpul & briefing keamanan' },
      { time: '08.00 – 10.30', activity: 'Susur perahu, bersih pesisir & penanaman 200 bibit mangrove' },
      { time: '10.30 – 11.30', activity: 'Edukasi ekologi, sharing session & penutupan' }
    ],
    contactPerson: {
      name: 'Kak Rian (Lead Pulkes Surabaya)',
      role: 'Regional Lead',
      whatsapp: '6285779321681'
    },
    featured: false,
    urgentClosing: false
  },
  {
    id: 'act-batch-38-lentera',
    slug: 'batch-38-lentera-cerita-pojok-baca',
    title: 'Batch 38 — Lentera Cerita & Pojok Baca Baru',
    shortDescription: 'Aksi nyata 100 volunteer mendirikan pojok baca mini, mendongeng buku kisah nusantara, dan membagikan paket sekolah.',
    description: 'Kegiatan yang telah sukses terselenggara dengan melibatkan 100 relawan muda dan 85 adik-adik marjinal di wilayah Jakarta Timur.',
    category: 'Pendidikan',
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'
    ],
    locationName: 'Panti Asuhan Mizan Amanah',
    city: 'Jakarta',
    address: 'Jakarta Timur',
    startDate: '18 Juli 2026',
    endDate: '18 Juli 2026',
    registrationDeadline: '14 Juli 2026',
    price: 0,
    priceLabel: 'Gratis',
    quota: 100,
    quotaFilled: 100,
    batchNumber: 38,
    benefits: [
      'Pojok Baca baru dengan 300+ buku',
      'Pohon Cita-cita impian anak',
      'Acoustic Night Volunteer'
    ],
    requirements: ['Telah selesai dilaksanakan'],
    itemsToBring: [],
    rundown: [],
    contactPerson: {
      name: 'Kak Maya',
      role: 'Alumni Batch 38',
      whatsapp: '6285779321681'
    },
    featured: false,
    urgentClosing: false
  }
];

export const VALUES_DATA: ValueItem[] = [
  {
    name: 'Empathy',
    microcopy: 'Peduli dan saling memahami.',
    description: 'Mengutamakan kepedulian tulus dan rasa saling memahami terhadap sesama tanpa membedakan latar belakang.',
    iconName: 'Heart',
    colorBg: 'bg-[#E6F7F7]',
    colorBorder: 'border-[#0EADAD]/30',
    colorText: 'text-[#0EADAD]'
  },
  {
    name: 'Collaboration',
    microcopy: 'Bertumbuh dan bergerak bersama.',
    description: 'Percaya bahwa perubahan sosial yang besar lahir dari kolaborasi yang erat antar relawan, partner, dan masyarakat.',
    iconName: 'Users',
    colorBg: 'bg-[#E0F4FD]',
    colorBorder: 'border-[#00B4EB]/30',
    colorText: 'text-[#00B4EB]'
  },
  {
    name: 'Growth',
    microcopy: 'Belajar melalui pengalaman sosial.',
    description: 'Mendorong setiap individu untuk menemukan potensi diri dan bertumbuh melalui interaksi sosial yang nyata.',
    iconName: 'TrendingUp',
    colorBg: 'bg-[#FFF9DB]',
    colorBorder: 'border-[#FFE066]/60',
    colorText: 'text-[#B45309]'
  },
  {
    name: 'Impact',
    microcopy: 'Menghadirkan manfaat yang nyata.',
    description: 'Fokus menghasilkan dampak positif yang berkelanjutan bagi adik-adik binaan, lansia, dan lingkungan.',
    iconName: 'Sparkles',
    colorBg: 'bg-[#FCE4EC]',
    colorBorder: 'border-[#FFB7B2]/60',
    colorText: 'text-[#C2185B]'
  },
  {
    name: 'Integrity',
    microcopy: 'Bertanggung jawab dan transparan.',
    description: 'Menjalankan setiap program dengan kejujuran, tanggung jawab penuh, dan profesionalisme yang dapat dipercaya.',
    iconName: 'ShieldCheck',
    colorBg: 'bg-[#E8F5E9]',
    colorBorder: 'border-[#81C784]/60',
    colorText: 'text-[#2E7D32]'
  }
];

export const CITY_REGIONS: CityRegion[] = [
  {
    id: 'reg-jabodetabek',
    cityName: 'Jabodetabek',
    activeActivitiesCount: 2,
    description: 'Pusat kegiatan volunteer sosial, panti asuhan, dan rumah singgah terbesar Pulangkesinii.',
    coverImage: '/assets/decor-1.png',
    popularLocations: ['Jakarta Selatan', 'Depok', 'Tangerang Selatan', 'Jakarta Timur']
  },
  {
    id: 'reg-bandung',
    cityName: 'Bandung',
    activeActivitiesCount: 1,
    description: 'Basecamp program Voluntrip alam, konservasi hijau, dan creative gathering pemuda Jawa Barat.',
    coverImage: '/assets/decor-3.png',
    popularLocations: ['Lembang', 'Dago Pakar', 'Sumur Bandung']
  },
  {
    id: 'reg-jogja',
    cityName: 'Jogja & Solo',
    activeActivitiesCount: 1,
    description: 'Ruang pengabdian lansia, budaya ramah, dan komunitas hangat di kota istimewa.',
    coverImage: '/assets/decor-5.png',
    popularLocations: ['Sleman', 'Kota Yogyakarta', 'Solo Raya']
  },
  {
    id: 'reg-jatim',
    cityName: 'Surabaya & Malang',
    activeActivitiesCount: 1,
    description: 'Gerakan kepedulian pesisir bahari, edukasi anak jalanan, dan aksi lingkungan Jawa Timur.',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    popularLocations: ['Ekowisata Kenjeran', 'Malang Raya', 'Rungkut']
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'testi-1',
    name: 'Alya Rahma',
    roleOrBatch: 'Volunteer Batch 37 & 38',
    quote: 'Awalnya cuma iseng daftar pas lagi jenuh sama rutinitas kuliah. Ternyata pas pertama kali datang di Batch 37, semua kaku langsung cair! Kakak-kakak panitia menyambut ramah banget. Beneran merasa pulang ke tempat di mana kita diterima apa adanya.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    activityTag: 'Batch 37 & 38',
    likes: 142
  },
  {
    id: 'testi-2',
    name: 'Fikri Ardiansyah',
    roleOrBatch: 'Volunteer Batch 35 (Divisi Logistik)',
    quote: 'Gue tipe orang yang introvert dan sering canggung di lingkungan baru. Tapi di Pulangkesinii, ekosistemnya suportif parah. Gak ada senioritas, semua saling rangkul. Sekarang gue punya circle baru yang frekuensi kebaikannya sama!',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    activityTag: 'Batch 35',
    likes: 189
  },
  {
    id: 'testi-3',
    name: 'Clarissa Putri',
    roleOrBatch: 'Volunteer Batch 36 (Jogja)',
    quote: 'Momen pas ngerawat dan dengerin cerita Opa Oma di panti jompo bikin aku nangis haru. Ternyata yang mereka butuhkan cuma didengarkan dengan tulus. Terima kasih Pulangkesinii udah memfasilitasi ruang kebaikan sehangat ini.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    activityTag: 'Batch 36',
    likes: 215
  }
];

export const MEMORY_GALLERY: MemoryStoryPhoto[] = [
  {
    id: 'mem-1',
    title: 'Absen yang Kangen Ikut Volunteer! 💛',
    batchTag: 'Batch 38',
    category: 'Pendidikan',
    imageUrl: '/assets/decor-1.png',
    caption: 'Momen heboh saat adik-adik pamer hasil karya mewarnai mereka. Senyum tulus seperti ini yang selalu bikin pengen balik lagi.',
    quoteAuthor: 'Kak Nanda (Volunteer B38)',
    quoteText: 'Ikut Pulangkesinii bikin sadar kalau kebahagiaan itu menular banget!',
    location: 'Jakarta Selatan',
    date: '18 Juli 2026',
    likesCount: 342
  },
  {
    id: 'mem-2',
    title: 'Kalian Tim Mana: Ikut Volunteer / Rebahan? 🎨',
    batchTag: 'Batch 38',
    category: 'Fun Activity',
    imageUrl: '/assets/decor-2.png',
    caption: 'Foto bareng tim sehabis mempersiapkan dekorasi mini stage. Capeknya hilang diganti tawa hangat se-geng!',
    quoteAuthor: 'Kak Bima (Media Team)',
    quoteText: 'Dari strangers jadi kaya keluarga cuma dalam seminggu.',
    location: 'Depok',
    date: '21 Juni 2026',
    likesCount: 512
  },
  {
    id: 'mem-3',
    title: 'Creating Memories: Definisi Bahagia Paling Sederhana 🤝',
    batchTag: 'Batch 37',
    category: 'Lingkungan',
    imageUrl: '/assets/decor-3.png',
    caption: 'Aksi pembuatan seed bomb & pembersihan taman. Kotor-kotoran bareng tapi hatinya adem banget.',
    quoteAuthor: 'Kak Sarah (B37)',
    quoteText: 'Satu aksi kecil dari kita, arti besar buat bumi dan sekitar.',
    location: 'Taman Lembang Bandung',
    date: '15 Mei 2026',
    likesCount: 289
  },
  {
    id: 'mem-4',
    title: 'Tempat untuk Kembali Percaya Bahwa Kebaikan Masih Ada ❤️',
    batchTag: 'Batch 36',
    category: 'Social Care',
    imageUrl: '/assets/decor-5.png',
    caption: 'Opa dan Oma tersenyum lebar saat diajak nyanyi lagu kenangan bersama. Momen haru tak terlupakan.',
    quoteAuthor: 'Kak Tari (B36)',
    quoteText: 'Mendengar cerita Oma membuat kita belajar arti bersyukur.',
    location: 'Yogyakarta',
    date: '19 April 2026',
    likesCount: 421
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Siapa saja yang boleh ikut kegiatan Pulangkesinii?',
    answer: 'Terbuka untuk pelajar, mahasiswa, fresh graduate, maupun first-jobber berusia 15 – 30 tahun. Baik first-timer yang belum pernah ikut volunteer maupun yang sudah berpengalaman, semua disambut dengan hangat!',
    category: 'pendaftaran'
  },
  {
    id: 'faq-2',
    question: 'Bagaimana cara mendaftar kegiatan di website?',
    answer: 'Cukup pilih kegiatan yang kamu minati di katalog, klik "Lihat Detail", lalu tekan tombol "Daftar Sekarang". Isi form singkat pendaftaran (hanya butuh 1-2 menit) dan kamu akan langsung mendapatkan Kartu ID Pass resmi pendaftaran.',
    category: 'pendaftaran'
  },
  {
    id: 'faq-3',
    question: 'Apakah kegiatan volunteer berbayar atau gratis?',
    answer: 'Mayoritas kegiatan Community Event Volunteer sifatnya 100% GRATIS! Untuk program khusus seperti Voluntrip (perjalanan luar kota) atau kelas kreasi tertentu dengan bahan praktek, terdapat biaya kontribusi transparan yang mencakup akomodasi/transport/alat yang dirinci jelas di halaman kegiatan.',
    category: 'kegiatan'
  },
  {
    id: 'faq-4',
    question: 'Apakah peserta mendapatkan sertifikat resmi?',
    answer: 'Ya! Setiap peserta yang mengikuti rangkaian kegiatan secara lengkap akan mendapatkan E-Sertifikat Resmi bertandatangan resmi Komunitas Pulangkesinii yang dapat digunakan untuk portofolio atau lampiran beasiswa.',
    category: 'kegiatan'
  },
  {
    id: 'faq-5',
    question: 'Gue first-timer dan belum punya pengalaman, bakal canggung gak ya?',
    answer: 'Sama sekali tidak! Lebih dari 75% peserta di setiap batch adalah first-timer. Tim Pulangkesinii menyiapkan sesi Ice Breaking & Buddy System agar kamu langsung merasa nyaman dan punya teman mengobrol sejak menit pertama.',
    category: 'kegiatan'
  },
  {
    id: 'faq-6',
    question: 'Apa saja yang perlu dibawa saat hari-H kegiatan?',
    answer: 'Secara umum: pakaian yang sopan & nyaman sesuai dresscode batch, botol minum/tumbler pribadi (kami mendukung gerakan minim sampah plastik), obat pribadi, dan senyum terbaikmu! Detail lengkap selalu tercantum pada tab "Apa yang Perlu Dibawa" di masing-masing kegiatan.',
    category: 'kegiatan'
  },
  {
    id: 'faq-7',
    question: 'Di kota mana saja Pulangkesinii mengadakan kegiatan?',
    answer: 'Saat ini Pulangkesinii aktif hadir melalui kegiatan dan tim di wilayah Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi), Bandung, Jogja, Solo, Malang, dan Surabaya, serta kegiatan edukasi hybrid online.',
    category: 'komunitas'
  },
  {
    id: 'faq-8',
    question: 'Bagaimana cara menjadi partner atau mengajak Pulangkesinii berkolaborasi?',
    answer: 'Kami sangat terbuka berkolaborasi dengan perusahaan (CSR), universitas, BEM/organisasi kampus, media, maupun komunitas lain. Kamu bisa menghubungi tim kemitraan kami via WhatsApp (+62 857-7932-1681) atau email ke pulangkesinii@gmail.com.',
    category: 'partner'
  }
];
