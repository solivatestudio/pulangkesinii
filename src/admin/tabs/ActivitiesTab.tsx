import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  X, 
  Check, 
  Upload, 
  Sparkles,
  ExternalLink,
  Search,
  Eye
} from 'lucide-react';
import { uploadFiles } from '../../utils/uploadthing';
import { optimizeImageToWebp } from '../../utils/imageOptimizer';
import { PublicActivityCard } from '../../components/PublicActivityCard';
import { notify } from '../../utils/notifications';

const cities = ['Jakarta', 'Bekasi', 'Depok', 'Tangerang', 'Bogor', 'Bandung', 'Jogja', 'Solo', 'Malang', 'Surabaya'];
const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID').format(value || 0);
const todayInJakarta = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || '';
  return `${value('year')}-${value('month')}-${value('day')}`;
};
const formatDateId = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
  : value;
const toDateInput = (value?: string) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const months: Record<string, string> = { januari:'01', februari:'02', maret:'03', april:'04', mei:'05', juni:'06', juli:'07', agustus:'08', september:'09', oktober:'10', november:'11', desember:'12' };
  const match = value.toLowerCase().match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
  return match && months[match[2]] ? `${match[3]}-${months[match[2]]}-${match[1].padStart(2, '0')}` : '';
};

interface ActivityItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  status: 'open' | 'closing_soon' | 'full' | 'completed';
  coverImage: string;
  locationName: string;
  city: string;
  address: string;
  mapUrl?: string;
  startDate: string;
  endDate: string;
  activityTime: string;
  price: number;
  priceLabel: string;
  quota: number;
  quotaFilled: number;
  requirements: string[];
  contactPerson: { name: string; role: string; whatsapp: string };
  whatsappGroupUrl?: string;
  urgentClosing?: boolean;
}

export const ActivitiesTab: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [contactWhatsappError, setContactWhatsappError] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const whatsappFormat = /^(?:628|08)\d{7,12}$/;
  const whatsappFormatMessage = 'Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx tanpa tanda +, spasi, atau simbol.';

  useEffect(() => {
    if (!isModalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isModalOpen]);

  // Form states
  const [formData, setFormData] = useState<Partial<ActivityItem>>({
    title: '',
    category: '',
    status: undefined,
    city: '',
    locationName: '',
    address: '',
    mapUrl: '',
    startDate: '',
    endDate: '',
    activityTime: '',
    price: undefined,
    priceLabel: '',
    quota: undefined,
    quotaFilled: undefined,
    shortDescription: '',
    description: '',
    coverImage: '',
    requirements: [],
    contactPerson: { name: '', role: '', whatsapp: '' },
    whatsappGroupUrl: '',
    urgentClosing: false,
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/activities');
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load activities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openCreateModal = () => {
    setEditingActivity(null);
    setContactWhatsappError('');
    setFormData({
      title: '',
      category: '',
      status: undefined,
      city: '',
      locationName: '',
      address: '',
      mapUrl: '',
      startDate: '',
      endDate: '',
      activityTime: '',
      price: undefined,
      priceLabel: '',
      quota: undefined,
      quotaFilled: undefined,
      shortDescription: '',
      description: '',
      coverImage: '',
      requirements: [],
      contactPerson: { name: '', role: '', whatsapp: '' },
      whatsappGroupUrl: '',
      urgentClosing: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (act: ActivityItem) => {
    setEditingActivity(act);
    setContactWhatsappError('');
    setFormData({ ...act, startDate: toDateInput(act.startDate), endDate: toDateInput(act.endDate), activityTime: act.activityTime || '', whatsappGroupUrl: act.whatsappGroupUrl || '' });
    setIsModalOpen(true);
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const webpFile = await optimizeImageToWebp(file, { maxSizeMB: 4, quality: 0.85 });
      const result = await uploadFiles('mediaUploader', { files: [webpFile] });
      const uploadedUrl = result?.[0]?.ufsUrl || result?.[0]?.url;
      if (!uploadedUrl) throw new Error('URL gambar tidak diterima');
      setFormData((previous) => ({ ...previous, coverImage: uploadedUrl }));
      notify('Gambar sampul berhasil diunggah (teroptimasi ke WebP).');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      notify(`Upload gagal: ${message}`, 'error');
    } finally {
      setUploadingCover(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus kegiatan "${title}"?`)) return;
    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActivities(activities.filter((a) => a.id !== id));
      } else {
        notify('Kegiatan belum bisa dihapus. Coba lagi.', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Koneksi bermasalah. Periksa internet lalu coba lagi.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = todayInJakarta();
    if (!formData.startDate) {
      notify('Tidak dapat menyimpan: tanggal pelaksanaan wajib diisi.', 'error');
      return;
    }
    if (formData.startDate < today) {
      notify('Tidak dapat menyimpan: tanggal pelaksanaan tidak boleh sudah lewat.', 'error');
      return;
    }
    if (!formData.activityTime?.trim()) {
      notify('Tidak dapat menyimpan: waktu kegiatan wajib diisi.', 'error');
      return;
    }
    if (formData.price === undefined) {
      notify('Tidak dapat menyimpan: biaya wajib diisi. Masukkan 0 jika kegiatan gratis.', 'error');
      return;
    }
    const whatsapp = formData.contactPerson?.whatsapp.trim() || '';
    if (whatsapp && !whatsappFormat.test(whatsapp)) {
      setContactWhatsappError(whatsappFormatMessage);
      notify(`Tidak dapat menyimpan: ${whatsappFormatMessage}`, 'error');
      return;
    }
    setContactWhatsappError('');
    setSaving(true);
    try {
      const method = editingActivity ? 'PUT' : 'POST';
      const endpoint = editingActivity ? `/api/activities/${editingActivity.id}` : '/api/activities';

      const payload = {
        id: formData.id, slug: formData.slug, title: formData.title, shortDescription: formData.shortDescription,
        description: formData.description || '', category: formData.category, status: formData.status,
        coverImage: formData.coverImage, locationName: formData.locationName,
        city: formData.city, address: formData.address || '', mapUrl: formData.mapUrl || '', startDate: formData.startDate,
        endDate: formData.startDate,
        activityTime: formData.activityTime.trim(),
        price: formData.price, priceLabel: formData.price === 0 ? 'Gratis' : `Rp ${formatRupiah(formData.price)}`,
        quota: formData.quota || 50, quotaFilled: formData.quotaFilled || 0,
        requirements: formData.requirements || [], contactPerson: formData.contactPerson ? { ...formData.contactPerson, whatsapp } : null, whatsappGroupUrl: formData.whatsappGroupUrl?.trim(),
        urgentClosing: Boolean(formData.urgentClosing),
      };
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchActivities();
      } else {
        const data = await res.json();
        const detail = Array.isArray(data.details) ? data.details[0]?.message : '';
        notify(`Tidak dapat menyimpan: ${detail || data.error || 'terjadi kesalahan.'}`, 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Tidak dapat menyimpan: koneksi bermasalah. Periksa internet lalu coba lagi.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = activities.filter((act) => {
    const matchCat = selectedCategory === 'Semua' || act.category === selectedCategory;
    const matchSearch =
      !search ||
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.city.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div>
          <h2 className="admin-title text-2xl text-[#173F42]">Manajemen Kegiatan</h2>
          <p className="text-xs text-[#6B7E82] mt-1">
            Kelola judul, tanggal, harga, foto cover, kuota, dan status kegiatan
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="h-10 px-4 bg-[#0EADAD] hover:bg-[#0C9696] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kegiatan Baru</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8FA3A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama kegiatan atau kota..."
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
          />
        </div>
        <div className="hide-horizontal-scrollbar flex w-full items-center gap-1.5 overflow-x-auto sm:w-auto">
          {['Semua', 'Volunteer', 'Voluntrip', 'Fun Activity', 'Pendidikan', 'Social Care', 'Lingkungan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0EADAD] text-white'
                  : 'bg-white text-[#4A5D61] border border-[#D5DFE0] hover:bg-[#F0F7F7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Table/Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-[#6B7E82]">
          Menyiapkan daftar kegiatan...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-[#6B7E82] border border-[#E0F2F1]">
          Belum ada kegiatan yang cocok dengan pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((act) => (
            <div key={act.id} className="flex flex-col gap-3">
              <PublicActivityCard
                item={{
                  id: act.id,
                  category: act.category,
                  city: act.city,
                  locationName: act.locationName,
                  photo: act.coverImage,
                  title: act.title,
                  startDate: formatDateId(act.startDate),
                  priceLabel: act.priceLabel,
                  shortDescription: act.shortDescription,
                }}
              />
              <div className="flex items-center justify-between px-1">
                <a
                  href={`/`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-[#6B7E82] hover:text-[#0EADAD] flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Lihat di web
                </a>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(act)}
                    className="h-8 px-2.5 bg-[#F0F7F7] hover:bg-[#E0F7F6] text-[#0EADAD] text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(act.id, act.title)}
                    className="h-8 px-2.5 bg-[#FFF2F0] hover:bg-[#FFEBE8] text-[#CF1322] text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Tambah / Edit Kegiatan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#E0F2F1] my-4">
            <div className="px-6 py-4 border-b border-[#F0F7F7] flex items-center justify-between bg-[#FAFAFA]">
              <h3 className="font-bold text-sm sm:text-base text-[#173F42]">
                {editingActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form noValidate onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-bold text-[#26383C] mb-1">Nama / Judul Kegiatan *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Volunteer Batch 44 — Semesta Senyum & Ruang Ceria"
                  className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Kategori *</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-2.5 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  ><option value="" disabled>Pilih kategori</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Voluntrip">Voluntrip</option>
                    <option value="Fun Activity">Fun Activity</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Social Care">Social Care</option>
                    <option value="Lingkungan">Lingkungan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Kota / Wilayah *</label>
                  <select
                    value={formData.city || ''}
                    onChange={(e) => {
                      const city = e.target.value;
                      const currentAddress = (formData.address || '').trim();
                      setFormData({ ...formData, city, address: cities.includes(currentAddress) ? '' : formData.address });
                    }}
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none bg-white"
                    required
                  ><option value="" disabled>Pilih kota / wilayah</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select>
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Status Kegiatan</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-10 px-2.5 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  ><option value="" disabled>Pilih status</option>
                    <option value="open">Open (Terbuka)</option>
                    <option value="closing_soon">Closing Soon (Segera Berakhir)</option>
                    <option value="full">Full (Penuh)</option>
                    <option value="completed">Completed (Selesai)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-[#DDEDEC] bg-[#F8FCFC] p-4 space-y-3">
                <div><h4 className="font-bold text-[#173F42]">Detail Lokasi</h4><p className="text-[11px] text-[#6B7E82]">Informasi ini ditampilkan pada detail kegiatan di website publik.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-[#26383C] mb-1">Nama Lokasi *</label><input type="text" required value={formData.locationName || ''} onChange={(e) => setFormData({ ...formData, locationName: e.target.value })} placeholder="Contoh: Panti Asuhan Pelita Kasih" className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none" /></div>
                <div><label className="block font-bold text-[#26383C] mb-1">Tautan Google Maps</label><input type="url" value={formData.mapUrl || ''} onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })} placeholder="https://maps.google.com/..." className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none" /></div>
                <div className="sm:col-span-2"><label className="block font-bold text-[#26383C] mb-1">Alamat Lengkap *</label><textarea required rows={2} value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder={`Contoh: Jl. ..., ${formData.city || 'Jakarta'}`} className="w-full p-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none" /><p className="mt-1 text-[11px] text-[#6B7E82]">Pastikan alamat berada di wilayah {formData.city || 'yang dipilih'}.</p></div>
                </div>
              </div>

              {/* Tanggal & Jam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Tanggal Pelaksanaan *</label>
                  <input
                    type="date"
                    min={todayInJakarta()}
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  />
                  {formData.startDate && <p className="mt-1 text-[11px] text-[#0EADAD] font-semibold">{formatDateId(formData.startDate)}</p>}
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Jam Kegiatan *</label>
                  <input
                    type="text"
                    value={formData.activityTime || ''}
                    onChange={(e) => setFormData({ ...formData, activityTime: e.target.value })}
                    placeholder="Contoh: 09.00–12.00 WIB"
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  />
                  <p className="mt-1 text-[11px] text-[#6B7E82]">Isi jam atau rentang waktu kegiatan.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Biaya (0 = Gratis) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#0EADAD]">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.price === undefined ? '' : formatRupiah(formData.price)}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '');
                        const price = digits ? Number(digits) : undefined;
                        setFormData({
                          ...formData,
                          price,
                          priceLabel: price === undefined ? '' : price === 0 ? 'Gratis' : `Rp ${price.toLocaleString('id-ID')}`,
                        });
                      }}
                      placeholder="0 untuk gratis" className="w-full h-10 pl-9 pr-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none font-semibold"
                      required
                    />
                  </div>
                  {formData.price !== undefined && <p className="mt-1 text-[11px] text-[#6B7E82]">{formData.price === 0 ? 'Gratis' : `Rp ${formatRupiah(formData.price)}`}</p>}
                </div>
              </div>

              {/* Kuota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Kuota Maksimal *</label>
                  <input
                    type="number"
                    value={formData.quota ?? ''}
                    onChange={(e) => setFormData({ ...formData, quota: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Contoh: 50"
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Kuota Terisi</label>
                  <input
                    type="number"
                    value={formData.quotaFilled ?? ''}
                    onChange={(e) => setFormData({ ...formData, quotaFilled: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Contoh: 0"
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  />
                </div>
              </div>

              {/* Foto cover */}
              <div>
                <label className="block font-bold text-[#26383C] mb-1">Foto Cover Kegiatan *</label>
                <div className="space-y-3">
                  <div className="w-full aspect-video rounded-xl border border-[#D5DFE0] overflow-hidden bg-gray-50">
                    <img
                      src={formData.coverImage || '/assets/decor-1.png'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.coverImage || ''}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="Masukkan URL foto atau unggah gambar"
                        className="min-w-0 flex-1 h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none text-xs"
                        required
                      />
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*,.heic,.HEIC,.heif,.HEIF"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingCover}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0EADAD] px-2.5 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#0C9696] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>{uploadingCover ? 'Mengunggah...' : 'Pilih Gambar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deskripsi Singkat & Panjang */}
              <div>
                <label className="block font-bold text-[#26383C] mb-1">Deskripsi Singkat (Tampil di Card) *</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Ringkasan aksi kegiatan..."
                  className="w-full p-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#26383C] mb-1">Deskripsi Lengkap (Tampil di Modal Detail)</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Penjelasan detail tujuan dan pengalaman kegiatan..."
                  className="w-full p-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#26383C] mb-1">
                  Tautan / Link Grup WhatsApp Kegiatan *
                </label>
                <input
                  type="url"
                  value={formData.whatsappGroupUrl || ''}
                  onChange={(e) => setFormData({ ...formData, whatsappGroupUrl: e.target.value })}
                  placeholder="Contoh: https://chat.whatsapp.com/..."
                  className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  required
                />
                <p className="mt-1 text-[11px] text-[#6B7E82]">
                  Pendaftar kegiatan ini akan otomatis diarahkan ke grup WhatsApp ini setelah submit formulir.
                </p>
              </div>

              {/* Contact Person */}
              <div className="rounded-2xl border border-[#DDEDEC] bg-[#F8FCFC] p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-[#173F42]">Contact Person</h4>
                  <p className="text-[11px] text-[#6B7E82]">Narahubung kegiatan yang bisa dihubungi peserta.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#26383C] mb-1">Nama</label>
                    <input
                      type="text"
                      value={formData.contactPerson?.name || ''}
                      onChange={(e) => setFormData({ ...formData, contactPerson: { ...(formData.contactPerson || { name: '', role: '', whatsapp: '' }), name: e.target.value } })}
                      placeholder="Nama narahubung"
                      className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#26383C] mb-1">Role / Jabatan</label>
                    <input
                      type="text"
                      value={formData.contactPerson?.role || ''}
                      onChange={(e) => setFormData({ ...formData, contactPerson: { ...(formData.contactPerson || { name: '', role: '', whatsapp: '' }), role: e.target.value } })}
                      placeholder="Contoh: Event Coordinator"
                      className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#26383C] mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.contactPerson?.whatsapp || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, contactPerson: { ...(formData.contactPerson || { name: '', role: '', whatsapp: '' }), whatsapp: value } });
                        setContactWhatsappError(value && !whatsappFormat.test(value) ? whatsappFormatMessage : '');
                      }}
                      onBlur={(e) => setContactWhatsappError(e.target.value && !whatsappFormat.test(e.target.value) ? whatsappFormatMessage : '')}
                      placeholder="Contoh: 0857xxxxxxx atau 6285xxxxxxx"
                      aria-invalid={Boolean(contactWhatsappError)}
                      aria-describedby={contactWhatsappError ? 'contact-whatsapp-error' : 'contact-whatsapp-hint'}
                      className={`w-full h-10 px-3 border rounded-xl outline-none ${contactWhatsappError ? 'border-red-500 focus:border-red-500' : 'border-[#D5DFE0] focus:border-[#0EADAD]'}`}
                    />
                    {contactWhatsappError
                      ? <p id="contact-whatsapp-error" className="mt-1 text-[11px] text-red-600" role="alert">{contactWhatsappError}</p>
                      : <p id="contact-whatsapp-hint" className="mt-1 text-[11px] text-[#6B7E82]">Wajib 62/08... — Gunakan format <strong>628xxxxxxxxxx</strong> tanpa +, spasi, atau simbol.</p>
                    }
                  </div>
                </div>
              </div>

              {/* Syarat Mengikuti */}
              <div className="pt-2 border-t border-[#F0F7F7]">
                <label className="block font-bold text-[#26383C] mb-1">Syarat Mengikuti</label>
                <textarea
                  rows={3}
                  value={formData.requirements?.[0] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requirements: e.target.value.trim() ? [e.target.value] : [],
                    })
                  }
                  placeholder="Tulis syarat mengikuti kegiatan..."
                  className="w-full p-2.5 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#F0F7F7] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-[#D5DFE0] text-[#6B7E82] font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Kegiatan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
