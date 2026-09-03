import { useEffect, useMemo, useState } from 'react';
import { CameraIcon } from '@phosphor-icons/react/dist/csr/Camera';
import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { HandshakeIcon as PhosphorHandshakeIcon } from '@phosphor-icons/react/dist/csr/Handshake';
import { HeartIcon } from '@phosphor-icons/react/dist/csr/Heart';
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House';
import { PlantIcon } from '@phosphor-icons/react/dist/csr/Plant';
import { ShieldCheckIcon } from '@phosphor-icons/react/dist/csr/ShieldCheck';
import { SparkleIcon } from '@phosphor-icons/react/dist/csr/Sparkle';
import { CalendarDays, ChevronDown, ChevronRight, Clock, HandHeart, Handshake, HelpCircle, Instagram, Linkedin, Mail, MapPin, Menu, MessageCircle, PackageCheck, Route, Search, Tag, Users, X } from 'lucide-react';
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
  { id: 1, category: 'Volunteer', city: 'Jakarta', color: 'cyan', photo: '/images/web/activity-04.webp', title: '[Judul Kegiatan]', startDate: '[Tanggal Pelaksanaan]', priceLabel: '[Biaya/Gratis]' },
  { id: 2, category: 'Voluntrip', city: 'Bandung', color: 'blue', photo: '/images/web/activity-09.webp', title: '[Judul Kegiatan]', startDate: '[Tanggal Pelaksanaan]', priceLabel: '[Biaya/Gratis]' },
  { id: 3, category: 'Workshop', city: 'Jogja', color: 'coral', photo: '/images/web/activity-14.webp', title: '[Judul Kegiatan]', startDate: '[Tanggal Pelaksanaan]', priceLabel: '[Biaya/Gratis]' },
];

const defaultFaqItems = [
  { question: 'Siapa saja yang boleh ikut kegiatan Pulangkesinii?', answer: 'Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.' },
  { question: 'Bagaimana cara mendaftar kegiatan?', answer: 'Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.' },
  { question: 'Apakah kegiatan berbayar atau gratis?', answer: 'Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.' },
  { question: 'Apakah peserta mendapatkan sertifikat?', answer: 'Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.' },
  { question: 'Bagaimana cara menjadi partner atau berkolaborasi?', answer: 'Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.' },
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

  // Dynamic state that initially preserves exact original public data
  const [catalogue, setCatalogue] = useState<Activity[]>(defaultCatalogue);
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>(defaultFaqItems);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(
    Array.from({ length: 15 }, (_, index) => `/images/web/activity-${String(index + 1).padStart(2, '0')}.webp`)
  );

  useEffect(() => {
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
              photo: item.coverImage || `/images/web/activity-${String(idx + 1).padStart(2, '0')}.webp`,
              title: item.title || '[Judul Kegiatan]',
              startDate: humanizeDate(item.startDate) || '[Tanggal Pelaksanaan]',
              priceLabel: item.priceLabel || '[Biaya/Gratis]',
              locationName: item.locationName || '[Lokasi]',
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
            }))
          );
        }
      })
      .catch(() => {});

    fetch('/api/faqs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqItems(
            data.map((f: any) => ({
              question: f.question,
              answer: f.answer || 'Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.',
            }))
          );
        }
      })
      .catch(() => {});

    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryPhotos(data.map((g: any) => g.imageUrl));
        }
      })
      .catch(() => {});
  }, []);

  const filtered=useMemo(()=>catalogue.filter(i=>(place==='Semua'||i.city===place)&&(category==='Semua'||i.category===category)&&(!query.trim()||`${i.category} ${i.city}`.toLowerCase().includes(query.toLowerCase()))),[catalogue,query,place,category]);

  useEffect(()=>{document.body.style.overflow=selected||legal||galleryImage||showRegistrationForm?'hidden':'';return()=>{document.body.style.overflow=''}},[selected,legal,galleryImage,showRegistrationForm]);
  
  useEffect(()=>{
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27 || e.which === 27) {
        if (showRegistrationForm) {
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
  }, [showRegistrationForm, selected, galleryImage, legal]);
  
  const showSearchResults=()=>document.querySelector('#semua-kegiatan')?.scrollIntoView({behavior:'smooth',block:'start'});

  return <div className="page-stage"><a className="skip-link" href="#kegiatan">Lewati ke daftar kegiatan</a><main className="mobile-shell">
    <section className="brand-header" aria-labelledby="hero-title"><div className="hero-pattern" aria-hidden="true"/><div className="brand-lockup"><img src="/assets/logo-palette.png" alt="Logo Pulangkesinii"/></div><button className="hero-menu-button" type="button" aria-label={menuOpen?'Tutup navigasi':'Buka navigasi'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>{menuOpen&&<nav className="hero-menu" aria-label="Navigasi utama"><a href="#kegiatan" onClick={()=>setMenuOpen(false)}>Kegiatan</a><a href="#tentang" onClick={()=>setMenuOpen(false)}>Tentang kami</a><a href="#kontak" onClick={()=>setMenuOpen(false)}>Kontak</a><a href="/admin" onClick={()=>setMenuOpen(false)}>Portal Admin</a></nav>}<div className="hero-copy"><span className="hero-eyebrow">Temukan ruang untuk berbuat baik</span><h1 id="hero-title"><span>Setiap Kebaikan</span><span>Selalu Punya</span><span>Tempat Pulang</span></h1><img className="hero-mascot-blue" src="/assets/star-blue.png" alt="Maskot biru Pulangkesinii"/><div className="hero-support"><img className="hero-mascot-yellow" src="/assets/star-yellow.png" alt="Maskot kuning Pulangkesinii"/><p>Temukan kegiatan volunteer, voluntrip, dan aktivitas sosial yang sesuai dengan waktu, minat, serta tempat pulangmu.</p></div><form className="search-bar" role="search" onSubmit={e=>{e.preventDefault();showSearchResults()}}><Search aria-hidden="true"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari kegiatan, lokasi, atau tema..." aria-label="Cari kegiatan"/><button type="submit" aria-label="Tampilkan hasil pencarian"><Search/></button></form><div className="hero-filters" aria-label="Filter kategori kegiatan">{categories.map(item=><button key={item} type="button" className={category===item?'active':''} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div></div><div className="hero-wave" aria-hidden="true"><svg viewBox="0 0 1440 150" preserveAspectRatio="none"><path d="M0 112 C170 65 350 30 560 38 C790 47 930 92 1110 67 C1240 49 1340 58 1440 82 L1440 150 L0 150 Z" fill="#FFFFFF"/></svg></div></section>

    <section className="urgent-section" id="kegiatan"><h2>Segera Berakhir</h2><div className="urgent-rail">{catalogue.slice(0,2).map(i=><ActivityCard key={i.id} item={i} compact onOpen={setSelected}/>)}</div></section>
    <section className="latest-section" id="semua-kegiatan"><h2>Jelajahi Kegiatan Terbaru</h2><div className="place-tabs" aria-label="Filter wilayah">{places.map(p=><button key={p} className={place===p?'active':''} onClick={()=>setPlace(p)}>{p}</button>)}</div><div className="latest-list">{filtered.slice(0,showAll?3:2).map(i=><ActivityCard key={i.id} item={i} onOpen={setSelected}/>)}</div>{!filtered.length&&<div className="empty-result"><Search/><strong>Belum menemukan kegiatan yang cocok.</strong><p>Coba kata kunci, kategori, atau wilayah lain.</p><button onClick={()=>{setQuery('');setPlace('Semua');setCategory('Semua')}}>Reset pencarian</button></div>}<button className="more-button" disabled={!filtered.length} onClick={()=>setShowAll(!showAll)}>{showAll?'Tampilkan lebih sedikit':'Lihat lebih banyak'}</button><div className="availability-note"><HelpCircle/><div><strong>Perjalanan berikutnya sedang kami siapkan.</strong><p>Data kegiatan aktif belum diberikan. Hubungi kanal resmi untuk informasi terbaru.</p><a href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii%2C%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer%20yang%20tersedia." target="_blank" rel="noreferrer">Tanya kegiatan <ChevronRight/></a></div></div></section>

    <section className="about-section" id="tentang"><img className="about-stars" src="/assets/decor-2.png" alt=""/><div className="section-label">Tentang Pulangkesinii</div><img className="about-mascot" src="/assets/star-yellow.png" alt="Maskot bintang kuning Pulangkesinii"/><h2>Ruang untuk berbuat baik, bertemu, dan bertumbuh.</h2><p>Pulangkesinii adalah komunitas sosial yang menjadi ruang bagi anak muda untuk berbuat baik, bertemu orang-orang baru, bertumbuh, dan menciptakan dampak positif melalui kegiatan volunteer, voluntrip, serta kolaborasi sosial.</p><blockquote>“Pulang” bukan hanya kembali ke sebuah bangunan, tetapi kembali pada rasa nyaman, rasa memiliki, dan keyakinan bahwa kita tidak berjalan sendirian.</blockquote></section>
    <section className="story-section"><img className="story-decor" src="/assets/decor-3.png" alt=""/><span className="mini-kicker">Our Story</span><h2>Berawal dari satu pertanyaan sederhana...</h2><p>Bagaimana jika ada sebuah tempat di mana anak muda bisa berbuat baik, bertemu orang-orang baru tanpa harus merasa sendiri, lalu pulang dengan versi dirinya yang lebih baik?</p><div className="birth-date"><strong>02.08.2025</strong><span>Pulangkesinii lahir sebagai ruang untuk berbagi kebaikan dan menciptakan pengalaman sosial yang bermakna bersama.</span></div></section>

    <section className="moments-section" aria-labelledby="moments-title"><div className="moments-heading"><div className="simple-heading"><span>Cerita dalam gambar</span><h2 id="moments-title">Momen Kebaikan</h2></div><CameraIcon className="brand-symbol" weight="duotone" aria-hidden="true"/></div><p>Potret perjalanan, pertemuan, dan kebaikan yang pernah kami jalani bersama.</p><div className="moments-rail">{galleryPhotos.map((photo,index)=>{const tileClass=index===3?'featured':index===8||index===11?'wide':index===13?'tall':'';return <button key={photo} className={tileClass} onClick={()=>setGalleryImage(photo)} aria-label={`Buka foto dokumentasi ${index+1}`}><img src={photo} alt={`Dokumentasi kegiatan Pulangkesinii ${index+1}`} loading="lazy"/></button>})}</div><small>Geser untuk melihat semua foto · ketuk untuk memperbesar</small></section>

    <section className="program-section"><img className="program-decor" src="/assets/decor-4.png" alt=""/><div className="simple-heading"><span>Yang bisa kamu ikuti</span><h2>Program Pulangkesinii</h2></div><div className="program-list"><article><i><HandHeart/></i><div><h3>Community Event Volunteer</h3><p>Kegiatan sosial tematik di berbagai ruang pengabdian.</p><a href="#kegiatan">Lihat kegiatan <ChevronRight/></a></div></article><article><i><Route/></i><div><h3>Community Event Voluntrip</h3><p>Berbagi sambil menjelajah, belajar, dan membangun pengalaman bermakna.</p><a href="#kegiatan">Jelajahi voluntrip <ChevronRight/></a></div></article><article><i><Handshake/></i><div><h3>Partnership Program</h3><p>Kolaborasi bersama perusahaan, organisasi, institusi, media, dan komunitas.</p><a href="mailto:pulangkesinii@gmail.com">Ajak kami berkolaborasi <ChevronRight/></a></div></article></div></section>

    <section className="values-section"><div className="simple-heading"><span>Yang kami jaga</span><h2>Nilai Pulangkesinii</h2></div><div className="value-grid"><span><HeartIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Empathy</span><span><PhosphorHandshakeIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Collaboration</span><span><PlantIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Growth</span><span><SparkleIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Impact</span><span><ShieldCheckIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Integrity</span></div></section>
    <section className="vision-section"><div><CompassIcon className="brand-symbol" weight="duotone" aria-hidden="true"/><span>Visi</span><p>Menjadi komunitas sosial yang menginspirasi generasi muda untuk bertumbuh, berbagi, dan menciptakan dampak positif melalui aksi nyata yang berkelanjutan.</p></div><details><summary>Misi Pulangkesinii <ChevronDown/></summary><ul><li>Menjadi ruang aman bagi anak muda untuk berkembang melalui kegiatan sosial.</li><li>Mendorong budaya volunteer yang inklusif dan menyenangkan.</li><li>Menghubungkan individu dan komunitas dalam kolaborasi sosial.</li><li>Menghadirkan program sosial yang kreatif dan edukatif.</li><li>Membangun kepedulian sosial sebagai bagian dari gaya hidup.</li></ul></details></section>
    <section className="reach-section"><MapPin/><div><span>Ruang kebaikan terus bertumbuh</span><h2>Jakarta · Bekasi · Depok · Tangerang · Bogor · Bandung · Jogja · Solo · Malang · Surabaya</h2><p>Daftar wilayah ini masih menunggu verifikasi status aktif sebelum dipublikasikan sebagai lokasi kegiatan.</p></div></section>

    <section className="faq-section"><div className="simple-heading"><span>Yang sering ditanyakan</span><h2>Pertanyaan umum</h2></div>{faqItems.map((q,i)=><article key={q.question || i}><button aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span>{q.question}</span><ChevronDown/></button>{openFaq===i&&<p>{q.answer}</p>}</article>)}</section>
    <section className="contact-section" id="kontak"><img className="contact-main" src="/assets/star-blue.png" alt="Maskot bintang biru Pulangkesinii"/><img className="contact-decor" src="/assets/decor-1.png" alt=""/><span className="mini-kicker">Hubungi kami</span><h2>Mau tanya kegiatan atau bikin kolaborasi?</h2><p>Tim Pulangkesinii akan membantu mengarahkanmu ke informasi yang tepat.</p><a className="wa-button" href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii%2C%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer%20yang%20tersedia." target="_blank" rel="noreferrer"><MessageCircle/> Chat WhatsApp</a><div className="contact-list"><a href="mailto:pulangkesinii@gmail.com"><Mail/><span><small>Email</small>Pulangkesinii@gmail.com</span></a><div><Instagram/><span><small>Instagram</small>@pulangkesinii</span></div><div><span className="text-icon">Tt</span><span><small>TikTok</small>@Pulangkesinii_</span></div><div><Linkedin/><span><small>LinkedIn</small>Pulangkesinii</span></div><div><span className="text-icon">@</span><span><small>Threads</small>@Pulangkesinii</span></div><div><MapPin/><span><small>Basecamp</small>Jakarta Timur</span></div></div></section>

    <footer><nav><a href="#tentang">Tentang Pulangkesinii</a><span>|</span><button onClick={()=>setLegal('terms')}>Syarat & Ketentuan</button><span>|</span><a href="#kontak">Pusat Bantuan</a><span>|</span><a href="/admin">Portal Admin</a></nav><div className="socials"><span><Instagram/></span><span><Linkedin/></span><a href="mailto:pulangkesinii@gmail.com"><Mail/></a><span><MapPin/></span></div><button className="privacy-link" onClick={()=>setLegal('privacy')}>Kebijakan Privasi</button><p>Copyright © {new Date().getFullYear()} Pulangkesinii. All Rights Reserved</p></footer>
  </main>

  {selected&&!showRegistrationForm&&<div className="modal-backdrop" onMouseDown={()=>setSelected(null)}><section className="detail-sheet" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={e=>e.stopPropagation()}>
    <button className="sheet-close" onClick={()=>setSelected(null)} aria-label="Tutup detail"><X/></button>
    <div className={`sheet-cover cover-${selected.color} photo-cover`}><img src={selected.photo} alt={`Dokumentasi kegiatan ${selected.category} Pulangkesinii`}/><span>{selected.category} · {selected.city}</span></div>
    <h2 id="detail-title">{selected.title || '[Judul Kegiatan]'}</h2>
    {selected.shortDescription&&<p className="detail-lead">{selected.shortDescription}</p>}
    <div className="sheet-meta"><span><CalendarDays/>{selected.startDate}{selected.endDate&&selected.endDate!==selected.startDate?` – ${selected.endDate}`:''}</span><span><MapPin/>{meaningful(selected.locationName) || selected.city}</span><span><Tag/>{selected.priceLabel}</span><span><Users/>{selected.quotaFilled || 0}/{selected.quota || 0} peserta</span></div>
    {(publicAddress(selected.address)||meaningful(selected.locationName)||selected.mapUrl)&&<div className="detail-location"><MapPin/><div><strong>{meaningful(selected.locationName) || selected.city}</strong>{publicAddress(selected.address)&&<p>{selected.address}</p>}{selected.mapUrl&&<a href={selected.mapUrl} target="_blank" rel="noopener noreferrer">Buka lokasi di peta ↗</a>}</div></div>}
    <div className="detail-split">
      <div className="detail-split-col"><h3>Deskripsi Acara</h3><p>{selected.description || 'Deskripsi lengkap, rundown kegiatan, dan benefit akan ditampilkan setelah data resmi tersedia.'}</p></div>
      <div className="detail-split-col"><h3>Syarat & Ketentuan</h3><p>Terbuka untuk umum, kuota terbatas tanpa seleksi, dan mematuhi tata tertib kegiatan.</p><a href="https://drive.google.com/file/d/1jFwMZQ45khHNXf9myhwoadQEd3Gc3Myk/view" target="_blank" rel="noopener noreferrer">Kebijakan Biaya Kontribusi ↗</a></div>
    </div>
    <div className="detail-grid">
      {selected.benefits&&selected.benefits.length>0&&<div className="detail-list"><h3>Benefit Volunteer</h3><ul>{selected.benefits.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul></div>}
      {selected.requirements&&selected.requirements.length>0&&<div className="detail-list"><h3>Syarat Mengikuti</h3><ul>{selected.requirements.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul></div>}
      {selected.itemsToBring&&selected.itemsToBring.length>0&&<div className="detail-list"><h3><PackageCheck/> Yang Perlu Dibawa</h3><ul>{selected.itemsToBring.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul></div>}
    </div>
    {selected.rundown&&selected.rundown.length>0&&<div className="detail-section"><h3>Rangkaian Kegiatan</h3><div className="detail-rundown">{selected.rundown.map((item,index)=><div key={`${item.time}-${index}`}><span><Clock/>{item.time}</span><p>{item.activity}</p></div>)}</div></div>}
    {selected.gallery&&selected.gallery.length>0&&<div className="detail-section"><h3>Galeri Kegiatan</h3><div className="detail-gallery">{selected.gallery.map((image,index)=><button key={`${image}-${index}`} onClick={()=>setGalleryImage(image)}><img src={image} alt={`Galeri ${selected.title} ${index+1}`}/></button>)}</div></div>}
    <div className="detail-footer-info">{selected.registrationDeadline&&<span>Batas pendaftaran: <strong>{selected.registrationDeadline}</strong></span>}{selected.contactPerson?.whatsapp&&<a href={`https://wa.me/${selected.contactPerson.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"><MessageCircle/> Hubungi {selected.contactPerson.name}</a>}</div>
    <button type="button" onClick={()=>setShowRegistrationForm(true)} className="detail-sheet-cta">Daftar Sekarang</button>
  </section></div>}
  {showRegistrationForm&&<div className="modal-backdrop" onMouseDown={()=>setShowRegistrationForm(false)}><section ref={el=>{if(el)el.scrollTop=0}} tabIndex={-1} className="detail-sheet form-sheet" role="dialog" aria-modal="true" aria-labelledby="form-modal-title" onMouseDown={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Escape'){setShowRegistrationForm(false)}}}><button className="sheet-close" onClick={()=>setShowRegistrationForm(false)} aria-label="Tutup form"><X/></button><RegistrationForm onClose={()=>setShowRegistrationForm(false)}/></section></div>}
  {galleryImage&&<div className="modal-backdrop gallery-backdrop" onMouseDown={()=>setGalleryImage(null)}><section className="gallery-viewer" role="dialog" aria-modal="true" aria-label="Foto dokumentasi kegiatan" onMouseDown={e=>e.stopPropagation()}><button className="sheet-close" onClick={()=>setGalleryImage(null)} aria-label="Tutup foto"><X/></button><img src={galleryImage} alt="Dokumentasi kegiatan Pulangkesinii dalam ukuran besar"/><p>Momen kebaikan bersama Pulangkesinii.</p></section></div>}
  {legal&&<div className="modal-backdrop" onMouseDown={()=>setLegal(null)}><section className="legal-sheet" role="dialog" aria-modal="true" onMouseDown={e=>e.stopPropagation()}><button className="sheet-close" onClick={()=>setLegal(null)} aria-label="Tutup"><X/></button><HouseIcon className="brand-symbol" weight="duotone" aria-hidden="true"/><h2>{legal==='terms'?'Syarat & Ketentuan':'Kebijakan Privasi'}</h2><p>Dokumen resmi masih menunggu verifikasi tim Pulangkesinii. Halaman ini disiapkan sebagai state sementara dan tidak menetapkan kebijakan baru.</p><a href="mailto:pulangkesinii@gmail.com">Hubungi Pulangkesinii</a></section></div>}
  </div>;
}
