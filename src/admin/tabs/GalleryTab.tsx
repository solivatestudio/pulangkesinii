import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Image as ImageIcon, Check, X } from 'lucide-react';
import { UploadButton } from '../../utils/uploadthing';

interface GalleryPhoto {
  id: string;
  title: string;
  batchTag: string;
  category: string;
  imageUrl: string;
  caption: string;
  location: string;
  date: string;
  tileClass: string;
  orderIndex: number;
}

export const GalleryTab: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBatchTag, setNewBatchTag] = useState('Batch 39');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newLocation, setNewLocation] = useState('Jakarta');
  const [newTileClass, setNewTileClass] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      alert('Harap masukkan URL foto atau upload via UploadThing');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle || 'Momen Kegiatan',
          batchTag: newBatchTag,
          category: 'Volunteer',
          imageUrl: newImageUrl,
          caption: newCaption || 'Potret kebersamaan volunteer Pulangkesinii',
          location: newLocation,
          date: 'Agustus 2026',
          tileClass: newTileClass,
          orderIndex: photos.length + 1,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewImageUrl('');
        setNewCaption('');
        fetchPhotos();
      } else {
        alert('Gagal menambah foto');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus foto ini dari galeri?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPhotos(photos.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#173F42]">Galeri Momen Kebaikan</h2>
          <p className="text-xs text-[#6B7E82] mt-0.5">
            Kelola foto dokumentasi kegiatan yang tampil di mosaic galeri beranda
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-4 bg-[#0EADAD] hover:bg-[#0C9696] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto Baru</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-[#6B7E82]">
          Memuat galeri...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((p) => (
            <div key={p.id} className="relative group bg-white rounded-xl overflow-hidden border border-[#E0F2F1] shadow-xs">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-2 text-[10px]">
                <div className="font-bold text-[#173F42] truncate">{p.title}</div>
                <div className="text-gray-500 truncate">{p.location || p.batchTag}</div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Upload Foto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-[#E0F2F1]">
            <div className="px-6 py-4 border-b border-[#F0F7F7] flex items-center justify-between bg-[#FAFAFA]">
              <h3 className="font-bold text-sm text-[#173F42]">Upload Foto Galeri</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#26383C] mb-1">Unggah Gambar ke UploadThing</label>
                <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2">
                  {newImageUrl ? (
                    <img src={newImageUrl} alt="Preview" className="h-28 object-cover rounded-xl border border-gray-300" />
                  ) : null}
                  <UploadButton
                    endpoint="mediaUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        const url = res[0].ufsUrl || res[0].url;
                        setNewImageUrl(url);
                        alert('Gambar berhasil diupload ke UploadThing!');
                      }
                    }}
                    onUploadError={(err: Error) => alert(`Upload gagal: ${err.message}`)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#26383C] mb-1">Atau Masukkan URL Gambar Langsung</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#26383C] mb-1">Judul / Label Foto</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Momen Senyum Batch 39"
                  className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Batch / Tag</label>
                  <input
                    type="text"
                    value={newBatchTag}
                    onChange={(e) => setNewBatchTag(e.target.value)}
                    placeholder="Batch 39"
                    className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#26383C] mb-1">Layout Kartu</label>
                  <select
                    value={newTileClass}
                    onChange={(e) => setNewTileClass(e.target.value)}
                    className="w-full h-10 px-2 border border-[#D5DFE0] rounded-xl outline-none"
                  >
                    <option value="">Normal (1x1)</option>
                    <option value="featured">Featured (2x2 Besar)</option>
                    <option value="wide">Wide (2x1 Lebar)</option>
                    <option value="tall">Tall (1x2 Tinggi)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-gray-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] text-white font-bold rounded-xl shadow-xs"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
