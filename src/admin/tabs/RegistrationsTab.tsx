import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  Download, 
  Eye, 
  Trash2, 
  MessageCircle, 
  X,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RegistrationItem {
  id: string;
  registrationCode: string;
  activityId?: string;
  activityTitle: string;
  fullName: string;
  email: string;
  birthDate: string;
  domicile: string;
  whatsapp: string;
  followedChannel: string;
  activityChoice: string;
  paymentMethod: string;
  reason: string;
  contributionProofUrl?: string;
  tagFriendsProofUrl?: string;
  repostStoryProofUrl?: string;
  status: 'menunggu_verifikasi' | 'terkonfirmasi' | 'ditolak';
  adminNotes?: string;
  customAnswers?: Record<string, string>;
  createdAt: string;
}

export const RegistrationsTab: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [activityCityById, setActivityCityById] = useState<Record<string, string>>({});
  const [selectedReg, setSelectedReg] = useState<RegistrationItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/registrations');
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    fetch('/api/activities')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setActivityCityById(
          items.reduce((acc: Record<string, string>, act: any) => {
            if (act.id && act.city) acc[act.id] = act.city;
            return acc;
          }, {})
        );
      })
      .catch(() => {});
  }, []);

  const updateStatus = async (id: string, newStatus: string, adminNotes?: string) => {
    try {
      const res = await fetch(`/api/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });

      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus as any, adminNotes } : r))
        );
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg((prev) => (prev ? { ...prev, status: newStatus as any, adminNotes } : null));
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
    if (!window.confirm(`Hapus data pendaftaran atas nama "${name}"?`)) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        if (selectedReg?.id === id) setSelectedReg(null);
      } else {
        alert('Gagal menghapus data');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  const exportToPdf = () => {
    if (filtered.length === 0) {
      alert('Belum ada data pendaftar untuk diekspor');
      return;
    }

    const cityOf = (r: RegistrationItem) =>
      (r.activityId && activityCityById[r.activityId]) || 'Tanpa Kota';

    const grouped = new Map<string, RegistrationItem[]>();
    filtered.forEach((r) => {
      const city = cityOf(r);
      if (!grouped.has(city)) grouped.set(city, []);
      grouped.get(city)!.push(r);
    });

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const margin = 12;

    doc.setFontSize(16);
    doc.setTextColor(15, 118, 110);
    doc.text('Data Pendaftaran Volunteer', margin, 14);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Pulangkesinii · ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · ${filtered.length} pendaftar`,
      margin,
      20
    );

    const head = [['Kode Registrasi', 'Nama Lengkap', 'Email', 'WhatsApp', 'Domisili Peserta', 'Kegiatan', 'Pembayaran', 'Status', 'Tanggal Daftar']];
    let y = 26;

    Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([city, items]) => {
        if (y > 185) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(15, 118, 110);
        doc.text(`${city} (${items.length} pendaftar)`, margin, y);
        y += 2;

        const body = items.map((r) => [
          r.registrationCode,
          r.fullName,
          r.email || '-',
          r.whatsapp,
          r.domicile,
          r.activityChoice || r.activityTitle,
          r.paymentMethod,
          r.status,
          new Date(r.createdAt).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        ]);

        autoTable(doc, {
          startY: y,
          head,
          body,
          margin: { left: margin, right: margin },
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 1.5 },
          headStyles: { fillColor: [224, 247, 246], textColor: [19, 78, 74], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 250, 252] },
        });

        y = (doc as any).lastAutoTable.finalY + 8;
      });

    doc.save(`pendaftar-pulangkesinii-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const activityCity = (r: RegistrationItem) =>
    (r.activityId && activityCityById[r.activityId]) || '-';

  const filtered = registrations.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchCity = cityFilter === 'all' || activityCity(r) === cityFilter;
    const matchSearch =
      !search ||
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.whatsapp.includes(search) ||
      (r.registrationCode && r.registrationCode.toLowerCase().includes(search.toLowerCase())) ||
      (r.activityChoice && r.activityChoice.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchCity && matchSearch;
  });

  const cities = Array.from(new Set(Object.values(activityCityById))).sort();

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div>
          <h2 className="admin-title text-2xl text-[#173F42]">Pendaftaran Volunteer</h2>
          <p className="text-xs text-[#6B7E82] mt-1">
            Daftar formulir pendaftaran masuk dari website, verifikasi pembayaran, dan ekspor data
          </p>
        </div>
        <button
          onClick={exportToPdf}
          className="h-10 px-4 bg-[#172B32] hover:bg-[#203B44] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Data (PDF)</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8FA3A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pendaftar, WhatsApp, atau kode registrasi..."
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap bg-white text-[#4A5D61] border border-[#D5DFE0] outline-none cursor-pointer"
          >
            <option value="all">Semua</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'menunggu_verifikasi', label: 'Menunggu' },
            { id: 'terkonfirmasi', label: 'Terkonfirmasi' },
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

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl border border-[#E0F2F1] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6B7E82]">
            Menyiapkan daftar pendaftar...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B7E82]">
            Belum ada data pendaftar yang cocok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#4A5D61]">
              <thead className="bg-[#F8FAFB] border-b border-[#E0F2F1] text-[11px] font-bold text-[#173F42] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Kode & Tanggal</th>
                  <th className="py-3.5 px-4">Nama Pendaftar</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">WhatsApp</th>
                  <th className="py-3.5 px-4">Kegiatan Pilihan</th>
                  <th className="py-3.5 px-4">Pembayaran</th>
                  <th className="py-3.5 px-4">Bukti</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F7F7]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F9FCFC] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#173F42]">{r.registrationCode}</div>
                      <div className="text-[10px] text-[#8FA3A6] mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#173F42]">
                      <div>{r.fullName}</div>
                      <div className="text-[10px] text-[#6B7E82] font-normal">{r.domicile}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-[#173F42]">{r.email || '-'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={`https://wa.me/${r.whatsapp.replace(/\D/g, '')}?text=Halo%20Kak%20${encodeURIComponent(r.fullName)}%2C%20kami%20dari%20tim%20Pulangkesinii%20mengenai%20pendaftaran%20${encodeURIComponent(r.activityChoice || r.activityTitle)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E8F8F5] text-[#00A389] font-bold rounded-lg text-[11px] hover:bg-[#D1F2EB] transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{r.whatsapp}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate font-medium">
                      {r.activityChoice || r.activityTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#26383C]">{r.paymentMethod}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {r.contributionProofUrl ? (
                        <button
                          onClick={() => setPreviewImage(r.contributionProofUrl || null)}
                          className="text-[11px] text-[#0EADAD] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Tidak ada</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.status === 'terkonfirmasi'
                            ? 'bg-[#E6FFFA] text-[#00A389]'
                            : r.status === 'ditolak'
                            ? 'bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#FFFBEB] text-[#D97706]'
                        }`}
                      >
                        {r.status === 'terkonfirmasi' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Terkonfirmasi
                          </>
                        ) : r.status === 'ditolak' ? (
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
                          onClick={() => setSelectedReg(r)}
                          className="h-7 px-2 bg-[#F0F7F7] hover:bg-[#E0F7F6] text-[#0EADAD] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.fullName)}
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

      {/* Modal Detail Pendaftar */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#E0F2F1] my-4">
            <div className="px-6 py-4 border-b border-[#F0F7F7] flex items-center justify-between bg-[#FAFAFA]">
              <div>
                <h3 className="font-bold text-sm text-[#173F42]">Detail Pendaftar</h3>
                <span className="text-[11px] text-[#0EADAD] font-semibold">{selectedReg.registrationCode}</span>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F8FAFB] rounded-xl border border-[#EEF2F5]">
                <div>
                  <span className="text-gray-400 block text-[10px]">Nama Lengkap</span>
                  <span className="font-bold text-[#173F42]">{selectedReg.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Alamat Email</span>
                  <span className="font-bold text-[#0EADAD]">{selectedReg.email || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Nomor WhatsApp</span>
                  <span className="font-bold text-[#0EADAD]">{selectedReg.whatsapp}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Domisili</span>
                  <span className="font-semibold text-[#173F42]">{selectedReg.domicile || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Tanggal Lahir</span>
                  <span className="font-semibold text-[#173F42]">{selectedReg.birthDate || '-'}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] mb-1">Kegiatan yang Dipilih</span>
                <p className="font-bold text-sm text-[#173F42] bg-[#E0F7F6]/40 p-3 rounded-xl border border-[#0EADAD]/20">
                  {selectedReg.activityChoice || selectedReg.activityTitle}
                </p>
              </div>

              {selectedReg.reason && (
                <div>
                  <span className="text-gray-400 block text-[10px] mb-1">Alasan / Motivasi Bergabung</span>
                  <p className="p-3 bg-[#F8FAFB] rounded-xl border border-[#EEF2F5] text-gray-700 leading-relaxed">
                    {selectedReg.reason}
                  </p>
                </div>
              )}
              {selectedReg.customAnswers && Object.keys(selectedReg.customAnswers).length > 0 && (
                <div>
                  <span className="text-gray-400 block text-[10px] mb-1">Jawaban Pertanyaan Kustom</span>
                  <div className="space-y-2">{Object.entries(selectedReg.customAnswers).map(([key, value]) => <div key={key} className="p-3 bg-[#F8FAFB] rounded-xl"><strong>{key}</strong><p>{value}</p></div>)}</div>
                </div>
              )}

              {/* Lampiran bukti */}
              <div className="space-y-2 pt-2 border-t border-[#F0F7F7]">
                <span className="font-bold text-[#173F42] block">Lampiran Bukti</span>
                
                {selectedReg.contributionProofUrl ? (
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-700">Bukti Pembayaran / Kontribusi</span>
                    <button
                      onClick={() => setPreviewImage(selectedReg.contributionProofUrl || null)}
                      className="px-2.5 py-1 bg-[#0EADAD] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Buka Gambar
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 text-[11px]">Tidak ada bukti pembayaran</div>
                )}

                {selectedReg.tagFriendsProofUrl && (
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-700">Bukti Tag Teman</span>
                    <button
                      onClick={() => setPreviewImage(selectedReg.tagFriendsProofUrl || null)}
                      className="px-2.5 py-1 bg-[#0EADAD] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Buka Gambar
                    </button>
                  </div>
                )}

                {selectedReg.repostStoryProofUrl && (
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-700">Bukti Repost Story</span>
                    <button
                      onClick={() => setPreviewImage(selectedReg.repostStoryProofUrl || null)}
                      className="px-2.5 py-1 bg-[#0EADAD] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Buka Gambar
                    </button>
                  </div>
                )}
              </div>

              {/* Verifikasi Status */}
              <div className="pt-4 border-t border-[#F0F7F7] space-y-2">
                <span className="font-bold text-[#173F42] block">Ubah Status Pendaftaran:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatus(selectedReg.id, 'terkonfirmasi')}
                    className={`h-10 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedReg.status === 'terkonfirmasi'
                        ? 'bg-[#00A389] text-white'
                        : 'bg-[#E6FFFA] text-[#00A389] hover:bg-[#D1F2EB]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terkonfirmasi</span>
                  </button>
                  <button
                    onClick={() => updateStatus(selectedReg.id, 'ditolak')}
                    className={`h-10 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedReg.status === 'ditolak'
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

      {/* Image Zoom Preview Modal */}
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
