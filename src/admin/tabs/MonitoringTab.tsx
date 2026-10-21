import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, HardDrive, Loader2, RefreshCw, Search, Trash2 } from 'lucide-react';
import { confirmAction, notify } from '../../utils/notifications';

type StorageFile = { id: string; key: string; name: string; size: number; customId: string | null; status: string; uploadedAt: number };
type Snapshot = { capturedAt: string; usedBytes: number; limitBytes: number; fileCount: number; weeklyGrowthBytes: number | null; projectedNextActivityBytes: number; alerts: string[] };
type StorageResponse = { usage: { appTotalBytes: number; limitBytes: number; filesUploaded: number }; files: StorageFile[]; hasMore: boolean };

const formatBytes = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '—';
  if (value < 1024) return `${value} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length);
  return `${(value / 1024 ** exponent).toFixed(value >= 1024 ** 3 ? 2 : 1)} ${units[exponent - 1]}`;
};

const formatDate = (timestamp: number) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));

export const MonitoringTab: React.FC = () => {
  const [data, setData] = useState<StorageResponse | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const pageSize = 50;

  const load = async (nextPage = page) => {
    setLoading(true);
    try {
      const [filesResponse, monitoringResponse] = await Promise.all([fetch(`/api/admin/storage?limit=${pageSize}&offset=${nextPage * pageSize}`), fetch('/api/admin/storage/monitoring')]);
      const filesBody = await filesResponse.json();
      const monitoringBody = await monitoringResponse.json();
      if (!filesResponse.ok) throw new Error(filesBody.error || 'Gagal memuat file UploadThing.');
      setData(filesBody);
      if (monitoringResponse.ok) setSnapshot(monitoringBody.data);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Gagal memuat storage.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(0); }, []);

  const runNow = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/admin/storage/monitoring/run', { method: 'POST' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Pemeriksaan storage gagal dijalankan.');
      setSnapshot(body);
      notify(body.alerts.length ? 'Pemeriksaan selesai dengan peringatan storage.' : 'Pemeriksaan storage selesai.', body.alerts.length ? 'error' : 'success');
      load(page);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Pemeriksaan storage gagal dijalankan.', 'error');
    } finally {
      setRunning(false);
    }
  };

  const deleteFile = async (file: StorageFile) => {
    if (!await confirmAction(`File “${file.name}” akan dihapus dari UploadThing dan tidak dapat dipulihkan. Tautan terkait bisa rusak.`, 'Hapus file?')) return;
    setDeletingKey(file.key);
    try {
      const response = await fetch(`/api/admin/storage?key=${encodeURIComponent(file.key)}`, { method: 'DELETE' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Gagal menghapus file.');
      notify('File berhasil dihapus dari UploadThing.', 'success');
      setSelectedKeys((current) => current.filter((key) => key !== file.key));
      await load(page);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Gagal menghapus file.', 'error');
    } finally {
      setDeletingKey(null);
    }
  };

  const toggleFile = (key: string) => setSelectedKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);

  const downloadSelected = async () => {
    if (!selectedKeys.length) return;
    if (selectedKeys.length > 25) return notify('Maksimal 25 file per arsip ZIP. Kurangi pilihan terlebih dahulu.', 'error');
    setBulkDownloading(true);
    try {
      const response = await fetch('/api/admin/storage/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keys: selectedKeys }) });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Gagal membuat arsip ZIP.');
      }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `uploadthing-files-${new Date().toISOString().slice(0, 10)}.zip`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      notify('Arsip ZIP sedang diunduh.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Gagal mengunduh file terpilih.', 'error');
    } finally {
      setBulkDownloading(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedKeys.length || !await confirmAction(`${selectedKeys.length} file terpilih akan dihapus dari UploadThing dan tidak dapat dipulihkan. Tautan terkait bisa rusak.`, 'Hapus file terpilih?')) return;
    setBulkDeleting(true);
    try {
      const response = await fetch('/api/admin/storage/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keys: selectedKeys }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Gagal menghapus file terpilih.');
      setSelectedKeys([]);
      notify(`${body.deletedCount} file berhasil dihapus dari UploadThing.`, 'success');
      await load(page);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Gagal menghapus file terpilih.', 'error');
    } finally {
      setBulkDeleting(false);
    }
  };

  const filteredFiles = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? (data?.files || []).filter((file) => `${file.name} ${file.key} ${file.customId || ''}`.toLowerCase().includes(term)) : data?.files || [];
  }, [data?.files, query]);
  const allFilteredSelected = filteredFiles.length > 0 && filteredFiles.every((file) => selectedKeys.includes(file.key));
  const toggleAllFiltered = () => setSelectedKeys((current) => allFilteredSelected ? current.filter((key) => !filteredFiles.some((file) => file.key === key)) : [...new Set([...current, ...filteredFiles.map((file) => file.key)])]);

  const usage = data?.usage;
  const percentage = usage ? Math.min(100, Math.round((usage.appTotalBytes / usage.limitBytes) * 100)) : 0;
  const nextPage = () => { const value = page + 1; setPage(value); load(value); };
  const previousPage = () => { const value = Math.max(0, page - 1); setPage(value); load(value); };

  return <section className="space-y-5">
    <header className="bg-white rounded-2xl border border-[#E0F2F1] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div><div className="flex items-center gap-2 text-[#087C7E]"><HardDrive className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-wider">UploadThing</span></div><h1 className="admin-title mt-2 text-2xl sm:text-3xl text-[#173F42]">Storage & file</h1><p className="mt-2 text-xs text-[#6B7E82]">{snapshot ? `Pemeriksaan terakhir: ${formatDate(Date.parse(snapshot.capturedAt))}` : 'Belum ada snapshot kapasitas.'}</p></div>
      <button onClick={runNow} disabled={running} className="h-10 px-4 rounded-xl bg-[#0EADAD] hover:bg-[#087C7E] disabled:bg-[#8FA3A6] text-white text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">{running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}{running ? 'Memeriksa...' : 'Cek kapasitas'}</button>
    </header>

    <div className="bg-white rounded-2xl border border-[#E0F2F1] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold text-[#6B7E82]">Storage terpakai</p><p className="mt-1 text-2xl font-bold text-[#173F42]">{formatBytes(usage?.appTotalBytes)} <span className="text-sm font-medium text-[#8FA3A6]">/ {formatBytes(usage?.limitBytes)}</span></p></div><div className="text-right"><p className={`text-sm font-bold ${percentage >= 80 ? 'text-[#C9382B]' : 'text-[#078463]'}`}>{percentage}% terpakai</p><p className="mt-1 text-xs text-[#6B7E82]">{usage?.filesUploaded ?? 0} file tersimpan</p></div></div>
      <div className="mt-4 h-3 rounded-full bg-[#EDF4F4] overflow-hidden"><div className={`h-full rounded-full ${percentage >= 80 ? 'bg-[#E66A5A]' : 'bg-[#0EADAD]'}`} style={{ width: `${percentage}%` }} /></div>
      {snapshot && <div className={`mt-5 rounded-xl p-3.5 text-xs ${snapshot.alerts.length ? 'bg-[#FFF3F1] text-[#A4372B]' : 'bg-[#F0FAF6] text-[#078463]'}`}><div className="flex gap-2 items-start">{snapshot.alerts.length ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}<div>{snapshot.alerts.length ? <ul className="space-y-1 list-disc pl-4">{snapshot.alerts.map((alert) => <li key={alert}>{alert}</li>)}</ul> : <>Kapasitas aman. Pertumbuhan 7 hari: <strong>{formatBytes(snapshot.weeklyGrowthBytes)}</strong>; estimasi kegiatan berikutnya: <strong>{formatBytes(snapshot.projectedNextActivityBytes)}</strong>.</>}</div></div></div>}
    </div>

    <div className="bg-white rounded-2xl border border-[#E0F2F1] overflow-hidden">
      <div className="p-5 border-b border-[#EEF4F4] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"><div><h2 className="text-base font-bold text-[#173F42]">Daftar file UploadThing</h2><p className="mt-1 text-xs text-[#6B7E82]">Pilih beberapa file untuk diunduh sebagai ZIP atau dihapus sekaligus.</p></div><label className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA3A6]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari file..." className="h-9 w-44 sm:w-52 pl-9 pr-3 rounded-lg border border-[#D8E8E8] text-xs outline-none focus:border-[#0EADAD]" /></label></div>
      {selectedKeys.length > 0 && <div className="px-5 py-3 border-b border-[#EEF4F4] bg-[#F7FBFB] flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-bold text-[#173F42]">{selectedKeys.length} file dipilih</span><button onClick={downloadSelected} disabled={bulkDownloading || selectedKeys.length > 25} title={selectedKeys.length > 25 ? 'Maksimal 25 file untuk satu ZIP' : undefined} className="h-8 px-3 rounded-lg bg-[#EAF7F7] text-[#087C7E] text-[11px] font-bold inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer">{bulkDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}{bulkDownloading ? 'Menyiapkan ZIP...' : 'Unduh ZIP'}</button><button onClick={deleteSelected} disabled={bulkDeleting} className="h-8 px-3 rounded-lg bg-[#FFF1EF] text-[#C9382B] text-[11px] font-bold inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer">{bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}{bulkDeleting ? 'Menghapus...' : 'Hapus pilihan'}</button><button onClick={() => setSelectedKeys([])} disabled={bulkDeleting || bulkDownloading} className="h-8 px-3 rounded-lg text-[#6B7E82] text-[11px] font-bold disabled:opacity-50 cursor-pointer">Batal</button>{selectedKeys.length > 25 && <span className="text-[11px] text-[#A4372B]">ZIP maksimal 25 file.</span>}</div>}
      {loading ? <div className="min-h-48 flex items-center justify-center text-[#0EADAD]"><Loader2 className="w-6 h-6 animate-spin" /></div> : <><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#F7FBFB] text-[11px] text-[#6B7E82]"><tr><th className="w-10 px-4 py-3"><input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} aria-label="Pilih semua file yang terlihat" className="cursor-pointer accent-[#0EADAD]" /></th><th className="px-3 py-3 font-semibold">File</th><th className="px-4 py-3 font-semibold">Ukuran</th><th className="px-4 py-3 font-semibold">Diunggah</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-5 py-3 text-right font-semibold">Aksi</th></tr></thead><tbody className="divide-y divide-[#EEF4F4]">{filteredFiles.map((file) => <tr key={file.key} className={selectedKeys.includes(file.key) ? 'bg-[#F5FCFC]' : undefined}><td className="px-4 py-3"><input type="checkbox" checked={selectedKeys.includes(file.key)} onChange={() => toggleFile(file.key)} aria-label={`Pilih ${file.name}`} className="cursor-pointer accent-[#0EADAD]" /></td><td className="px-3 py-3"><p className="max-w-xs truncate text-xs font-semibold text-[#173F42]" title={file.name}>{file.name}</p><p className="mt-0.5 max-w-xs truncate text-[10px] text-[#8FA3A6]" title={file.key}>{file.key}</p></td><td className="px-4 py-3 text-xs text-[#4A5D61]">{formatBytes(file.size)}</td><td className="px-4 py-3 text-xs text-[#4A5D61]">{formatDate(file.uploadedAt)}</td><td className="px-4 py-3"><span className="rounded-full bg-[#EAF9F4] px-2 py-1 text-[10px] font-bold text-[#078463]">{file.status}</span></td><td className="px-5 py-3"><div className="flex justify-end gap-2"><a href={`/api/admin/storage/download?key=${encodeURIComponent(file.key)}`} className="h-8 px-2.5 rounded-lg bg-[#EAF7F7] text-[#087C7E] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"><Download className="w-3.5 h-3.5" />Unduh</a><button onClick={() => deleteFile(file)} disabled={deletingKey === file.key} className="h-8 px-2.5 rounded-lg bg-[#FFF1EF] text-[#C9382B] text-[11px] font-bold inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer">{deletingKey === file.key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}Hapus</button></div></td></tr>)}{!filteredFiles.length && <tr><td colSpan={6} className="px-5 py-10 text-center text-xs text-[#8FA3A6]">Tidak ada file pada halaman ini.</td></tr>}</tbody></table></div><div className="p-4 border-t border-[#EEF4F4] flex items-center justify-between text-xs"><span className="text-[#6B7E82]">Halaman {page + 1}</span><div className="flex gap-2"><button onClick={previousPage} disabled={page === 0 || loading} className="h-8 px-3 rounded-lg border border-[#D8E8E8] disabled:opacity-50">Sebelumnya</button><button onClick={nextPage} disabled={!data?.hasMore || loading} className="h-8 px-3 rounded-lg border border-[#D8E8E8] disabled:opacity-50">Berikutnya</button></div></div></>}
    </div>
  </section>;
};
