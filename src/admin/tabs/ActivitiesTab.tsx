import React, { useState, useEffect } from 'react';
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
import { UploadButton } from '../../utils/uploadthing';
import { PublicActivityCard } from '../../components/PublicActivityCard';

interface ActivityItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  status: 'open' | 'closing_soon' | 'full' | 'completed';
  coverImage: string;
  gallery: string[];
  locationName: string;
  city: string;
  address: string;
  mapUrl?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  price: number;
  priceLabel: string;
  quota: number;
  quotaFilled: number;
  batchNumber: number;
  benefits: string[];
  requirements: string[];
  itemsToBring: string[];
  rundown: { time: string; activity: string }[];
  contactPerson: { name: string; role: string; whatsapp: string };
  featured?: boolean;
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

  // Form states
  const [formData, setFormData] = useState<Partial<ActivityItem>>({
    title: '',
    category: 'Volunteer',
    status: 'open',
    city: 'Jakarta',
    locationName: '',
    address: '',
    mapUrl: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    price: 0,
    priceLabel: 'Gratis',
    quota: 50,
    quotaFilled: 0,
    batchNumber: 1,
    shortDescription: '',
    description: '',
    coverImage: '/assets/decor-1.png',
    gallery: [],
    benefits: ['E-Sertifikat Resmi', 'Relasi Komunitas', 'Konsumsi & Snack'],
    requirements: ['Usia 17 - 30 tahun', 'Komitmen hadir penuh'],
    itemsToBring: ['Tumbler air minum', 'Pakaian bernuansa cerah/krem'],
    rundown: [{ time: '13:00 - 15:00', activity: 'Sesi utama kegiatan' }],
    contactPerson: { name: 'Admin Humas', role: 'Event Coordinator', whatsapp: '6285779321681' },
    featured: false,
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
    setFormData({
      title: '',
      category: 'Volunteer',
      status: 'open',
      city: 'Jakarta',
      locationName: 'Panti / Ruang Belajar',
      address: 'Jakarta',
      mapUrl: 'https://maps.google.com',
      startDate: '20 Oktober 2026',
      endDate: '21 Oktober 2026',
      registrationDeadline: '15 Oktober 2026',
      price: 0,
      priceLabel: 'Gratis',
      quota: 50,
      quotaFilled: 0,
      batchNumber: 44,
      shortDescription: 'Deskripsi singkat kegiatan volunteer...',
      description: 'Deskripsi lengkap kegiatan yang akan diselenggarakan oleh Pulangkesinii...',
      coverImage: '/images/web/activity-04.webp',
      gallery: [],
      benefits: ['E-Sertifikat Resmi', 'Teman & Relasi Baru', 'Dokumentasi & Snack'],
      requirements: ['Terbuka untuk umum (15-30 tahun)', 'Memiliki empati & senyum ramah'],
      itemsToBring: ['Tumbler minum pribadi', 'Pakaian nyaman'],
      rundown: [{ time: '13:00 - 16:00', activity: 'Sesi pengabdian dan keceriaan bersama' }],
      contactPerson: { name: 'Kak Humas', role: 'Event Coordinator', whatsapp: '6285779321681' },
      featured: false,
      urgentClosing: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (act: ActivityItem) => {
    setEditingActivity(act);
    setFormData(act);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus kegiatan "${title}"?`)) return;
    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActivities(activities.filter((a) => a.id !== id));
      } else {
        alert('Gagal menghapus kegiatan');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingActivity ? 'PUT' : 'POST';
      const endpoint = editingActivity ? `/api/activities/${editingActivity.id}` : '/api/activities';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchActivities();
      } else {
        const data = await res.json();
        alert('Gagal menyimpan kegiatan: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan');
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
            Kelola judul, tanggal, harga, foto cover, kuota, rundown, dan status kegiatan
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
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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
          Memuat data kegiatan dari Neon DB...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-[#6B7E82] border border-[#E0F2F1]">
          Belum ada kegiatan yang cocok dengan pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-[#E0F2F1] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="p-3 bg-[#eef8f7]"><PublicActivityCard item={{ id: act.id, category: act.category, city: act.city, photo: act.coverImage, title: act.title, startDate: act.startDate, priceLabel: act.priceLabel }} /></div>
              <div className="p-4">
                <div className="pt-2 flex items-center justify-between border-t border-[#F0F7F7]">
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

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
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
                    value={formData.category || 'Volunteer'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-2.5 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  >
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
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Jakarta / Bandung / dll."
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Status Kegiatan</label>
                  <select
                    value={formData.status || 'open'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-10 px-2.5 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  >
                    <option value="open">Open (Terbuka)</option>
                    <option value="closing_soon">Closing Soon (Segera Berakhir)</option>
                    <option value="full">Full (Penuh)</option>
                    <option value="completed">Completed (Selesai)</option>
                  </select>
                </div>
              </div>

              {/* Tanggal & Biaya */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Tanggal Pelaksanaan *</label>
                  <input
                    type="text"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="25 Oktober 2026"
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Batas Pendaftaran *</label>
                  <input
                    type="text"
                    value={formData.registrationDeadline || ''}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    placeholder="20 Oktober 2026"
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Biaya (0 = Gratis) *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.price ?? 0}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setFormData({
                          ...formData,
                          price,
                          priceLabel: price === 0 ? 'Gratis' : `Rp ${price.toLocaleString('id-ID')}`,
                        });
                      }}
                      className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Kuota & Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Kuota Maksimal *</label>
                  <input
                    type="number"
                    value={formData.quota ?? 50}
                    onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Kuota Terisi</label>
                  <input
                    type="number"
                    value={formData.quotaFilled ?? 0}
                    onChange={(e) => setFormData({ ...formData, quotaFilled: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Nomor Batch</label>
                  <input
                    type="number"
                    value={formData.batchNumber ?? 1}
                    onChange={(e) => setFormData({ ...formData, batchNumber: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  />
                </div>
              </div>

              {/* Foto Cover & UploadThing */}
              <div>
                <label className="block font-bold text-[#26383C] mb-1">Foto Cover Kegiatan *</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-[#D5DFE0] overflow-hidden flex-none bg-gray-50">
                    <img
                      src={formData.coverImage || '/assets/decor-1.png'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={formData.coverImage || ''}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="Masukkan URL foto atau unggah langsung lewat UploadThing"
                      className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none text-xs"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500">Atau upload gambar:</span>
                      <UploadButton
                        endpoint="mediaUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res[0]) {
                            const uploadedUrl = res[0].ufsUrl || res[0].url;
                            setFormData((prev) => ({ ...prev, coverImage: uploadedUrl }));
                            alert('Cover berhasil diupload ke UploadThing!');
                          }
                        }}
                        onUploadError={(error: Error) => {
                          alert(`Upload gagal: ${error.message}`);
                        }}
                      />
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

              {/* Rundown & Benefit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0F7F7]">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Benefit Volunteer (Pisahkan dengan koma)</label>
                  <textarea
                    rows={2}
                    value={formData.benefits?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        benefits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="E-Sertifikat, Relasi Baru, Snack"
                    className="w-full p-2.5 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Syarat Mengikuti (Pisahkan dengan koma)</label>
                  <textarea
                    rows={2}
                    value={formData.requirements?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Usia 15-30 tahun, Komitmen hadir"
                    className="w-full p-2.5 border border-[#D5DFE0] rounded-xl focus:border-[#0EADAD] outline-none"
                  />
                </div>
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
