import React, { useEffect, useState } from 'react';
import { Eye, GripVertical, Image, Plus, Save, Trash2, Upload } from 'lucide-react';
import { defaultFormConfig, normalizeFormConfig, type CustomFormField, type FormConfig } from '../../formConfig';
import { uploadFiles } from '../../utils/uploadthing';

export const FormBuilderTab: React.FC = () => {
  const [config, setConfig] = useState<FormConfig>(defaultFormConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [tab, setTab] = useState<'fields' | 'custom' | 'preview'>('fields');
  const [draft, setDraft] = useState({ label: '', type: 'text' as CustomFormField['type'], options: '', required: false, step: 1 as 1 | 2 });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings/registration_form_config')
      .then((res) => res.json())
      .then((data) => setConfig(normalizeFormConfig(data?.value)))
      .finally(() => setLoading(false));
  }, []);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingBanner(true);
      const res = await uploadFiles('mediaUploader', { files: [file] });
      if (res && res[0]) {
        const url = res[0].ufsUrl || res[0].url;
        setConfig((prev) => ({ ...prev, formBannerUrl: url }));
        alert('Banner berhasil diunggah! Klik "Simpan & Terapkan" untuk menyimpan ke database.');
      }
    } catch (err: any) {
      alert(`Gagal mengunggah banner: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setUploadingBanner(false);
      if (e.target) e.target.value = '';
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/registration_form_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: config })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan konfigurasi');
      alert('Form pendaftaran publik berhasil diperbarui.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan konfigurasi');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (id: string, patch: object) =>
    setConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => (field.id === id ? { ...field, ...patch } : field))
    }));

  const addCustom = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.label.trim()) return;
    const field: CustomFormField = {
      id: crypto.randomUUID(),
      label: draft.label.trim(),
      type: draft.type,
      required: draft.required,
      step: draft.step,
      options: ['select', 'radio'].includes(draft.type)
        ? draft.options.split(',').map((item) => item.trim()).filter(Boolean)
        : undefined
    };
    setConfig((prev) => ({ ...prev, customFields: [...prev.customFields, field] }));
    setDraft({ label: '', type: 'text', options: '', required: false, step: 1 });
  };

  if (loading) return <div className="p-12 bg-white rounded-2xl text-center text-xs">Memuat form publik...</div>;

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] flex flex-col sm:flex-row justify-between sm:items-center gap-3.5 sm:gap-4 shadow-xs">
        <div>
          <h2 className="admin-title text-xl sm:text-2xl text-[#173F42]">Form Builder Pendaftaran</h2>
          <p className="text-xs sm:text-[13px] text-[#6B7E82] mt-1">
            Kelola banner (rasio 4:1), informasi, dan semua field yang tampil di formulir pendaftaran publik.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="w-full sm:w-auto justify-center h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] active:scale-[0.99] transition-all text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan & Terapkan'}
        </button>
      </div>

      <div className="hide-horizontal-scrollbar flex gap-2 overflow-x-auto pb-1.5 -mx-1 px-1">
        {(
          [
            ['fields', 'Pengaturan & 12 Field'],
            ['custom', `Field Tambahan (${config.customFields.length})`],
            ['preview', 'Preview Struktur Form']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`whitespace-nowrap shrink-0 px-3.5 sm:px-4 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === id ? 'bg-[#173F42] text-white shadow-xs' : 'bg-white text-[#5A6E72] hover:bg-slate-50 border border-[#E0F2F1]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'fields' && (
        <div className="space-y-5">
          {/* Banner Upload Card (Rasio 4:1) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] space-y-4 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-[#173F42] flex items-center gap-2">
                <Image className="w-4 h-4 text-[#0EADAD] flex-none" />
                Banner Formulir Pendaftaran
              </h3>
              <p className="text-xs text-[#6B7E82] mt-0.5">
                Gambar banner di bagian paling atas formulir pendaftaran. Disarankan rasio 4:1 (misal 1200x300 px atau 800x200 px).
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3">
              {config.formBannerUrl ? (
                <div className="w-full relative group">
                  <div className="w-full aspect-[16/6] sm:aspect-[4/1] min-h-[90px] sm:min-h-[120px] overflow-hidden rounded-xl border border-gray-300 shadow-xs bg-[#e0f7f6]">
                    <img
                      src={config.formBannerUrl}
                      alt="Pratinjau Banner Formulir"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, formBannerUrl: '' })}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    title="Hapus Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[11px]">Hapus</span>
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-[16/6] sm:aspect-[4/1] min-h-[90px] sm:min-h-[120px] bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-semibold text-center p-3">
                  Belum ada gambar banner (Disarankan Rasio 4:1)
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 w-full sm:w-auto">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingBanner}
                  className="w-full sm:w-auto justify-center h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] active:scale-[0.99] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingBanner ? 'Mengunggah Banner...' : 'Unggah Banner'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#26383C] mb-1.5">
                Atau Masukkan URL Gambar Banner Langsung
              </label>
              <input
                type="text"
                value={config.formBannerUrl || ''}
                onChange={(e) => setConfig({ ...config, formBannerUrl: e.target.value })}
                placeholder="https://..."
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 text-xs shadow-xs">
            <label className="block space-y-1">
              <span className="font-bold text-[#26383C]">Judul Form</span>
              <input
                value={config.formTitle}
                onChange={(e) => setConfig({ ...config, formTitle: e.target.value })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-[#26383C]">Deskripsi Form</span>
              <input
                value={config.formDescription}
                onChange={(e) => setConfig({ ...config, formDescription: e.target.value })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-[#26383C]">Nama Kanal Resmi</span>
              <input
                value={config.officialChannelName}
                onChange={(e) => setConfig({ ...config, officialChannelName: e.target.value })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-[#26383C]">URL Kanal Resmi</span>
              <input
                type="url"
                value={config.officialChannelUrl}
                onChange={(e) => setConfig({ ...config, officialChannelUrl: e.target.value })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-[#26383C]">URL Link Grup WhatsApp (Tombol Sukses)</span>
              <input
                type="url"
                value={config.whatsappGroupUrl || ''}
                onChange={(e) => setConfig({ ...config, whatsappGroupUrl: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold text-[#26383C]">URL Kebijakan Kontribusi</span>
              <input
                type="url"
                value={config.contributionPolicyUrl}
                onChange={(e) => setConfig({ ...config, contributionPolicyUrl: e.target.value })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </label>
            <label className="block space-y-1 md:col-span-2">
              <span className="font-bold text-[#26383C]">Metode Pembayaran</span>
              <input
                value={config.paymentMethods.join(', ')}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paymentMethods: e.target.value.split(',').map((v) => v.trim()).filter(Boolean)
                  })
                }
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
              <small className="text-gray-400 block mt-0.5">Pisahkan dengan koma (contoh: Transfer Bank, QRIS, E-Wallet)</small>
            </label>
          </div>

          {[1, 2].map((step) => (
            <div key={step} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0EADAD]" />
                <h3 className="font-bold text-sm sm:text-base text-[#173F42]">Langkah {step}</h3>
              </div>
              <div className="space-y-2.5">
                {config.fields
                  .filter((field) => field.step === step)
                  .map((field) => (
                    <div
                      key={field.id}
                      className="bg-white border border-[#E0F2F1] rounded-2xl p-3.5 sm:p-4 shadow-xs hover:border-[#CDEEEB] transition-all space-y-3 lg:space-y-0 lg:grid lg:grid-cols-[24px_1fr_1fr_auto] lg:gap-3.5 lg:items-center text-xs"
                    >
                      {/* Top row on mobile / Tablet */}
                      <div className="flex items-center justify-between lg:contents">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-300 flex-none" />
                          <span className="lg:hidden font-mono text-[11px] font-bold text-[#087C7E] bg-[#E0F7F6] px-2 py-0.5 rounded-md">
                            {field.id}
                          </span>
                        </div>
                        {/* Checkboxes on mobile */}
                        <div className="flex items-center gap-3 lg:hidden">
                          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#26383C] cursor-pointer select-none bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              checked={field.enabled}
                              onChange={(e) => updateField(field.id, { enabled: e.target.checked })}
                              className="rounded text-[#0EADAD] focus:ring-[#0EADAD]"
                            />
                            <span>Tampil</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#26383C] cursor-pointer select-none bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded text-[#0EADAD] focus:ring-[#0EADAD]"
                            />
                            <span>Wajib</span>
                          </label>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="w-full">
                        <span className="hidden lg:block font-mono text-[10px] font-bold text-[#087C7E] mb-0.5 truncate">
                          {field.id}
                        </span>
                        <span className="lg:hidden font-bold text-[#26383C] block mb-1">Label Field:</span>
                        <input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          placeholder="Label field..."
                          className="w-full h-9 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs bg-white"
                        />
                      </div>

                      <div className="w-full">
                        <span className="font-semibold text-gray-500 block mb-1 lg:mb-0.5 text-[11px]">
                          Helper / Placeholder:
                        </span>
                        <input
                          value={field.helperText || field.placeholder || ''}
                          onChange={(e) =>
                            updateField(field.id, {
                              helperText: e.target.value,
                              placeholder: e.target.value
                            })
                          }
                          placeholder="Petunjuk placeholder..."
                          className="w-full h-9 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs bg-white"
                        />
                      </div>

                      {/* Desktop Checkboxes */}
                      <div className="hidden lg:flex flex-col gap-1.5 min-w-[80px]">
                        <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#26383C] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={field.enabled}
                            onChange={(e) => updateField(field.id, { enabled: e.target.checked })}
                            className="rounded text-[#0EADAD] focus:ring-[#0EADAD]"
                          />
                          <span>Tampil</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#26383C] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="rounded text-[#0EADAD] focus:ring-[#0EADAD]"
                          />
                          <span>Wajib</span>
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <form onSubmit={addCustom} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] space-y-3.5 text-xs shadow-xs">
            <h3 className="font-bold text-sm text-[#173F42]">Tambah Field Baru</h3>
            <div className="space-y-1">
              <label className="font-bold text-[#26383C] block">Label Pertanyaan *</label>
              <input
                required
                placeholder="Contoh: Ukuran Kaos / Komitmen Kehadiran"
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#26383C] block">Tipe Field</label>
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as CustomFormField['type'] })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              >
                <option value="text">Teks Singkat</option>
                <option value="textarea">Teks Panjang (Paragraf)</option>
                <option value="select">Pilihan Dropdown</option>
                <option value="radio">Radio Button</option>
              </select>
            </div>
            {['select', 'radio'].includes(draft.type) && (
              <div className="space-y-1">
                <label className="font-bold text-[#26383C] block">Opsi Pilihan (Pisahkan dengan koma)</label>
                <input
                  placeholder="Contoh: S, M, L, XL, XXL"
                  value={draft.options}
                  onChange={(e) => setDraft({ ...draft, options: e.target.value })}
                  className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="font-bold text-[#26383C] block">Langkah Formulir</label>
              <select
                value={draft.step}
                onChange={(e) => setDraft({ ...draft, step: Number(e.target.value) as 1 | 2 })}
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs sm:text-sm bg-white"
              >
                <option value={1}>Langkah 1 (Data Diri)</option>
                <option value={2}>Langkah 2 (Komitmen & Kontribusi)</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2 font-medium text-[#26383C] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={draft.required}
                onChange={(e) => setDraft({ ...draft, required: e.target.checked })}
                className="rounded text-[#0EADAD] focus:ring-[#0EADAD]"
              />
              <span>Wajib diisi oleh pendaftar</span>
            </label>
            <button
              type="submit"
              className="w-full h-10 bg-[#173F42] hover:bg-[#203B44] text-white rounded-xl font-bold flex justify-center items-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambahkan Field</span>
            </button>
          </form>

          <div className="lg:col-span-2 space-y-2.5">
            {config.customFields.length === 0 ? (
              <div className="bg-white border border-[#E0F2F1] p-8 rounded-2xl text-center text-xs text-[#6B7E82] shadow-xs">
                Belum ada field tambahan yang dibuat. Tambahkan field baru melalui formulir di samping.
              </div>
            ) : (
              config.customFields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white border border-[#E0F2F1] p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs hover:border-[#CDEEEB] transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <strong className="text-sm text-[#173F42] block truncate">{field.label}</strong>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#5A6E72]">
                      <span className="px-2 py-0.5 bg-[#E0F7F6] text-[#087C7E] rounded font-medium">
                        {field.type}
                      </span>
                      <span>·</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded font-medium">
                        Langkah {field.step}
                      </span>
                      <span>·</span>
                      <span className={`px-2 py-0.5 rounded font-semibold ${field.required ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                        {field.required ? 'Wajib' : 'Opsional'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        customFields: prev.customFields.filter((f) => f.id !== field.id)
                      }))
                    }
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer flex-none"
                    title="Hapus Field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div className="max-w-xl mx-auto bg-[#F8FAFB] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E0F2F1] shadow-xs">
          {config.formBannerUrl && (
            <div className="w-full aspect-[16/6] sm:aspect-[4/1] overflow-hidden rounded-xl sm:rounded-2xl mb-4 border border-gray-200 shadow-xs bg-[#e0f7f6]">
              <img
                src={config.formBannerUrl}
                alt="Banner Form"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-center mb-5">
            <Eye className="mx-auto text-[#0EADAD] w-6 h-6 mb-1" />
            <h3 className="font-bold text-lg sm:text-xl text-[#173F42]">{config.formTitle}</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">{config.formDescription}</p>
          </div>
          {[1, 2].map((step) => (
            <div key={step} className="space-y-2.5 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0EADAD]" />
                <strong className="text-xs text-[#173F42]">Langkah {step}</strong>
              </div>
              {[
                ...config.fields.filter((f) => f.step === step && f.enabled),
                ...config.customFields.filter((f) => f.step === step)
              ].map((field) => (
                <div key={field.id} className="bg-white border border-[#E0F2F1] p-3 rounded-xl text-xs shadow-2xs">
                  <div className="font-bold text-[#173F42]">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </div>
                  <div className="h-9 bg-gray-50 border border-gray-200 rounded-lg mt-1.5 flex items-center px-3 text-[11px] text-gray-400">
                    {'helperText' in field && field.helperText ? field.helperText : 'placeholder' in field && field.placeholder ? field.placeholder : 'Masukkan data...'}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
