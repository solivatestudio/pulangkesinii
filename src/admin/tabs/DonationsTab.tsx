import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  Trash2,
  Heart,
  X
} from 'lucide-react';

interface DonationItem {
  id: string;
  name: string;
  amount: string;
  donationType: string;
  prayer: string;
  paymentProofUrl?: string;
  status: 'menunggu_verifikasi' | 'terverifikasi' | 'ditolak';
  aamiinCount: number;
  createdAt: string;
}

const formatAmount = (value: string) => {
  if (!value) return '-';
  const num = Number(value.replace(/[^0-9]/g, ''));
  return Number.isFinite(num) && value.trim() !== '' ? `Rp${num.toLocaleString('id-ID')}` : value;
};

export const DonationsTab: React.FC = () => {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/donations');
      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load donations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setDonations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: newStatus as any } : d))
        );
        if (selectedDonation && selectedDonation.id === id) {
          setSelectedDonation((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        alert('Gagal memperbarui status');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus data donasi atas nama "${name}"?`)) return;
    try {
      const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDonations((prev) => prev.filter((d) => d.id !== id));
        if (selectedDonation?.id === id) setSelectedDonation(null);
      } else {
        alert('Gagal menghapus data');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  const filtered = donations.filter((d) => {
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.prayer && d.prayer.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div>
          <h2 className="admin-title text-2xl text-[#173F42]">Donasi</h2>
          <p className="text-xs text-[#6B7E82] mt-1">
            Verifikasi dan kelola donasi masuk (uang maupun barang) dari website
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8FA3A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama donatur atau ucapan/doa..."
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'menunggu_verifikasi', label: 'Menunggu' },
            { id: 'terverifikasi', label: 'Terverifikasi' },
            { id: 'ditolak', label: 'Ditolak' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#0EADAD] text-white'
                  : 'bg-white text-[#4A5D61] border border-[#D5DFE0] hover:bg-[#F0F7F7]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E0F2F1] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6B7E82]">Menyiapkan daftar donasi...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B7E82]">Belum ada data donasi yang cocok.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#4A5D61]">
              <thead className="bg-[#F8FAFB] border-b border-[#E0F2F1] text-[11px] font-bold text-[#173F42] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nama & Tanggal</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4">Ucapan / Doa</th>
                  <th className="py-3.5 px-4">Bukti</th>
                  <th className="py-3.5 px-4">Aamiin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F7F7]">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F9FCFC] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#173F42]">{d.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${d.donationType === 'Uang' ? 'bg-[#E0F7F6] text-[#087C7E]' : 'bg-[#E8F8F5] text-[#00A389]'}`}>
                          {d.donationType || 'Uang'}
                        </span>
                        <span className="text-[10px] text-[#8FA3A6]">
                          {new Date(d.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#173F42]">{formatAmount(d.amount)}</td>
                    <td className="py-3.5 px-4 max-w-[220px] truncate">{d.prayer || '-'}</td>
                    <td className="py-3.5 px-4">
                      {d.paymentProofUrl ? (
                        <button
                          onClick={() => setPreviewImage(d.paymentProofUrl || null)}
                          className="text-[11px] text-[#0EADAD] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Tidak ada</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D65F77]">
                        <Heart className="w-3.5 h-3.5" /> {d.aamiinCount || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          d.status === 'terverifikasi'
                            ? 'bg-[#E6FFFA] text-[#00A389]'
                            : d.status === 'ditolak'
                            ? 'bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#FFFBEB] text-[#D97706]'
                        }`}
                      >
                        {d.status === 'terverifikasi' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                          </>
                        ) : d.status === 'ditolak' ? (
                          <>
                            <XCircle className="w-3 h-3" /> Ditolak
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Menunggu
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDonation(d)}
                          className="h-7 px-2 bg-[#F0F7F7] hover:bg-[#E0F7F6] text-[#0EADAD] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          className="h-7 w-7 bg-[#FFF2F0] hover:bg-[#FFEBE8] text-[#CF1322] rounded-md flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#E0F2F1] my-4">
            <div className="px-6 py-4 border-b border-[#F0F7F7] flex items-center justify-between bg-[#FAFAFA]">
              <div>
                <h3 className="font-bold text-sm text-[#173F42]">Detail Donasi</h3>
                <span className="text-[11px] text-[#0EADAD] font-semibold">{selectedDonation.donationType}</span>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F8FAFB] rounded-xl border border-[#EEF2F5]">
                <div>
                  <span className="text-gray-400 block text-[10px]">Nama Donatur</span>
                  <span className="font-bold text-[#173F42]">{selectedDonation.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Nominal</span>
                  <span className="font-bold text-[#173F42]">{formatAmount(selectedDonation.amount)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Tanggal</span>
                  <span className="font-semibold text-[#173F42]">
                    {new Date(selectedDonation.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Aamiin</span>
                  <span className="font-semibold text-[#D65F77]">{selectedDonation.aamiinCount || 0} orang</span>
                </div>
              </div>

              {selectedDonation.prayer && (
                <div>
                  <span className="text-gray-400 block text-[10px] mb-1">Ucapan / Doa</span>
                  <p className="p-3 bg-[#F8FAFB] rounded-xl border border-[#EEF2F5] text-gray-700 leading-relaxed">
                    “{selectedDonation.prayer}”
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-[#F0F7F7]">
                <span className="font-bold text-[#173F42] block">Bukti Pembayaran</span>
                {selectedDonation.paymentProofUrl ? (
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-700">Bukti transfer</span>
                    <button
                      onClick={() => setPreviewImage(selectedDonation.paymentProofUrl || null)}
                      className="px-2.5 py-1 bg-[#0EADAD] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Buka Gambar
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 text-[11px]">Tidak ada bukti pembayaran</div>
                )}
              </div>

              <div className="pt-4 border-t border-[#F0F7F7] space-y-2">
                <span className="font-bold text-[#173F42] block">Ubah Status Donasi:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatus(selectedDonation.id, 'terverifikasi')}
                    className={`h-10 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedDonation.status === 'terverifikasi'
                        ? 'bg-[#00A389] text-white'
                        : 'bg-[#E6FFFA] text-[#00A389] hover:bg-[#D1F2EB]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terverifikasi</span>
                  </button>
                  <button
                    onClick={() => updateStatus(selectedDonation.id, 'ditolak')}
                    className={`h-10 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedDonation.status === 'ditolak'
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] bg-white rounded-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center cursor-pointer shadow-lg font-bold"
            >
              ✕
            </button>
            <img src={previewImage} alt="Bukti Transfer" className="max-h-[80vh] w-auto object-contain rounded-xl" />
            <div className="mt-2 text-center">
              <a
                href={previewImage}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#0EADAD] font-bold hover:underline"
              >
                Buka gambar ukuran asli ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
