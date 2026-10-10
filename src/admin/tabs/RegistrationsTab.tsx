import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Download, 
  Eye, 
  Trash2, 
  MessageCircle, 
  X,
  ArrowLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  ListChecks,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { notify } from '../../utils/notifications';

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
  customAnswers?: Record<string, string>;
  createdAt: string;
}

const exportColumns = [
  { id: 'registrationCode', label: 'Kode Registrasi', value: (r: RegistrationItem) => r.registrationCode },
  { id: 'fullName', label: 'Nama Lengkap', value: (r: RegistrationItem) => r.fullName },
  { id: 'whatsapp', label: 'No. WhatsApp', value: (r: RegistrationItem) => r.whatsapp },
  { id: 'domicile', label: 'Domisili', value: (r: RegistrationItem) => r.domicile || '-' },
  { id: 'activity', label: 'Kegiatan', value: (r: RegistrationItem) => r.activityChoice || r.activityTitle || '-' },
  { id: 'email', label: 'Email', value: (r: RegistrationItem) => r.email || '-' },
  { id: 'birthDate', label: 'Tanggal Lahir', value: (r: RegistrationItem) => r.birthDate || '-' },
  { id: 'paymentMethod', label: 'Metode Pembayaran', value: (r: RegistrationItem) => r.paymentMethod || '-' },
  { id: 'createdAt', label: 'Tanggal Daftar', value: (r: RegistrationItem) => new Date(r.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
] as const;

type ExportColumnId = (typeof exportColumns)[number]['id'];
const exportColumnsCookie = 'pulangkesinii_export_columns';

export const RegistrationsTab: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedRegistrationIds, setSelectedRegistrationIds] = useState<string[]>([]);
  const [deletingSelected, setDeletingSelected] = useState(false);
  const [selectedReg, setSelectedReg] = useState<RegistrationItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedExportColumns, setSelectedExportColumns] = useState<ExportColumnId[]>([]);
  const [exportColumnsLoaded, setExportColumnsLoaded] = useState(false);

  useEffect(() => {
    if (!exportDialogOpen && !selectedReg && !previewImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (previewImage) setPreviewImage(null);
      else if (exportDialogOpen) setExportDialogOpen(false);
      else setSelectedReg(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [exportDialogOpen, selectedReg, previewImage]);

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
    const saved = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${exportColumnsCookie}=`))
      ?.split('=')[1];
    if (saved) {
      try {
        const validIds = new Set(exportColumns.map((column) => column.id));
        const parsed = JSON.parse(decodeURIComponent(saved));
        if (Array.isArray(parsed)) {
          setSelectedExportColumns(parsed.filter((id): id is ExportColumnId => typeof id === 'string' && validIds.has(id as ExportColumnId)));
        }
      } catch {
        // Cookie yang tidak valid cukup diabaikan agar pilihan ekspor tetap bisa digunakan.
      }
    }
    setExportColumnsLoaded(true);
  }, []);

  useEffect(() => {
    if (!exportColumnsLoaded) return;
    document.cookie = `${exportColumnsCookie}=${encodeURIComponent(JSON.stringify(selectedExportColumns))}; max-age=31536000; path=/; SameSite=Lax`;
  }, [exportColumnsLoaded, selectedExportColumns]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus data pendaftaran atas nama "${name}"?`)) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        if (selectedReg?.id === id) setSelectedReg(null);
      } else {
        notify('Data pendaftar belum bisa dihapus. Coba lagi.', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Data pendaftar belum bisa dihapus. Coba lagi.', 'error');
    }
  };

  const exportToPdf = () => {
    if (filtered.length === 0) {
      notify('Belum ada data pendaftar yang bisa diekspor.', 'error');
      return;
    }
    if (selectedExportColumns.length === 0) {
      notify('Pilih minimal satu kolom untuk diekspor.', 'error');
      return;
    }

    const columns = exportColumns.filter((column) => selectedExportColumns.includes(column.id));

    const cityOf = (r: RegistrationItem) => folderDomicile(r);

    const grouped = new Map<string, RegistrationItem[]>();
    filtered.forEach((r) => {
      const city = cityOf(r);
      if (!grouped.has(city)) grouped.set(city, []);
      grouped.get(city)!.push(r);
    });

    const doc = new jsPDF({ orientation: columns.length > 5 ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
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

    const head = [columns.map((column) => column.label)];
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

        const body = items.map((r) => columns.map((column) => column.value(r)));

        autoTable(doc, {
          startY: y,
          head,
          body,
          margin: { left: margin, right: margin },
          theme: 'grid',
          styles: { fontSize: columns.length > 5 ? 7 : 8, cellPadding: columns.length > 5 ? 1.5 : 2 },
          headStyles: { fillColor: [224, 247, 246], textColor: [19, 78, 74], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 250, 252] },
        });

        y = (doc as any).lastAutoTable.finalY + 8;
      });

    doc.save(`pendaftar-pulangkesinii-${new Date().toISOString().slice(0, 10)}.pdf`);
    setExportDialogOpen(false);
  };

  const handleBulkDelete = async () => {
    if (!selectedRegistrationIds.length) return;
    if (!window.confirm(`Hapus ${selectedRegistrationIds.length} pendaftar terpilih? Tindakan ini tidak dapat dibatalkan.`)) return;

    setDeletingSelected(true);
    try {
      const results = await Promise.all(selectedRegistrationIds.map(async (id) => ({ id, response: await fetch(`/api/registrations/${id}`, { method: 'DELETE' }) })));
      const removedIds = results.filter(({ response }) => response.ok).map(({ id }) => id);
      const failedCount = results.length - removedIds.length;
      if (removedIds.length) {
        setRegistrations((current) => current.filter((registration) => !removedIds.includes(registration.id)));
        if (selectedReg && removedIds.includes(selectedReg.id)) setSelectedReg(null);
      }
      setSelectedRegistrationIds(failedCount ? results.filter(({ response }) => !response.ok).map(({ id }) => id) : []);
      if (failedCount) notify(`${removedIds.length} pendaftar dihapus, ${failedCount} lainnya gagal dihapus.`, 'error');
      else notify(`${removedIds.length} pendaftar berhasil dihapus.`);
    } catch (error) {
      console.error(error);
      notify('Penghapusan massal belum berhasil. Coba lagi.', 'error');
    } finally {
      setDeletingSelected(false);
    }
  };

  const toggleExportColumn = (columnId: ExportColumnId) => {
    setSelectedExportColumns((selected) => selected.includes(columnId)
      ? selected.filter((id) => id !== columnId)
      : [...selected, columnId]);
  };

  const folderDomicile = (r: RegistrationItem) => r.domicile?.trim() || 'Domisili belum diisi';

  const activityKey = (r: RegistrationItem) => r.activityId || r.activityChoice || r.activityTitle || 'Tanpa kegiatan';
  const activityName = (r: RegistrationItem) => r.activityChoice || r.activityTitle || 'Tanpa kegiatan';

  const matchingRegistrations = registrations.filter((r) =>
    !search ||
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.whatsapp.includes(search) ||
    (r.registrationCode && r.registrationCode.toLowerCase().includes(search.toLowerCase())) ||
    (r.activityChoice && r.activityChoice.toLowerCase().includes(search.toLowerCase()))
  );

  const filtered = matchingRegistrations.filter((r) =>
    (!selectedCity || folderDomicile(r) === selectedCity) &&
    (!selectedActivity || activityKey(r) === selectedActivity)
  );

  const cityFolders = Array.from(new Set(matchingRegistrations.map(folderDomicile))).sort().map((city) => ({
    city,
    count: matchingRegistrations.filter((registration) => folderDomicile(registration) === city).length,
  }));
  const activityFolders = selectedCity
    ? Array.from(new Map<string, string>(matchingRegistrations.filter((registration) => folderDomicile(registration) === selectedCity).map((registration) => [activityKey(registration), activityName(registration)])).entries())
      .map(([key, name]) => ({ key, name, count: matchingRegistrations.filter((registration) => folderDomicile(registration) === selectedCity && activityKey(registration) === key).length }))
      .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div>
          <h2 className="admin-title text-2xl text-[#173F42]">Pendaftaran Volunteer</h2>
          <p className="text-xs text-[#6B7E82] mt-1">
            Daftar formulir pendaftaran masuk dari website dan ekspor data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExportDialogOpen(true)}
            className="h-10 px-4 bg-[#172B32] hover:bg-[#203B44] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Data (PDF)</span>
          </button>
        </div>
      </div>

      {exportDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E0F2F1] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F0F7F7] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#173F42]">Pilih data untuk diekspor</h3>
                <p className="text-xs text-[#6B7E82] mt-1">{filtered.length} pendaftar sesuai filter saat ini.</p>
              </div>
              <button onClick={() => setExportDialogOpen(false)} className="w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center cursor-pointer" aria-label="Tutup pilihan ekspor">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#173F42]">Kolom PDF</span>
                <button
                  type="button"
                  onClick={() => setSelectedExportColumns(selectedExportColumns.length === exportColumns.length ? [] : exportColumns.map((column) => column.id))}
                  className="text-xs font-bold text-[#0EADAD] hover:underline cursor-pointer"
                >
                  {selectedExportColumns.length === exportColumns.length ? 'Hapus semua' : 'Pilih semua'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {exportColumns.map((column) => {
                  const checked = selectedExportColumns.includes(column.id);
                  return (
                    <label key={column.id} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${checked ? 'bg-[#E0F7F6] border-[#0EADAD]' : 'bg-white border-[#E0E7E8] hover:bg-[#F8FAFB]'}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleExportColumn(column.id)} className="accent-[#0EADAD]" />
                      <span className="text-xs font-semibold text-[#26383C]">{column.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#F0F7F7] flex justify-end gap-2">
              <button type="button" onClick={() => setExportDialogOpen(false)} className="h-10 px-4 text-xs font-bold text-[#4A5D61] hover:bg-gray-100 rounded-xl cursor-pointer">Batal</button>
              <button type="button" onClick={exportToPdf} disabled={selectedExportColumns.length === 0} className="h-10 px-4 bg-[#172B32] hover:bg-[#203B44] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer">
                <Download className="w-4 h-4" /> Ekspor PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav aria-label="Lokasi daftar pendaftar" className="flex items-center gap-1.5 text-xs overflow-x-auto">
          <button type="button" onClick={() => { setSelectedCity(null); setSelectedActivity(null); }} className={`font-bold whitespace-nowrap cursor-pointer ${!selectedCity ? 'text-[#087C7E]' : 'text-[#6B7E82] hover:text-[#087C7E]'}`}>Domisili</button>
          {selectedCity && <><ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" /><button type="button" onClick={() => setSelectedActivity(null)} className={`font-bold whitespace-nowrap cursor-pointer ${!selectedActivity ? 'text-[#087C7E]' : 'text-[#6B7E82] hover:text-[#087C7E]'}`}>{selectedCity}</button></>}
          {selectedActivity && <><ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="font-bold text-[#173F42] whitespace-nowrap">Daftar volunteer</span></>}
        </nav>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-[#8FA3A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, WhatsApp, kode, atau kegiatan..." className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-white border border-[#D5DFE0] focus:border-[#0EADAD] outline-none" />
          </div>
          <button type="button" onClick={() => { setSelectionMode((current) => !current); if (selectionMode) setSelectedRegistrationIds([]); }} className={`h-10 px-3.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border whitespace-nowrap ${selectionMode ? 'bg-[#E0F7F6] border-[#0EADAD] text-[#087C7E]' : 'bg-white border-[#D5DFE0] text-[#4A5D61] hover:bg-[#F8FAFB]'}`}>
            <ListChecks className="w-4 h-4" />{selectionMode ? 'Selesai' : 'Pilih'}
          </button>
          {selectionMode && <button type="button" onClick={handleBulkDelete} disabled={!selectedRegistrationIds.length || deletingSelected} className="h-10 px-3.5 bg-[#FFF2F0] hover:bg-[#FFEBE8] disabled:bg-gray-100 disabled:text-gray-400 text-[#CF1322] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"><Trash2 className="w-4 h-4" />{deletingSelected ? 'Menghapus...' : `Hapus (${selectedRegistrationIds.length})`}</button>}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl border border-[#E0F2F1] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6B7E82]">
            Menyiapkan daftar pendaftar...
          </div>
        ) : !selectedCity ? (
          cityFolders.length === 0 ? <div className="p-12 text-center text-xs text-[#6B7E82]">Belum ada data pendaftar.</div> : (
            <div className="divide-y divide-[#EEF4F4]">
              {cityFolders.map((folder) => (
                <button key={folder.city} type="button" onClick={() => setSelectedCity(folder.city)} className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-[#F4FCFC] transition-colors cursor-pointer group">
                  <span className="w-10 h-10 rounded-xl bg-[#E0F7F6] text-[#087C7E] flex items-center justify-center group-hover:bg-[#0EADAD] group-hover:text-white transition-colors"><Folder className="w-5 h-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-bold text-sm text-[#173F42] truncate">{folder.city}</span><span className="text-xs text-[#6B7E82]">{folder.count} volunteer</span></span>
                  <span className="text-[11px] font-bold text-[#0EADAD] opacity-0 group-hover:opacity-100 transition-opacity">Buka</span><ChevronRight className="w-4 h-4 text-[#8FA3A6]" />
                </button>
              ))}
            </div>
          )
        ) : !selectedActivity ? (
          <div className="p-4">
            <button type="button" onClick={() => setSelectedCity(null)} className="mb-3 h-8 px-2.5 text-xs font-bold text-[#087C7E] hover:bg-[#E0F7F6] rounded-lg inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Semua domisili</button>
            <div className="divide-y divide-[#EEF4F4] border border-[#E0F2F1] rounded-2xl overflow-hidden">
              {activityFolders.map((folder) => (
                <button key={folder.key} type="button" onClick={() => setSelectedActivity(folder.key)} className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-[#F4FCFC] transition-colors cursor-pointer group">
                  <span className="w-10 h-10 rounded-xl bg-[#EEF5FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors"><FolderOpen className="w-5 h-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-bold text-sm text-[#173F42] truncate">{folder.name}</span><span className="text-xs text-[#6B7E82]">{folder.count} volunteer</span></span>
                  <span className="text-[11px] font-bold text-[#0EADAD] opacity-0 group-hover:opacity-100 transition-opacity">Buka</span><ChevronRight className="w-4 h-4 text-[#8FA3A6]" />
                </button>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B7E82]">
            Belum ada data pendaftar yang cocok.
          </div>
        ) : (
          <div>
            <div className="px-4 pt-4 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setSelectedActivity(null)} className="h-8 px-2.5 text-xs font-bold text-[#087C7E] hover:bg-[#E0F7F6] rounded-lg inline-flex items-center gap-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Kembali ke kegiatan</button>
            </div>
            <div className="hide-horizontal-scrollbar overflow-x-auto mt-3">
              <table className="w-full text-left text-xs text-[#4A5D61]">
              <thead className="bg-[#F8FAFB] border-b border-[#E0F2F1] text-[11px] font-bold text-[#173F42] uppercase tracking-wider">
                <tr>
                  {selectionMode && <th className="py-3.5 px-4 w-10"><input type="checkbox" checked={filtered.length > 0 && filtered.every((registration) => selectedRegistrationIds.includes(registration.id))} onChange={(event) => setSelectedRegistrationIds(event.target.checked ? filtered.map((registration) => registration.id) : [])} className="accent-[#0EADAD] cursor-pointer" aria-label="Pilih semua pendaftar" /></th>}
                  <th className="py-3.5 px-4">Kode & Tanggal</th>
                  <th className="py-3.5 px-4">Nama Pendaftar</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">WhatsApp</th>
                  <th className="py-3.5 px-4">Kegiatan Pilihan</th>
                  <th className="py-3.5 px-4">Pembayaran</th>
                  <th className="py-3.5 px-4">Bukti</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F7F7]">
                {filtered.map((r) => (
                  <tr key={r.id} className={`hover:bg-[#F9FCFC] transition-colors ${selectedRegistrationIds.includes(r.id) ? 'bg-[#F4FCFC]' : ''}`}>
                    {selectionMode && <td className="py-3.5 px-4"><input type="checkbox" checked={selectedRegistrationIds.includes(r.id)} onChange={(event) => setSelectedRegistrationIds((current) => event.target.checked ? [...current, r.id] : current.filter((id) => id !== r.id))} className="accent-[#0EADAD] cursor-pointer" aria-label={`Pilih ${r.fullName}`} /></td>}
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
                    <td className="py-3.5 px-4 text-right">
                      {!selectionMode && <div className="flex items-center justify-end gap-1.5">
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
                      </div>}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
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
