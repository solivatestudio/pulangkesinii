import { useEffect, useMemo, useRef, useState } from 'react';
import { CameraIcon } from '@phosphor-icons/react/dist/csr/Camera';
import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass';
import { HandshakeIcon as PhosphorHandshakeIcon } from '@phosphor-icons/react/dist/csr/Handshake';
import { HeartIcon } from '@phosphor-icons/react/dist/csr/Heart';
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House';
import { PlantIcon } from '@phosphor-icons/react/dist/csr/Plant';
import { ShieldCheckIcon } from '@phosphor-icons/react/dist/csr/ShieldCheck';
import { SparkleIcon } from '@phosphor-icons/react/dist/csr/Sparkle';
import { CalendarDays, ChevronDown, ChevronRight, Globe2, HandHeart, Handshake, HelpCircle, Instagram, Linkedin, Mail, MapPin, MessageCircle, Route, Search, Tag, X } from 'lucide-react';

type Activity = { id:number; category:string; city:string; color:string; photo:string };
const places = ['Semua', 'Jabodetabek', 'Bandung', 'Jogja'];
const catalogue: Activity[] = [
  { id:1, category:'Volunteer', city:'Jabodetabek', color:'cyan', photo:'/images/web/activity-04.webp' },
  { id:2, category:'Voluntrip', city:'Bandung', color:'blue', photo:'/images/web/activity-09.webp' },
  { id:3, category:'Fun Activity', city:'Jogja', color:'coral', photo:'/images/web/activity-14.webp' },
];
const galleryPhotos = Array.from({ length:15 },(_,index)=>`/images/web/activity-${String(index+1).padStart(2,'0')}.webp`);
const faqItems = [
  'Siapa saja yang boleh ikut kegiatan Pulangkesinii?',
  'Bagaimana cara mendaftar kegiatan?',
  'Apakah kegiatan berbayar atau gratis?',
  'Apakah peserta mendapatkan sertifikat?',
  'Bagaimana cara menjadi partner atau berkolaborasi?',
];

function ActivityCard({ compact=false, item, onOpen }: { compact?:boolean; item:Activity; onOpen:(item:Activity)=>void; key?:number }) {
  return <article className={`activity-card ${compact?'compact-card':''}`}>
    <button className="card-link" aria-label={`Lihat detail ${item.category}`} onClick={()=>onOpen(item)}/>
    <div className={`activity-cover cover-${item.color} photo-cover`}>
      <img src={item.photo} alt={`Dokumentasi kegiatan ${item.category} Pulangkesinii`} loading="lazy"/>
      <span className="placeholder-label">Dokumentasi kegiatan</span>
      <div className="cover-copy"><small>{item.category} · {item.city}</small><strong>Jadwal berikutnya<br/>segera hadir</strong></div>
    </div>
    <div className="activity-info"><h3>[Judul Kegiatan]</h3><div className="activity-meta"><span><CalendarDays/> [Tanggal Pelaksanaan]</span><span><Tag/> [Biaya/Gratis]</span></div></div>
  </article>;
}

export default function App(){
  const [query,setQuery]=useState('');
  const [place,setPlace]=useState('Semua');
  const [showAll,setShowAll]=useState(false);
  const [promo,setPromo]=useState(0);
  const [selected,setSelected]=useState<Activity|null>(null);
  const [openFaq,setOpenFaq]=useState<number|null>(null);
  const [legal,setLegal]=useState<'terms'|'privacy'|null>(null);
  const [galleryImage,setGalleryImage]=useState<string|null>(null);
  const promoRef=useRef<HTMLDivElement>(null);
  const filtered=useMemo(()=>catalogue.filter(i=>(place==='Semua'||i.city===place)&&(!query.trim()||`${i.category} ${i.city}`.toLowerCase().includes(query.toLowerCase()))),[query,place]);

  useEffect(()=>{document.body.style.overflow=selected||legal||galleryImage?'hidden':'';return()=>{document.body.style.overflow=''}},[selected,legal,galleryImage]);
  useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setSelected(null);setLegal(null);setGalleryImage(null)}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
  const changePromo=(index:number)=>{setPromo(index);const el=promoRef.current;if(el)el.scrollTo({left:index*el.clientWidth,behavior:'smooth'})};

  return <div className="page-stage"><a className="skip-link" href="#kegiatan">Lewati ke daftar kegiatan</a><main className="mobile-shell">
    <section className="brand-header"><div className="brand-lockup"><img src="/assets/logo-palette.png" alt="Logo Pulangkesinii"/></div><h1>Setiap Kebaikan Selalu<br/>Punya Tempat Pulang</h1><label className="search-bar"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Mulai pencarian kegiatan di sini" aria-label="Cari kegiatan"/></label></section>

    <section className="promo-wrap" aria-label="Informasi Pulangkesinii"><div className="promo-rail" ref={promoRef} onScroll={e=>{const el=e.currentTarget;setPromo(Math.round(el.scrollLeft/Math.max(1,el.clientWidth)))}}><article className="promo-card"><div className="promo-copy"><small>Ruang untuk berbuat baik</small><h2>Pulang, bertemu,<br/>dan bertumbuh.</h2><p>Temukan kegiatan volunteer, voluntrip, dan aktivitas sosial bersama Pulangkesinii.</p></div><img src="/assets/star-blue.png" alt="Maskot biru Pulangkesinii"/><img src="/assets/star-yellow.png" alt="Maskot kuning Pulangkesinii"/></article><article className="promo-card second"><div className="promo-copy"><small>Program komunitas</small><h2>Banyak cara untuk<br/>pulang lewat kebaikan.</h2><p>Berbagi pengalaman dan menciptakan cerita bermakna bersama.</p></div><img src="/assets/decor-5.png" alt="Karakter Pulangkesinii"/></article></div><div className="dots">{[0,1].map(i=><button key={i} className={promo===i?'active':''} onClick={()=>changePromo(i)} aria-label={`Banner ${i+1}`}/>)}</div></section>

    <section className="urgent-section" id="kegiatan"><h2>Segera Berakhir</h2><div className="urgent-rail">{catalogue.slice(0,2).map(i=><ActivityCard key={i.id} item={i} compact onOpen={setSelected}/>)}</div></section>
    <section className="latest-section"><h2>Jelajahi Kegiatan Terbaru</h2><div className="place-tabs" aria-label="Filter wilayah">{places.map(p=><button key={p} className={place===p?'active':''} onClick={()=>setPlace(p)}>{p}</button>)}</div><div className="latest-list">{filtered.slice(0,showAll?3:2).map(i=><ActivityCard key={i.id} item={i} onOpen={setSelected}/>)}</div>{!filtered.length&&<div className="empty-result"><Search/><strong>Belum menemukan kegiatan yang cocok.</strong><p>Coba kata kunci atau wilayah lain.</p><button onClick={()=>{setQuery('');setPlace('Semua')}}>Reset pencarian</button></div>}<button className="more-button" disabled={!filtered.length} onClick={()=>setShowAll(!showAll)}>{showAll?'Tampilkan lebih sedikit':'Lihat lebih banyak'}</button><div className="availability-note"><HelpCircle/><div><strong>Perjalanan berikutnya sedang kami siapkan.</strong><p>Data kegiatan aktif belum diberikan. Hubungi kanal resmi untuk informasi terbaru.</p><a href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii%2C%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer%20yang%20tersedia." target="_blank" rel="noreferrer">Tanya kegiatan <ChevronRight/></a></div></div></section>

    <section className="about-section" id="tentang"><img className="about-stars" src="/assets/decor-2.png" alt=""/><div className="section-label">Tentang Pulangkesinii</div><img className="about-mascot" src="/assets/star-yellow.png" alt="Maskot bintang kuning Pulangkesinii"/><h2>Ruang untuk berbuat baik, bertemu, dan bertumbuh.</h2><p>Pulangkesinii adalah komunitas sosial yang menjadi ruang bagi anak muda untuk berbuat baik, bertemu orang-orang baru, bertumbuh, dan menciptakan dampak positif melalui kegiatan volunteer, voluntrip, serta kolaborasi sosial.</p><blockquote>“Pulang” bukan hanya kembali ke sebuah bangunan, tetapi kembali pada rasa nyaman, rasa memiliki, dan keyakinan bahwa kita tidak berjalan sendirian.</blockquote></section>
    <section className="story-section"><img className="story-decor" src="/assets/decor-3.png" alt=""/><span className="mini-kicker">Our Story</span><h2>Berawal dari satu pertanyaan sederhana...</h2><p>Bagaimana jika ada sebuah tempat di mana anak muda bisa berbuat baik, bertemu orang-orang baru tanpa harus merasa sendiri, lalu pulang dengan versi dirinya yang lebih baik?</p><div className="birth-date"><strong>02.08.2025</strong><span>Pulangkesinii lahir sebagai ruang untuk berbagi kebaikan dan menciptakan pengalaman sosial yang bermakna bersama.</span></div></section>

    <section className="moments-section" aria-labelledby="moments-title"><div className="moments-heading"><div className="simple-heading"><span>Cerita dalam gambar</span><h2 id="moments-title">Momen Kebaikan</h2></div><CameraIcon className="brand-symbol" weight="duotone" aria-hidden="true"/></div><p>Potret perjalanan, pertemuan, dan kebaikan yang pernah kami jalani bersama.</p><div className="moments-rail">{galleryPhotos.map((photo,index)=>{const tileClass=index===3?'featured':index===8||index===11?'wide':index===13?'tall':'';return <button key={photo} className={tileClass} onClick={()=>setGalleryImage(photo)} aria-label={`Buka foto dokumentasi ${index+1}`}><img src={photo} alt={`Dokumentasi kegiatan Pulangkesinii ${index+1}`} loading="lazy"/></button>})}</div><small>Geser untuk melihat semua foto · ketuk untuk memperbesar</small></section>

    <section className="program-section"><img className="program-decor" src="/assets/decor-4.png" alt=""/><div className="simple-heading"><span>Yang bisa kamu ikuti</span><h2>Program Pulangkesinii</h2></div><div className="program-list"><article><i><HandHeart/></i><div><h3>Community Event Volunteer</h3><p>Kegiatan sosial tematik di berbagai ruang pengabdian.</p><a href="#kegiatan">Lihat kegiatan <ChevronRight/></a></div></article><article><i><Route/></i><div><h3>Community Event Voluntrip</h3><p>Berbagi sambil menjelajah, belajar, dan membangun pengalaman bermakna.</p><a href="#kegiatan">Jelajahi voluntrip <ChevronRight/></a></div></article><article><i><Handshake/></i><div><h3>Partnership Program</h3><p>Kolaborasi bersama perusahaan, organisasi, institusi, media, dan komunitas.</p><a href="mailto:pulangkesinii@gmail.com">Ajak kami berkolaborasi <ChevronRight/></a></div></article></div></section>

    <section className="values-section"><div className="simple-heading"><span>Yang kami jaga</span><h2>Nilai Pulangkesinii</h2></div><div className="value-grid"><span><HeartIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Empathy</span><span><PhosphorHandshakeIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Collaboration</span><span><PlantIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Growth</span><span><SparkleIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Impact</span><span><ShieldCheckIcon className="brand-symbol" weight="duotone" aria-hidden="true"/>Integrity</span></div></section>
    <section className="vision-section"><div><CompassIcon className="brand-symbol" weight="duotone" aria-hidden="true"/><span>Visi</span><p>Menjadi komunitas sosial yang menginspirasi generasi muda untuk bertumbuh, berbagi, dan menciptakan dampak positif melalui aksi nyata yang berkelanjutan.</p></div><details><summary>Misi Pulangkesinii <ChevronDown/></summary><ol><li>Menjadi ruang aman bagi anak muda untuk berkembang melalui kegiatan sosial.</li><li>Mendorong budaya volunteer yang inklusif dan menyenangkan.</li><li>Menghubungkan individu dan komunitas dalam kolaborasi sosial.</li><li>Menghadirkan program sosial yang kreatif dan edukatif.</li><li>Membangun kepedulian sosial sebagai bagian dari gaya hidup.</li></ol></details></section>
    <section className="reach-section"><MapPin/><div><span>Ruang kebaikan terus bertumbuh</span><h2>Jabodetabek · Bandung · Jogja · Solo · Malang · Surabaya</h2><p>Daftar wilayah ini masih menunggu verifikasi status aktif sebelum dipublikasikan sebagai lokasi kegiatan.</p></div></section>

    <section className="faq-section"><div className="simple-heading"><span>Yang sering ditanyakan</span><h2>Pertanyaan umum</h2></div>{faqItems.map((q,i)=><article key={q}><button aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span>{q}</span><ChevronDown/></button>{openFaq===i&&<p>Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.</p>}</article>)}</section>
    <section className="contact-section" id="kontak"><img className="contact-main" src="/assets/star-blue.png" alt="Maskot bintang biru Pulangkesinii"/><img className="contact-decor" src="/assets/decor-1.png" alt=""/><span className="mini-kicker">Hubungi kami</span><h2>Mau tanya kegiatan atau bikin kolaborasi?</h2><p>Tim Pulangkesinii akan membantu mengarahkanmu ke informasi yang tepat.</p><a className="wa-button" href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii%2C%20saya%20ingin%20bertanya%20tentang%20kegiatan%20volunteer%20yang%20tersedia." target="_blank" rel="noreferrer"><MessageCircle/> Chat WhatsApp</a><div className="contact-list"><a href="mailto:pulangkesinii@gmail.com"><Mail/><span><small>Email</small>Pulangkesinii@gmail.com</span></a><div><Instagram/><span><small>Instagram</small>@pulangkesinii</span></div><div><span className="text-icon">Tt</span><span><small>TikTok</small>@Pulangkesinii_</span></div><div><Linkedin/><span><small>LinkedIn</small>Pulangkesinii</span></div><div><span className="text-icon">@</span><span><small>Threads</small>@Pulangkesinii</span></div><div><MapPin/><span><small>Basecamp</small>Jakarta Timur</span></div></div></section>

    <footer><nav><a href="#tentang">Tentang Pulangkesinii</a><span>|</span><button onClick={()=>setLegal('terms')}>Syarat & Ketentuan</button><span>|</span><a href="#kontak">Pusat Bantuan</a></nav><div className="socials"><span><Instagram/></span><span><Linkedin/></span><a href="mailto:pulangkesinii@gmail.com"><Mail/></a><span><MapPin/></span></div><button className="privacy-link" onClick={()=>setLegal('privacy')}>Kebijakan Privasi</button><p>Copyright © {new Date().getFullYear()} Pulangkesinii. All Rights Reserved</p></footer>
  </main>

  {selected&&<div className="modal-backdrop" onMouseDown={()=>setSelected(null)}><section className="detail-sheet" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={e=>e.stopPropagation()}><button className="sheet-close" onClick={()=>setSelected(null)} aria-label="Tutup detail"><X/></button><div className={`sheet-cover cover-${selected.color} photo-cover`}><img src={selected.photo} alt={`Dokumentasi kegiatan ${selected.category} Pulangkesinii`}/><span>{selected.category} · {selected.city}</span></div><h2 id="detail-title">[Judul Kegiatan]</h2><div className="sheet-meta"><span><CalendarDays/>[Tanggal Pelaksanaan]</span><span><MapPin/>[Lokasi]</span><span><Tag/>[Biaya/Gratis]</span></div><h3>Tentang kegiatan</h3><p>Deskripsi, rundown, benefit, persyaratan, dan informasi pendaftaran akan ditampilkan setelah data kegiatan resmi tersedia.</p><a href="https://wa.me/6285779321681?text=Halo%20Pulangkesinii%2C%20saya%20ingin%20bertanya%20tentang%20kegiatan%20yang%20tersedia." target="_blank" rel="noreferrer">Tanya kegiatan via WhatsApp</a></section></div>}
  {galleryImage&&<div className="modal-backdrop gallery-backdrop" onMouseDown={()=>setGalleryImage(null)}><section className="gallery-viewer" role="dialog" aria-modal="true" aria-label="Foto dokumentasi kegiatan" onMouseDown={e=>e.stopPropagation()}><button className="sheet-close" onClick={()=>setGalleryImage(null)} aria-label="Tutup foto"><X/></button><img src={galleryImage} alt="Dokumentasi kegiatan Pulangkesinii dalam ukuran besar"/><p>Momen kebaikan bersama Pulangkesinii.</p></section></div>}
  {legal&&<div className="modal-backdrop" onMouseDown={()=>setLegal(null)}><section className="legal-sheet" role="dialog" aria-modal="true" onMouseDown={e=>e.stopPropagation()}><button className="sheet-close" onClick={()=>setLegal(null)} aria-label="Tutup"><X/></button><HouseIcon className="brand-symbol" weight="duotone" aria-hidden="true"/><h2>{legal==='terms'?'Syarat & Ketentuan':'Kebijakan Privasi'}</h2><p>Dokumen resmi masih menunggu verifikasi tim Pulangkesinii. Halaman ini disiapkan sebagai state sementara dan tidak menetapkan kebijakan baru.</p><a href="mailto:pulangkesinii@gmail.com">Hubungi Pulangkesinii</a></section></div>}
  </div>;
}
