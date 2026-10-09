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
      <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="admin-title text-2xl text-[#173F42]">Form Builder Pendaftaran</h2>
          <p className="text-xs text-[#6B7E82] mt-1">
            Kelola banner (rasio 4:1), informasi, dan semua field yang tampil di formulir pendaftaran publik.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] transition-colors text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan & Terapkan'}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
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
            className={`px-4 h-9 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              tab === id ? 'bg-[#173F42] text-white' : 'bg-white text-[#5A6E72] hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'fields' && (
        <div className="space-y-5">
          {/* Banner Upload Card (Rasio 4:1) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#173F42] flex items-center gap-2">
                  <Image className="w-4 h-4 text-[#0EADAD]" />
                  Banner Formulir Pendaftaran
                </h3>
                <p className="text-xs text-[#6B7E82] mt-0.5">
                  Gambar banner di bagian paling atas formulir pendaftaran. Disarankan rasio 4:1 (misal 1200x300 px atau 800x200 px).
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3">
              {config.formBannerUrl ? (
                <div className="w-full relative group">
                  <div className="w-full aspect-[4/1] overflow-hidden rounded-xl border border-gray-300 shadow-xs bg-[#e0f7f6]">
                    <img
                      src={config.formBannerUrl}
                      alt="Pratinjau Banner Formulir"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, formBannerUrl: '' })}
                    className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    title="Hapus Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[11px]">Hapus</span>
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-[4/1] bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-semibold">
                  Belum ada gambar banner (Rasio 4:1)
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
                  className="h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] active:scale-[0.99] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingBanner ? 'Mengunggah Banner...' : 'Unggah Banner'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#26383C] mb-1">
                Atau Masukkan URL Gambar Banner Langsung
              </label>
              <input
                type="text"
                value={config.formBannerUrl || ''}
                onChange={(e) => setConfig({ ...config, formBannerUrl: e.target.value })}
                placeholder="https://..."
                className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD] text-xs"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border grid md:grid-cols-2 gap-4 text-xs">
            <label>
              Judul Form
              <input
                value={config.formTitle}
                onChange={(e) => setConfig({ ...config, formTitle: e.target.value })}
                className="block w-full h-10 px-3 mt-1 border rounded-xl"
              />
            </label>
            <label>
              Deskripsi Form
              <input
                value={config.formDescription}
                onChange={(e) => setConfig({ ...config, formDescription: e.target.value })}
                className="block w-full h-10 px-3 mt-1 border rounded-xl"
              />
            </label>
            <label>
              Nama Kanal Resmi
              <input
                value={config.officialChannelName}
                onChange={(e) => setConfig({ ...config, officialChannelName: e.target.value })}
                className="block w-full h-10 px-3 mt-1 border rounded-xl"
              />
            </label>
            <label>
              URL Kanal Resmi
              <input
                type="url"
                value={config.officialChannelUrl}
                onChange={(e) => setConfig({ ...config, officialChannelUrl: e.target.value })}
                className="block w-full h-10 px-3 mt-1 border rounded-xl"
              />
            </label>
            <label>
              URL Link Grup WhatsApp (Tombol Sukses)
              <input
                type="url"
                value={config.whatsappGroupUrl || ''}
                onChange={(e) => setConfig({ ...config, whatsappGroupUrl: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="block w-full h-10 px-3 mt-1 border rounded-xl"
              />
            </label>
            <label>
              URL Kebijakan Kontribusi
              <input
                type="url"
                value={config.contributionPolicyUrl}
                onChange={(e) => setConfig({ ...config, contributionPolicyUrl: e.target.value })}
                className="block w-full h-10 px-3 mt-1 border rounded-xl"
              />
            </label>
            <label className="md:col-span-2">
              Metode Pembayaran
              <input
                value={config.paymentMethods.join(', ')}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paymentMethods: e.target.value.split(',').map((v) => v.trim()).filter(Boolean)
                  })
                }
                className="block w-full h-10 px-3 mt-1 border rounded-xl"
              />
              <small className="text-gray-400">Pisahkan dengan koma</small>
            </label>
          </div>

          {[1, 2].map((step) => (
            <div key={step} className="space-y-2">
              <h3 className="font-bold text-sm text-[#173F42]">Langkah {step}</h3>
              {config.fields
                .filter((field) => field.step === step)
                .map((field) => (
                  <div
                    key={field.id}
                    className="bg-white border rounded-2xl p-4 grid md:grid-cols-[24px_1fr_1fr_auto] gap-3 items-center text-xs"
                  >
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <div>
                      <strong>{field.id}</strong>
                      <input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="block w-full h-9 px-3 mt-1 border rounded-lg"
                      />
                    </div>
                    <div>
                      <span>Helper / placeholder</span>
                      <input
                        value={field.helperText || field.placeholder || ''}
                        onChange={(e) =>
                          updateField(field.id, {
                            helperText: e.target.value,
                            placeholder: e.target.value
                          })
                        }
                        className="block w-full h-9 px-3 mt-1 border rounded-lg"
                      />
                    </div>
                    <div className="flex md:flex-col gap-3">
                      <label>
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) => updateField(field.id, { enabled: e.target.checked })}
                        />{' '}
                        Tampil
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        />{' '}
                        Wajib
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'custom' && (
        <div className="grid lg:grid-cols-3 gap-5">
          <form onSubmit={addCustom} className="bg-white p-5 rounded-2xl border space-y-3 text-xs">
            <h3 className="font-bold">Tambah Field</h3>
            <input
              required
              placeholder="Label pertanyaan"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              className="w-full h-10 px-3 border rounded-xl"
            />
            <select
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as CustomFormField['type'] })}
              className="w-full h-10 px-3 border rounded-xl"
            >
              <option value="text">Teks singkat</option>
              <option value="textarea">Teks panjang</option>
              <option value="select">Dropdown</option>
              <option value="radio">Radio</option>
            </select>
            {['select', 'radio'].includes(draft.type) && (
              <input
                placeholder="Opsi, dipisahkan, koma"
                value={draft.options}
                onChange={(e) => setDraft({ ...draft, options: e.target.value })}
                className="w-full h-10 px-3 border rounded-xl"
              />
            )}
            <select
              value={draft.step}
              onChange={(e) => setDraft({ ...draft, step: Number(e.target.value) as 1 | 2 })}
              className="w-full h-10 px-3 border rounded-xl"
            >
              <option value={1}>Langkah 1</option>
              <option value={2}>Langkah 2</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={draft.required}
                onChange={(e) => setDraft({ ...draft, required: e.target.checked })}
              />{' '}
              Wajib diisi
            </label>
            <button className="w-full h-10 bg-[#173F42] text-white rounded-xl font-bold flex justify-center items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Tambahkan
            </button>
          </form>
          <div className="lg:col-span-2 space-y-2">
            {config.customFields.map((field) => (
              <div key={field.id} className="bg-white border p-4 rounded-xl flex justify-between text-xs">
                <div>
                  <strong>{field.label}</strong>
                  <p>
                    {field.type} · Langkah {field.step} · {field.required ? 'Wajib' : 'Opsional'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      customFields: prev.customFields.filter((f) => f.id !== field.id)
                    }))
                  }
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div className="max-w-xl mx-auto bg-[#f8fbfb] p-5 rounded-3xl border">
          {config.formBannerUrl && (
            <div className="w-full aspect-[4/1] overflow-hidden rounded-2xl mb-4 border border-gray-200 shadow-xs bg-[#e0f7f6]">
              <img
                src={config.formBannerUrl}
                alt="Banner Form"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-center mb-4">
            <Eye className="mx-auto text-[#0EADAD]" />
            <h3 className="font-bold text-xl">{config.formTitle}</h3>
            <p className="text-xs text-gray-500">{config.formDescription}</p>
          </div>
          {[1, 2].map((step) => (
            <div key={step} className="space-y-2 mb-5">
              <strong className="text-xs">Langkah {step}</strong>
              {[
                ...config.fields.filter((f) => f.step === step && f.enabled),
                ...config.customFields.filter((f) => f.step === step)
              ].map((field) => (
                <div key={field.id} className="bg-white border p-3 rounded-xl text-xs">
                  <b>{field.label}</b>
                  {field.required && <span className="text-red-500"> *</span>}
                  <div className="h-9 bg-gray-50 border rounded-lg mt-2" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
