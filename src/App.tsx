import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CameraIcon } from '@phosphor-icons/react/dist/csr/Camera';
import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { HandshakeIcon as PhosphorHandshakeIcon } from '@phosphor-icons/react/dist/csr/Handshake';
import { HeartIcon } from '@phosphor-icons/react/dist/csr/Heart';
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House';
import { PlantIcon } from '@phosphor-icons/react/dist/csr/Plant';
import { ShieldCheckIcon } from '@phosphor-icons/react/dist/csr/ShieldCheck';
import { SparkleIcon } from '@phosphor-icons/react/dist/csr/Sparkle';
import { CalendarDays, Check, ChevronDown, ChevronRight, Clock, HandHeart, Handshake, HelpCircle, Instagram, Linkedin, Mail, MapPin, Menu, MessageCircle, PackageCheck, Route, Search, Sparkles, Tag, Users, X } from 'lucide-react';
import { RegistrationForm } from './components/RegistrationForm';
import { PublicActivityCard as ActivityCard } from './components/PublicActivityCard';

type Activity = { 
  id: number | string; 
  category: string; 
  city: string; 
  color: string; 
  photo: string;
  title?: string;
  startDate?: string;
  priceLabel?: string;
  locationName?: string;
  description?: string;
  shortDescription?: string;
  address?: string;
  mapUrl?: string;
  endDate?: string;
  registrationDeadline?: string;
  quota?: number;
  quotaFilled?: number;
  benefits?: string[];
  requirements?: string[];
  itemsToBring?: string[];
  rundown?: Array<{ time: string; activity: string }>;
  gallery?: string[];
  contactPerson?: { name: string; role: string; whatsapp: string };
  urgentClosing?: boolean;
  status?: string;
};

const places = ['Semua', 'Jakarta', 'Bekasi', 'Depok', 'Tangerang', 'Bogor', 'Bandung', 'Jogja', 'Solo', 'Malang', 'Surabaya'];
const categories = ['Semua', 'Volunteer', 'Voluntrip', 'Workshop'];
const humanizeDate = (value?: string) => value && /^\d{4}-\d{2}-\d{2}$/.test(value)
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
  : value;
const meaningful = (value?: string) => value && !/^\[.*\]$/.test(value.trim()) ? value : undefined;
const publicAddress = (address?: string) => {
  const value = meaningful(address);
  if (!value) return undefined;
  return places.slice(1).includes(value) ? undefined : value;
};

const defaultCatalogue: Activity[] = [
  { 
    id: 'act-01', 
    category: 'Volunteer', 
    city: 'Jakarta', 
    color: 'cyan', 
    photo: '/images/web/activity-04.webp', 
    title: 'Volunteer Sahabat Mengajar & Cerita Anak', 
    startDate: '2026-09-20', 
    priceLabel: 'Gratis',
    locationName: 'RPTRA Pulo Gebang',
    address: 'Jl. Pulo Gebang Indah, Jakarta Timur',
    shortDescription: 'Berbagi cerita, membaca buku, dan belajar kreativitas bersama anak-anak lingkungan.',
    description: 'Program volunteer edukasi satu hari untuk menghadirkan ruang belajar yang menyenangkan, interaktif, dan penuh inspirasi.',
    quota: 40,
    quotaFilled: 18,
    benefits: ['E-Sertifikat Relawan', 'Merchandise Pulangkesinii', 'Relasi Komunitas Positif', 'Makan Siang & Snack'],
    urgentClosing: true,
    status: 'open'
  },
  { 
    id: 'act-02', 
    category: 'Voluntrip', 
    city: 'Bandung', 
    color: 'blue', 
    photo: '/images/web/activity-09.webp', 
    title: 'Voluntrip Konservasi Alam & Jelajah Budaya', 
    startDate: '2026-10-05', 
    priceLabel: 'Gratis',
    locationName: 'Kawasan Wisata Lembang',
    address: 'Desa Wisata Lembang, Bandung Barat',
    shortDescription: 'Menanam pohon endemik, aksi bersih alam, dan berbaur bersama kearifan lokal.',
    description: 'Perjalanan sosial 2 hari 1 malam yang menggabungkan aksi pelestarian lingkungan hidup dan interaksi hangat bersama warga.',
    quota: 30,
    quotaFilled: 14,
    benefits: ['Transportasi Bersama (PP)', 'Homestay Bersama Warga', 'Sertifikat Pengabdian', 'Dokumentasi Foto & Video'],
    urgentClosing: false,
    status: 'open'
  },
  { 
    id: 'act-03', 
    category: 'Workshop', 
    city: 'Jogja', 
    color: 'coral', 
    photo: '/images/web/activity-14.webp', 
    title: 'Workshop Pemberdayaan Digital Komunitas Muda', 
    startDate: '2026-10-18', 
    priceLabel: 'Gratis',
    locationName: 'Ruang Kolaborasi Kreatif',
    address: 'Jl. Malioboro No. 45, Yogyakarta',
    shortDescription: 'Pelatihan pembuatan konten sosial, storytelling dampak, dan digital branding.',
    description: 'Workshop intensif bersama para praktisi kreatif untuk membekali generasi muda dengan keterampilan storytelling sosial.',
    quota: 50,
    quotaFilled: 22,
    benefits: ['Toolkit & Modul Digital', 'E-Certificate Eksklusif', 'Networking Sesi Mentoring', 'Snack & Coffee Break'],
    urgentClosing: false,
    status: 'open'
  },
];

const defaultFaqItems = [
  { question: 'Siapa saja yang boleh ikut kegiatan Pulangkesinii?', answer: 'Semua anak muda, pelajar, mahasiswa, pekerja, dan masyarakat umum yang memiliki semangat berbuat baik dan ingin bertumbuh bersama komunitas sosial.' },
  { question: 'Bagaimana cara mendaftar kegiatan?', answer: 'Cukup pilih kegiatan yang kamu minati di katalog, klik tombol "Daftar Sekarang", isi formulir pendaftaran singkat, dan konfirmasikan keikutsertaanmu.' },
  { question: 'Apakah kegiatan berbayar atau gratis?', answer: 'Sebagian besar kegiatan volunteer reguler adalah gratis. Untuk kegiatan khusus seperti Voluntrip, terdapat transparansi kontribusi akomodasi yang dijelaskan pada detail acara.' },
  { question: 'Apakah peserta mendapatkan sertifikat?', answer: 'Ya! Setiap relawan yang berpartisipasi dan menyelesaikan kegiatan akan mendapatkan E-Sertifikat resmi dari Pulangkesinii sebagai apresiasi kontribusi.' },
  { question: 'Bagaimana cara menjadi partner atau berkolaborasi?', answer: 'Komunitas, institusi, maupun perusahaan dapat menghubungi kami melalui email di pulangkesinii@gmail.com atau WhatsApp resmi kami untuk peluang kolaborasi sosial.' },
];

export default function App(){
  const [query,setQuery]=useState('');
  const [place,setPlace]=useState('Semua');
  const [category,setCategory]=useState('Semua');
  const [showAll,setShowAll]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [selected,setSelected]=useState<Activity|null>(null);
  const [openFaq,setOpenFaq]=useState<number|null>(null);
  const [legal,setLegal]=useState<'terms'|'privacy'|null>(null);
  const [galleryImage,setGalleryImage]=useState<string|null>(null);
  const [showRegistrationForm,setShowRegistrationForm]=useState(false);

  // Dynamic state populated directly from PostgreSQL database with fallback
  const [catalogue, setCatalogue] = useState<Activity[]>(defaultCatalogue);
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>(defaultFaqItems);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(
    Array.from({ length: 15 }, (_, index) => `/images/web/activity-${String(index + 1).padStart(2, '0')}.webp`)
  );
  const [contactInfo, setContactInfo] = useState({
    whatsappNumber: '6285779321681',
    email: 'pulangkesinii@gmail.com',
    instagram: '@pulangkesinii',
    tiktok: '@Pulangkesinii_',
    linkedin: 'Pulangkesinii',
    basecamp: 'Jakarta Timur',
  });

  useEffect(() => {
    // 1. Fetch activities from DB
    fetch('/api/activities')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const colors = ['cyan', 'blue', 'coral'];
          setCatalogue(
            data.map((item: any, idx: number) => ({
              id: item.id || idx + 1,
              category: item.category || 'Volunteer',
              city: item.city || 'Jakarta',
              color: item.color || colors[idx % 3],
              photo: item.coverImage || `/images/web/activity-${String((idx % 15) + 1).padStart(2, '0')}.webp`,
              title: item.title,
              startDate: humanizeDate(item.startDate),
              priceLabel: item.priceLabel || 'Gratis',
              locationName: item.locationName || item.city,
              description: item.description,
              shortDescription: item.shortDescription,
              address: item.address,
              mapUrl: item.mapUrl,
              endDate: humanizeDate(item.endDate),
              registrationDeadline: humanizeDate(item.registrationDeadline),
              quota: item.quota,
              quotaFilled: item.quotaFilled,
              benefits: Array.isArray(item.benefits) ? item.benefits : [],
              requirements: Array.isArray(item.requirements) ? item.requirements : [],
              itemsToBring: Array.isArray(item.itemsToBring) ? item.itemsToBring : [],
              rundown: Array.isArray(item.rundown) ? item.rundown : [],
              gallery: Array.isArray(item.gallery) ? item.gallery : [],
              contactPerson: item.contactPerson,
              urgentClosing: Boolean(item.urgentClosing),
              status: item.status || 'open',
            }))
          );
        }
      })
      .catch(() => {});

    // 2. Fetch FAQs from DB
    fetch('/api/faqs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqItems(
            data.map((f: any) => ({
              question: f.question,
              answer: f.answer,
            }))
          );
        }
      })
      .catch(() => {});

    // 3. Fetch Gallery Photos from DB
    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryPhotos(data.map((g: any) => g.imageUrl));
        }
      })
      .catch(() => {});

    // 4. Fetch Site Contact Settings from DB
    fetch('/api/settings/contact_info')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.value) {
          setContactInfo((prev) => ({ ...prev, ...data.value }));
        }
      })
      .catch(() => {});
  }, []);

  const [placeDropdownOpen, setPlaceDropdownOpen] = useState(false);
  const [placeSearch, setPlaceSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const placeDropdownRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const filteredPlaces = useMemo(() => {
    if (!placeSearch.trim()) return places;
    return places.filter(p => p.toLowerCase().includes(placeSearch.trim().toLowerCase()));
  }, [placeSearch]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredPlaces]);

  useEffect(() => {
    if (placeDropdownOpen) {
      const idx = filteredPlaces.indexOf(place);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [placeDropdownOpen]);

  useEffect(() => {
    if (placeDropdownOpen && optionsContainerRef.current) {
      const highlightedEl = optionsContainerRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, placeDropdownOpen]);

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (!placeDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setPlaceDropdownOpen(true);
        setPlaceSearch('');
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredPlaces.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredPlaces.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPlaces[highlightedIndex]) {
        setPlace(filteredPlaces[highlightedIndex]);
        setPlaceDropdownOpen(false);
        setPlaceSearch('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setPlaceDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (placeDropdownRef.current && !placeDropdownRef.current.contains(e.target as Node)) {
        setPlaceDropdownOpen(false);
      }
    };
    if (placeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [placeDropdownOpen]);

  const filtered=useMemo(()=>catalogue.filter(i=>(place==='Semua'||i.city===place)&&(category==='Semua'||i.category===category)&&(!query.trim()||`${i.category} ${i.city} ${i.title || ''}`.toLowerCase().includes(query.toLowerCase()))),[catalogue,query,place,category]);

  useEffect(()=>{document.body.style.overflow=selected||legal||galleryImage||showRegistrationForm?'hidden':'';return()=>{document.body.style.overflow=''}},[selected,legal,galleryImage,showRegistrationForm]);
  
  useEffect(()=>{
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27 || e.which === 27) {
        if (placeDropdownOpen) {
          setPlaceDropdownOpen(false);
        } else if (showRegistrationForm) {
          setShowRegistrationForm(false);
        } else if (selected) {
          setSelected(null);
        } else if (galleryImage) {
          setGalleryImage(null);
        } else if (legal) {
          setLegal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [placeDropdownOpen, showRegistrationForm, selected, galleryImage, legal]);
  
  const showSearchResults=()=>document.querySelector('#semua-kegiatan')?.scrollIntoView({behavior:'smooth',block:'start'});

  return (
    <div className="page-stage">
      <a className="skip-link" href="#kegiatan">Lewati ke daftar kegiatan</a>
      
      <main className="mobile-shell site-shell">
        {/* HERO / BRAND HEADER */}
        <section className="brand-header" aria-labelledby="hero-title">
          <div className="hero-pattern" aria-hidden="true" />
          
          <div className="header-top-bar">
            <div className="brand-lockup">
              <img src="/assets/logo-palette.png" alt="Logo Pulangkesinii" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" aria-label="Navigasi desktop">
              <a href="#kegiatan">Kegiatan</a>
              <a href="#tentang">Tentang Kami</a>
              <a href="#program">Program</a>
              <a href="#momen">Galeri</a>
              <a href="#faq">FAQ</a>
              <a href="#kontak">Kontak</a>
              <a href="/admin" className="nav-admin-btn">Portal Admin</a>
            </nav>

            {/* Mobile Hamburger Button */}
            <button 
              className="hero-menu-button" 
              type="button" 
              aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} 
              aria-expanded={menuOpen} 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Dropdown Nav Menu */}
            {menuOpen && (
              <nav className="hero-menu" aria-label="Navigasi utama">
                <a href="#kegiatan" onClick={() => setMenuOpen(false)}>Kegiatan</a>
                <a href="#tentang" onClick={() => setMenuOpen(false)}>Tentang kami</a>
                <a href="#program" onClick={() => setMenuOpen(false)}>Program</a>
                <a href="#momen" onClick={() => setMenuOpen(false)}>Galeri</a>
                <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
                <a href="#kontak" onClick={() => setMenuOpen(false)}>Kontak</a>
                <a href="/admin" onClick={() => setMenuOpen(false)}>Portal Admin</a>
              </nav>
            )}
          </div>

          <div className="hero-copy">
            <div className="hero-grid-wrapper">
              <div className="hero-main-col">
                <span className="hero-eyebrow">
                  <Sparkles className="hero-sparkle-icon" />
                  Temukan ruang untuk berbuat baik
                </span>
                
                <h1 id="hero-title">
                  <span>Setiap Kebaikan</span>
                  <span>Selalu Punya</span>
                  <span>Tempat Pulang</span>
                </h1>
                
                <div className="hero-support">
                  <p>Temukan kegiatan volunteer, voluntrip, dan aktivitas sosial yang sesuai dengan waktu, minat, serta tempat pulangmu.</p>
                </div>

                <form className="search-bar" role="search" onSubmit={(e) => { e.preventDefault(); showSearchResults(); }}>
                  <Search aria-hidden="true" />
                  <input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Cari kegiatan, lokasi, atau tema..." 
                    aria-label="Cari kegiatan" 
                  />
                  <button type="submit" aria-label="Tampilkan hasil pencarian">
                    <Search />
                  </button>
                </form>
              </div>

              <div className="hero-visual-col">
                <div className="hero-mascot-composition">
                  <img className="hero-mascot-blue" src="/assets/star-blue.png" alt="Maskot biru Pulangkesinii" />
                  <img className="hero-mascot-yellow" src="/assets/star-yellow.png" alt="Maskot kuning Pulangkesinii" />
                  <div className="hero-floating-badge badge-top">
                    <strong>100% Inklusif</strong>
                    <span>Terbuka tanpa seleksi</span>
                  </div>
                  <div className="hero-floating-badge badge-bottom">
                    <strong>10+ Kota</strong>
                    <span>Komunitas bertumbuh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-wave" aria-hidden="true">
            <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
              <path d="M0 112 C170 65 350 30 560 38 C790 47 930 92 1110 67 C1240 49 1340 58 1440 82 L1440 150 L0 150 Z" fill="#FFFFFF" />
            </svg>
          </div>
        </section>

        {/* URGENT ACTIVITIES SECTION */}
        <section className="urgent-section" id="kegiatan">
          <div className="section-container">
            <div className="section-header-wrap">
              <span className="mini-badge">Batas Pendaftaran Segera Ditutup</span>
              <h2>Segera Berakhir</h2>
            </div>
            <div className="urgent-rail">
              {(catalogue.filter((i) => i.urgentClosing || i.status === 'closing_soon').length > 0 
                ? catalogue.filter((i) => i.urgentClosing || i.status === 'closing_soon').slice(0, 4)
                : catalogue.slice(0, 2)
              ).map((i) => (
                <ActivityCard key={i.id} item={i} compact onOpen={setSelected} />
              ))}
            </div>
          </div>
        </section>

        {/* LATEST ACTIVITIES SECTION */}
        <section className="latest-section" id="semua-kegiatan">
          <div className="section-container">
            <div className="section-header-wrap">
              <span className="mini-badge">Katalog Lengkap</span>
              <h2>Jelajahi Kegiatan Terbaru</h2>
            </div>

            <div className="catalog-filter-bar">
              <div className="category-pills" aria-label="Filter kategori kegiatan">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`cat-pill ${category === item ? 'active' : ''}`}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="filter-subbar">
                <div className="custom-dropdown-wrap" ref={placeDropdownRef} onKeyDown={handleDropdownKeyDown}>
                  <button
                    type="button"
                    className={`dropdown-trigger ${placeDropdownOpen ? 'open' : ''} ${place !== 'Semua' ? 'selected' : ''}`}
                    onClick={() => {
                      setPlaceDropdownOpen(!placeDropdownOpen);
                      if (!placeDropdownOpen) setPlaceSearch('');
                    }}
                    aria-expanded={placeDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <div className="trigger-left">
                      <MapPin className="trigger-icon" />
                      <span className="trigger-label">{place === 'Semua' ? 'Semua Wilayah' : place}</span>
                    </div>
                    <ChevronDown className={`trigger-chevron ${placeDropdownOpen ? 'rotate' : ''}`} />
                  </button>

                  {placeDropdownOpen && (
                    <div className="dropdown-popover" role="listbox">
                      <div className="dropdown-search-box">
                        <Search className="search-icon" />
                        <input
                          type="text"
                          value={placeSearch}
                          onChange={(e) => setPlaceSearch(e.target.value)}
                          placeholder="Cari kota/wilayah..."
                          autoFocus
                          aria-label="Cari wilayah"
                        />
                        {placeSearch && (
                          <button
                            type="button"
                            className="clear-search"
                            onClick={() => setPlaceSearch('')}
                            aria-label="Hapus pencarian wilayah"
                          >
                            <X />
                          </button>
                        )}
                      </div>
                      <div className="dropdown-options" ref={optionsContainerRef}>
                        {filteredPlaces.length > 0 ? (
                          filteredPlaces.map((p, idx) => {
                            const isSelected = place === p;
                            const isHighlighted = highlightedIndex === idx;
                            return (
                              <button
                                key={p}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={`dropdown-item ${isSelected ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                onClick={() => {
                                  setPlace(p);
                                  setPlaceDropdownOpen(false);
                                  setPlaceSearch('');
                                }}
                              >
                                <span>{p === 'Semua' ? 'Semua Wilayah' : p}</span>
                                {isSelected && <Check className="check-icon" />}
                              </button>
                            );
                          })
                        ) : (
                          <div className="dropdown-empty">Kota tidak ditemukan</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {(category !== 'Semua' || place !== 'Semua' || query) && (
                  <button
                    type="button"
                    className="clear-filter-btn"
                    onClick={() => {
                      setCategory('Semua');
                      setPlace('Semua');
                      setQuery('');
                    }}
                    title="Reset filter"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            <div className="latest-list">
              {filtered.slice(0, showAll ? 6 : 3).map((i) => (
                <ActivityCard key={i.id} item={i} onOpen={setSelected} />
              ))}
            </div>

            {!filtered.length && (
              <div className="empty-result">
                <Search />
                <strong>Belum menemukan kegiatan yang cocok.</strong>
                <p>Coba kata kunci, kategori, atau wilayah lain.</p>
                <button onClick={() => { setQuery(''); setPlace('Semua'); setCategory('Semua'); }}>
                  Reset pencarian
                </button>
              </div>
            )}

            {filtered.length > 3 && (
              <button className="more-button" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Tampilkan lebih sedikit' : 'Lihat lebih banyak'}
              </button>
            )}

            <div className="availability-note">
              <HelpCircle />
              <div>
                <strong>Perjalanan berikutnya sedang kami siapkan.</strong>
                <p>Data kegiatan aktif terus diperbarui secara berkala. Hubungi kanal resmi untuk informasi kegiatan mendatang.</p>
                <a href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii%2C%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer%20yang%20tersedia." target="_blank" rel="noreferrer">
                  Tanya kegiatan <ChevronRight />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="tentang">
          <img className="about-stars" src="/assets/decor-2.png" alt="" />
          <div className="section-container">
            <div className="about-grid">
              <div className="about-content">
                <div className="section-label">Tentang Pulangkesinii</div>
                <h2>Ruang untuk berbuat baik, bertemu, dan bertumbuh.</h2>
                <p>
                  Pulangkesinii adalah komunitas sosial yang menjadi ruang bagi anak muda untuk berbuat baik, bertemu orang-orang baru, bertumbuh, dan menciptakan dampak positif melalui kegiatan volunteer, voluntrip, serta kolaborasi sosial.
                </p>
                <blockquote>
                  “Pulang” bukan hanya kembali ke sebuah bangunan, tetapi kembali pada rasa nyaman, rasa memiliki, dan keyakinan bahwa kita tidak berjalan sendirian.
                </blockquote>
              </div>
              <div className="about-visual">
                <img className="about-mascot" src="/assets/star-yellow.png" alt="Maskot bintang kuning Pulangkesinii" />
              </div>
            </div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="story-section">
          <img className="story-decor" src="/assets/decor-3.png" alt="" />
          <div className="section-container">
            <div className="story-grid">
              <div className="story-content">
                <span className="mini-kicker">Our Story</span>
                <h2>Berawal dari satu pertanyaan sederhana...</h2>
                <p>
                  Bagaimana jika ada sebuah tempat di mana anak muda bisa berbuat baik, bertemu orang-orang baru tanpa harus merasa sendiri, lalu pulang dengan versi dirinya yang lebih baik?
                </p>
              </div>
              <div className="birth-date-card">
                <strong>02.08.2025</strong>
                <span>Pulangkesinii lahir sebagai ruang untuk berbagi kebaikan dan menciptakan pengalaman sosial yang bermakna bersama.</span>
              </div>
            </div>
          </div>
        </section>

        {/* MOMENTS / GALLERY SECTION */}
        <section className="moments-section" id="momen" aria-labelledby="moments-title">
          <div className="section-container">
            <div className="moments-heading">
              <div className="simple-heading">
                <span>Cerita dalam gambar</span>
                <h2 id="moments-title">Momen Kebaikan</h2>
              </div>
              <CameraIcon className="brand-symbol" weight="duotone" aria-hidden="true" />
            </div>
            <p className="moments-subtitle">Potret perjalanan, pertemuan, dan kebaikan yang pernah kami jalani bersama.</p>
            
            <div className="moments-rail">
              {galleryPhotos.map((photo, index) => {
                const tileClass = index === 3 ? 'featured' : index === 8 || index === 11 ? 'wide' : index === 13 ? 'tall' : '';
                return (
                  <button 
                    key={photo} 
                    className={tileClass} 
                    onClick={() => setGalleryImage(photo)} 
                    aria-label={`Buka foto dokumentasi ${index + 1}`}
                  >
                    <img src={photo} alt={`Dokumentasi kegiatan Pulangkesinii ${index + 1}`} loading="lazy" />
                  </button>
                );
              })}
            </div>
            <small className="moments-hint">Ketuk atau klik foto untuk memperbesar tampilan</small>
          </div>
        </section>

        {/* PROGRAM PILLARS SECTION */}
        <section className="program-section" id="program">
          <img className="program-decor" src="/assets/decor-4.png" alt="" />
          <div className="section-container">
            <div className="simple-heading">
              <span>Yang bisa kamu ikuti</span>
              <h2>Program Pulangkesinii</h2>
            </div>
            <div className="program-list">
              <article>
                <i><HandHeart /></i>
                <div>
                  <h3>Community Event Volunteer</h3>
                  <p>Kegiatan sosial tematik di berbagai ruang pengabdian masyarakat.</p>
                  <a href="#kegiatan">Lihat kegiatan <ChevronRight /></a>
                </div>
              </article>
              <article>
                <i><Route /></i>
                <div>
                  <h3>Community Event Voluntrip</h3>
                  <p>Berbagi sambil menjelajah alam, belajar budaya, dan membangun pengalaman bermakna.</p>
                  <a href="#kegiatan">Jelajahi voluntrip <ChevronRight /></a>
                </div>
              </article>
              <article>
                <i><Handshake /></i>
                <div>
                  <h3>Partnership Program</h3>
                  <p>Kolaborasi bersama perusahaan, organisasi, institusi, media, dan komunitas.</p>
                  <a href="mailto:pulangkesinii@gmail.com">Ajak kami berkolaborasi <ChevronRight /></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="values-section">
          <div className="section-container">
            <div className="simple-heading">
              <span>Yang kami jaga</span>
              <h2>Nilai Pulangkesinii</h2>
            </div>
            <div className="value-grid">
              <span><HeartIcon className="brand-symbol" weight="duotone" aria-hidden="true" />Empathy</span>
              <span><PhosphorHandshakeIcon className="brand-symbol" weight="duotone" aria-hidden="true" />Collaboration</span>
              <span><PlantIcon className="brand-symbol" weight="duotone" aria-hidden="true" />Growth</span>
              <span><SparkleIcon className="brand-symbol" weight="duotone" aria-hidden="true" />Impact</span>
              <span><ShieldCheckIcon className="brand-symbol" weight="duotone" aria-hidden="true" />Integrity</span>
            </div>
          </div>
        </section>

        {/* VISION & MISSION SECTION */}
        <section className="vision-section">
          <div className="section-container">
            <div className="vision-grid">
              <div className="vision-card">
                <CompassIcon className="brand-symbol" weight="duotone" aria-hidden="true" />
                <span>Visi</span>
                <p>Menjadi komunitas sosial yang menginspirasi generasi muda untuk bertumbuh, berbagi, dan menciptakan dampak positif melalui aksi nyata yang berkelanjutan.</p>
              </div>
              <div className="mission-card">
                <details open>
                  <summary>
                    Misi Pulangkesinii <ChevronDown />
                  </summary>
                  <ul>
                    <li>Menjadi ruang aman bagi anak muda untuk berkembang melalui kegiatan sosial.</li>
                    <li>Mendorong budaya volunteer yang inklusif dan menyenangkan.</li>
                    <li>Menghubungkan individu dan komunitas dalam kolaborasi sosial.</li>
                    <li>Menghadirkan program sosial yang kreatif dan edukatif.</li>
                    <li>Membangun kepedulian sosial sebagai bagian dari gaya hidup.</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* REGIONAL PRESENCE SECTION */}
        <section className="reach-section">
          <div className="section-container">
            <div className="reach-inner">
              <MapPin />
              <div>
                <span>Ruang kebaikan terus bertumbuh</span>
                <h2>Jakarta · Bekasi · Depok · Tangerang · Bogor · Bandung · Jogja · Solo · Malang · Surabaya</h2>
                <p>Daftar wilayah ini terus berkembang seiring kolaborasi dan keterlibatan komunitas di berbagai kota.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="faq-section" id="faq">
          <div className="section-container">
            <div className="simple-heading">
              <span>Yang sering ditanyakan</span>
              <h2>Pertanyaan umum</h2>
            </div>
            <div className="faq-list">
              {faqItems.map((q, i) => (
                <article key={q.question || i}>
                  <button 
                    aria-expanded={openFaq === i} 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{q.question}</span>
                    <ChevronDown />
                  </button>
                  {openFaq === i && <p>{q.answer}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="contact-section" id="kontak">
          <img className="contact-main" src="/assets/star-blue.png" alt="Maskot bintang biru Pulangkesinii" />
          <img className="contact-decor" src="/assets/decor-1.png" alt="" />
          <div className="section-container">
            <div className="contact-grid">
              <div className="contact-cta-col">
                <span className="mini-kicker">Hubungi kami</span>
                <h2>Mau tanya kegiatan atau bikin kolaborasi?</h2>
                <p>Tim Pulangkesinii akan membantu mengarahkanmu ke informasi yang tepat.</p>
                <a 
                  className="wa-button" 
                  href={`https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo%20Pulangkesinii%2C%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer.`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <MessageCircle /> Chat WhatsApp
                </a>
              </div>

              <div className="contact-channels-col">
                <div className="contact-list">
                  <a href={`mailto:${contactInfo.email}`}>
                    <Mail />
                    <span><small>Email</small>{contactInfo.email}</span>
                  </a>
                  <div>
                    <Instagram />
                    <span><small>Instagram</small>{contactInfo.instagram}</span>
                  </div>
                  <div>
                    <span className="text-icon">Tt</span>
                    <span><small>TikTok</small>{contactInfo.tiktok}</span>
                  </div>
                  <div>
                    <Linkedin />
                    <span><small>LinkedIn</small>{contactInfo.linkedin}</span>
                  </div>
                  <div>
                    <span className="text-icon">@</span>
                    <span><small>Threads</small>@Pulangkesinii</span>
                  </div>
                  <div>
                    <MapPin />
                    <span><small>Basecamp</small>{contactInfo.basecamp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="section-container">
            <nav>
              <a href="#tentang">Tentang Pulangkesinii</a>
              <span>|</span>
              <button type="button" onClick={() => setLegal('terms')}>Syarat & Ketentuan</button>
              <span>|</span>
              <a href="#kontak">Pusat Bantuan</a>
              <span>|</span>
              <a href="/admin">Portal Admin</a>
            </nav>
            <div className="socials">
              <span><Instagram /></span>
              <span><Linkedin /></span>
              <a href="mailto:pulangkesinii@gmail.com"><Mail /></a>
              <span><MapPin /></span>
            </div>
            <button type="button" className="privacy-link" onClick={() => setLegal('privacy')}>Kebijakan Privasi</button>
            <p>Copyright © {new Date().getFullYear()} Pulangkesinii. All Rights Reserved</p>
          </div>
        </footer>
      </main>

      {/* ACTIVITY DETAIL MODAL */}
      {selected && !showRegistrationForm && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <section 
            className="detail-sheet" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="detail-title" 
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="sheet-close" onClick={() => setSelected(null)} aria-label="Tutup detail">
              <X />
            </button>
            <div className={`sheet-cover cover-${selected.color} photo-cover`}>
              <img src={selected.photo} alt={`Dokumentasi kegiatan ${selected.category} Pulangkesinii`} />
              <span>{selected.category} · {selected.city}</span>
            </div>
            <h2 id="detail-title">{selected.title || '[Judul Kegiatan]'}</h2>
            {selected.shortDescription && <p className="detail-lead">{selected.shortDescription}</p>}
            
            <div className="sheet-meta">
              <span><CalendarDays />{selected.startDate}{selected.endDate && selected.endDate !== selected.startDate ? ` – ${selected.endDate}` : ''}</span>
              <span><MapPin />{meaningful(selected.locationName) || selected.city}</span>
              <span><Tag />{selected.priceLabel}</span>
              <span><Users />{selected.quotaFilled || 0}/{selected.quota || 0} peserta</span>
            </div>

            {(publicAddress(selected.address) || meaningful(selected.locationName) || selected.mapUrl) && (
              <div className="detail-location">
                <MapPin />
                <div>
                  <strong>{meaningful(selected.locationName) || selected.city}</strong>
                  {publicAddress(selected.address) && <p>{selected.address}</p>}
                  {selected.mapUrl && <a href={selected.mapUrl} target="_blank" rel="noopener noreferrer">Buka lokasi di peta ↗</a>}
                </div>
              </div>
            )}

            <div className="detail-split">
              <div className="detail-split-col">
                <h3>Deskripsi Acara</h3>
                <p>{selected.description || 'Deskripsi lengkap, rundown kegiatan, dan benefit akan ditampilkan setelah data resmi tersedia.'}</p>
              </div>
              <div className="detail-split-col">
                <h3>Syarat & Ketentuan</h3>
                <p>Terbuka untuk umum, kuota terbatas tanpa seleksi, dan mematuhi tata tertib kegiatan.</p>
                <a href="https://drive.google.com/file/d/1jFwMZQ45khHNXf9myhwoadQEd3Gc3Myk/view" target="_blank" rel="noopener noreferrer">Kebijakan Biaya Kontribusi ↗</a>
              </div>
            </div>

            <div className="detail-grid">
              {selected.benefits && selected.benefits.length > 0 && (
                <div className="detail-list">
                  <h3>Benefit Volunteer</h3>
                  <ul>{selected.benefits.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
                </div>
              )}
              {selected.requirements && selected.requirements.length > 0 && (
                <div className="detail-list">
                  <h3>Syarat Mengikuti</h3>
                  <ul>{selected.requirements.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
                </div>
              )}
              {selected.itemsToBring && selected.itemsToBring.length > 0 && (
                <div className="detail-list">
                  <h3><PackageCheck /> Yang Perlu Dibawa</h3>
                  <ul>{selected.itemsToBring.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
                </div>
              )}
            </div>

            {selected.rundown && selected.rundown.length > 0 && (
              <div className="detail-section">
                <h3>Rangkaian Kegiatan</h3>
                <div className="detail-rundown">
                  {selected.rundown.map((item, index) => (
                    <div key={`${item.time}-${index}`}>
                      <span><Clock />{item.time}</span>
                      <p>{item.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.gallery && selected.gallery.length > 0 && (
              <div className="detail-section">
                <h3>Galeri Kegiatan</h3>
                <div className="detail-gallery">
                  {selected.gallery.map((image, index) => (
                    <button key={`${image}-${index}`} onClick={() => setGalleryImage(image)}>
                      <img src={image} alt={`Galeri ${selected.title} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-footer-info">
              {selected.registrationDeadline && <span>Batas pendaftaran: <strong>{selected.registrationDeadline}</strong></span>}
              {selected.contactPerson?.whatsapp && (
                <a href={`https://wa.me/${selected.contactPerson.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle /> Hubungi {selected.contactPerson.name}
                </a>
              )}
            </div>

            <button type="button" onClick={() => setShowRegistrationForm(true)} className="detail-sheet-cta">
              Daftar Sekarang
            </button>
          </section>
        </div>
      )}

      {/* REGISTRATION FORM MODAL */}
      {showRegistrationForm && (
        <div className="modal-backdrop" onMouseDown={() => setShowRegistrationForm(false)}>
          <section 
            ref={(el) => { if (el) el.scrollTop = 0; }} 
            tabIndex={-1} 
            className="detail-sheet form-sheet" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="form-modal-title" 
            onMouseDown={(e) => e.stopPropagation()} 
            onKeyDown={(e) => { if (e.key === 'Escape') setShowRegistrationForm(false); }}
          >
            <button className="sheet-close" onClick={() => setShowRegistrationForm(false)} aria-label="Tutup form">
              <X />
            </button>
            <RegistrationForm onClose={() => setShowRegistrationForm(false)} />
          </section>
        </div>
      )}

      {/* GALLERY VIEWER MODAL */}
      {galleryImage && (
        <div className="modal-backdrop gallery-backdrop" onMouseDown={() => setGalleryImage(null)}>
          <section 
            className="gallery-viewer" 
            role="dialog" 
            aria-modal="true" 
            aria-label="Foto dokumentasi kegiatan" 
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="sheet-close" onClick={() => setGalleryImage(null)} aria-label="Tutup foto">
              <X />
            </button>
            <img src={galleryImage} alt="Dokumentasi kegiatan Pulangkesinii dalam ukuran besar" />
            <p>Momen kebaikan bersama Pulangkesinii.</p>
          </section>
        </div>
      )}

      {/* LEGAL MODAL */}
      {legal && (
        <div className="modal-backdrop" onMouseDown={() => setLegal(null)}>
          <section 
            className="legal-sheet" 
            role="dialog" 
            aria-modal="true" 
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="sheet-close" onClick={() => setLegal(null)} aria-label="Tutup">
              <X />
            </button>
            <HouseIcon className="brand-symbol" weight="duotone" aria-hidden="true" />
            <h2>{legal === 'terms' ? 'Syarat & Ketentuan' : 'Kebijakan Privasi'}</h2>
            <p>Dokumen resmi masih menunggu verifikasi tim Pulangkesinii. Halaman ini disiapkan sebagai state sementara dan tidak menetapkan kebijakan baru.</p>
            <a href="mailto:pulangkesinii@gmail.com">Hubungi Pulangkesinii</a>
          </section>
        </div>
      )}
    </div>
  );
}
