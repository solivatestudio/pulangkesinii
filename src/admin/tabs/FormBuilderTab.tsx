import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  CheckCircle2, 
  Layers, 
  Upload, 
  Settings2, 
  HelpCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { defaultFormConfig as defaultConfig, normalizeFormConfig, type CustomFormField, type FormConfig } from '../../formConfig';

export const FormBuilderTab: React.FC = () => {
  const [config, setConfig] = useState<FormConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'fields' | 'custom' | 'preview'>('fields');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New custom field draft
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'textarea' | 'select' | 'radio'>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldStep, setNewFieldStep] = useState<1 | 2>(1);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings/registration_form_config');
      if (res.ok) {
        const data = await res.json();
        setConfig(normalizeFormConfig(data?.value));
      }
    } catch (err) {
      console.error('Failed to load form configuration', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/settings/registration_form_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: config }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to save config', err);
      alert('Gagal menyimpan konfigurasi form.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    const newField: CustomFormField = {
      id: `custom-${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      options: ['select', 'radio'].includes(newFieldType) ? newFieldOptions.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      required: newFieldRequired,
      step: newFieldStep,
    };

    setConfig((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));

    setNewFieldLabel('');
    setNewFieldOptions('');
    setNewFieldRequired(false);
  };

  const handleDeleteCustomField = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((f) => f.id !== id),
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-xs text-[#6B7E82] border border-[#E0F2F1]">
        Memuat konfigurasi form pendaftaran...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div>
          <h2 className="admin-title text-2xl text-[#173F42]">Form Builder Pendaftaran</h2>
          <p className="text-xs text-[#6B7E82] mt-1">
            Atur persyaratan upload, syarat pendaftaran, teks instruksi, dan tambah pertanyaan kustom di web publik
          </p>
        </div>
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-[#E6FFFA] border border-[#B2F5EA] text-[#00A389] text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Konfigurasi form berhasil disimpan dan langsung aktif di formulir pendaftaran website!</span>
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-[#E0F2F1] pb-2">
        <button
          onClick={() => setActiveSubTab('fields')}
          className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'fields'
              ? 'bg-[#0EADAD] text-white'
              : 'bg-white text-[#5A6E72] hover:bg-[#F2F8F8]'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Syarat & Bukti Upload</span>
        </button>
        <button
          onClick={() => setActiveSubTab('custom')}
          className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'custom'
              ? 'bg-[#0EADAD] text-white'
              : 'bg-white text-[#5A6E72] hover:bg-[#F2F8F8]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Pertanyaan Kustom ({config.customFields.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('preview')}
          className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'preview'
              ? 'bg-[#0EADAD] text-white'
              : 'bg-white text-[#5A6E72] hover:bg-[#F2F8F8]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview Form Publik</span>
        </button>
      </div>

      {/* Tab 1: Syarat & Bukti Upload */}
      {activeSubTab === 'fields' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: Informasi Header Formulir */}
          <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <FileText className="w-4 h-4 text-[#0EADAD]" />
              <h3 className="text-sm font-bold text-[#173F42]">Header & Kebijakan Form</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F42] mb-1">Judul Formulir</label>
              <input
                type="text"
                value={config.formTitle}
                onChange={(e) => setConfig({ ...config, formTitle: e.target.value })}
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F42] mb-1">Deskripsi Pengantar</label>
              <textarea
                rows={2}
                value={config.formDescription}
                onChange={(e) => setConfig({ ...config, formDescription: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F42] mb-1">Link Dokumen Kebijakan Biaya</label>
              <input
                type="text"
                value={config.contributionPolicyUrl}
                onChange={(e) => setConfig({ ...config, contributionPolicyUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173F42] mb-1">Akun Saluran Resmi (Instagram/Sosmed)</label>
              <input
                type="text"
                value={config.officialChannelName}
                onChange={(e) => setConfig({ ...config, officialChannelName: e.target.value })}
                placeholder="@pulangkesinii"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#173F42] mb-1">URL Saluran Resmi</label>
              <input type="url" value={config.officialChannelUrl} onChange={(e) => setConfig({ ...config, officialChannelUrl: e.target.value })} className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none" />
            </div>
          </div>

          {/* Card 2: Pengaturan Bukti Upload & Syarat */}
          <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Upload className="w-4 h-4 text-[#0EADAD]" />
              <h3 className="text-sm font-bold text-[#173F42]">Persyaratan Bukti Upload (Step 2)</h3>
            </div>

            {/* Bukti Transfer Kontribusi */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#EAF2F2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173F42]">Bukti Transfer Biaya Kontribusi</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={config.enableContributionProof}
                    onChange={(e) => setConfig({ ...config, enableContributionProof: e.target.checked })}
                    className="accent-[#0EADAD]"
                  />
                  <span className="text-[11px] font-semibold text-[#4A5D61]">Aktifkan Upload</span>
                </label>
              </div>
              {config.enableContributionProof && (
                <div className="space-y-2 pt-1 text-xs">
                  <input type="text" value={config.contributionProofLabel} onChange={(e) => setConfig({ ...config, contributionProofLabel: e.target.value })} className="w-full h-8 px-3 text-[11px] rounded-lg border border-[#D5DFE0] bg-white outline-none" />
                  <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.contributionProofRequired}
                    onChange={(e) => setConfig({ ...config, contributionProofRequired: e.target.checked })}
                    className="accent-[#0EADAD]"
                  />
                  <span className="text-[#6B7E82] text-[11px]">Wajib diisi (Required)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Bukti Tag Teman */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#EAF2F2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173F42]">Bukti Tag 3 Teman</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={config.enableTagFriends}
                    onChange={(e) => setConfig({ ...config, enableTagFriends: e.target.checked })}
                    className="accent-[#0EADAD]"
                  />
                  <span className="text-[11px] font-semibold text-[#4A5D61]">Aktifkan Upload</span>
                </label>
              </div>
              {config.enableTagFriends && (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={config.tagFriendsLabel}
                    onChange={(e) => setConfig({ ...config, tagFriendsLabel: e.target.value })}
                    placeholder="Label teks..."
                    className="w-full h-8 px-3 text-[11px] rounded-lg border border-[#D5DFE0] bg-white outline-none"
                  />
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.tagFriendsRequired}
                      onChange={(e) => setConfig({ ...config, tagFriendsRequired: e.target.checked })}
                      className="accent-[#0EADAD]"
                    />
                    <span className="text-[#6B7E82] text-[11px]">Wajib diisi (Required)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Bukti Repost Story */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#EAF2F2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173F42]">Bukti Repost IG Story</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={config.enableRepostStory}
                    onChange={(e) => setConfig({ ...config, enableRepostStory: e.target.checked })}
                    className="accent-[#0EADAD]"
                  />
                  <span className="text-[11px] font-semibold text-[#4A5D61]">Aktifkan Upload</span>
                </label>
              </div>
              {config.enableRepostStory && (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={config.repostStoryLabel}
                    onChange={(e) => setConfig({ ...config, repostStoryLabel: e.target.value })}
                    placeholder="Label teks..."
                    className="w-full h-8 px-3 text-[11px] rounded-lg border border-[#D5DFE0] bg-white outline-none"
                  />
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.repostStoryRequired}
                      onChange={(e) => setConfig({ ...config, repostStoryRequired: e.target.checked })}
                      className="accent-[#0EADAD]"
                    />
                    <span className="text-[#6B7E82] text-[11px]">Wajib diisi (Required)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Pertanyaan Motivasi / Alasan */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#EAF2F2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173F42]">Pertanyaan Alasan / Motivasi</span>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.reasonRequired}
                    onChange={(e) => setConfig({ ...config, reasonRequired: e.target.checked })}
                    className="accent-[#0EADAD]"
                  />
                  <span className="text-[11px] font-semibold text-[#4A5D61]">Wajib diisi</span>
                </label>
              </div>
              <input
                type="text"
                value={config.reasonLabel}
                onChange={(e) => setConfig({ ...config, reasonLabel: e.target.value })}
                className="w-full h-8 px-3 text-[11px] rounded-lg border border-[#D5DFE0] bg-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pertanyaan Kustom */}
      {activeSubTab === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form Tambah Field Baru */}
          <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Plus className="w-4 h-4 text-[#0EADAD]" />
              <h3 className="text-sm font-bold text-[#173F42]">Tambah Field Pertanyaan</h3>
            </div>

            <form onSubmit={handleAddCustomField} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#173F42] mb-1">Label Pertanyaan</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="Misal: Ukuran Kaos / Nomor Darurat"
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173F42] mb-1">Tipe Input</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none bg-white"
                >
                  <option value="text">Teks Singkat</option>
                  <option value="textarea">Teks Panjang (Catatan/Alasan)</option>
                  <option value="select">Pilihan Dropdown</option>
                  <option value="radio">Pilihan Radio</option>
                </select>
              </div>

              {['select', 'radio'].includes(newFieldType) && (
                <div>
                  <label className="block text-xs font-semibold text-[#173F42] mb-1">
                    Daftar Pilihan (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="S, M, L, XL, XXL"
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#173F42] mb-1">Langkah (Step)</label>
                  <select
                    value={newFieldStep}
                    onChange={(e) => setNewFieldStep(Number(e.target.value) as 1 | 2)}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] outline-none bg-white"
                  >
                    <option value={1}>Step 1 (Data Diri)</option>
                    <option value={2}>Step 2 (Persyaratan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#173F42] mb-1">Wajib Diisi</label>
                  <div className="h-10 flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="accent-[#0EADAD]"
                      />
                      <span className="text-[#4A5D61] text-xs font-semibold">Ya, Wajib</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-[#173F42] hover:bg-[#204F53] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambahkan ke Form</span>
              </button>
            </form>
          </div>

          {/* Daftar Field Kustom */}
          <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0EADAD]" />
                <h3 className="text-sm font-bold text-[#173F42]">Field Kustom Aktif ({config.customFields.length})</h3>
              </div>
              <span className="text-[11px] text-[#6B7E82]">Otomatis tampil di form peserta</span>
            </div>

            {config.customFields.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8FA3A6] border-2 border-dashed border-[#EAF2F2] rounded-xl">
                Belum ada pertanyaan kustom. Tambahkan field baru melalui form di sebelah kiri.
              </div>
            ) : (
              <div className="space-y-2.5">
                {config.customFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-3.5 rounded-xl border border-[#E0F2F1] bg-[#F8FAFA] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#173F42]">{field.label}</span>
                        {field.required && (
                          <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            Wajib
                          </span>
                        )}
                        <span className="text-[10px] bg-[#E0F7F6] text-[#087C7E] px-2 py-0.5 rounded-full font-semibold">
                          Step {field.step}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B7E82] mt-0.5">
                        Tipe: <strong className="capitalize">{field.type}</strong>
                        {field.options && ` · Opsi: [${field.options.join(', ')}]`}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCustomField(field.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Hapus field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Live Preview Form */}
      {activeSubTab === 'preview' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E0F2F1] max-w-xl mx-auto shadow-xs space-y-5">
          <div className="text-center pb-4 border-b border-[#F0F7F7]">
            <div className="w-10 h-10 rounded-2xl bg-[#E0F7F6] p-1.5 flex items-center justify-center mx-auto mb-2.5 border border-[#CDEEEB]">
              <img src="/assets/logo-palette.png" alt="Pulangkesinii" className="w-full h-full object-contain" />
            </div>
            <h3 className="admin-title text-2xl text-[#173F42]">{config.formTitle}</h3>
            <p className="text-xs text-[#6B7E82] max-w-md mx-auto mt-1">{config.formDescription}</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-[#173F42] mb-1">Nama Lengkap *</label>
              <input
                type="text"
                disabled
                placeholder="Nama peserta..."
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#173F42] mb-1">Nomor WhatsApp Aktif *</label>
              <input
                type="text"
                disabled
                placeholder="0812xxxx"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400"
              />
            </div>

            {/* Custom fields step 1 */}
            {config.customFields
              .filter((f) => f.step === 1)
              .map((f) => (
                <div key={f.id}>
                  <label className="block font-semibold text-[#173F42] mb-1">
                    {f.label} {f.required && '*'}
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder={`[Field Kustom: ${f.label}]`}
                    className="w-full h-10 px-3 rounded-xl border border-[#0EADAD]/30 bg-[#F0FDF4] text-[#087C7E]"
                  />
                </div>
              ))}

            <div className="pt-3 border-t border-gray-100">
              <span className="text-[11px] font-bold text-[#8FA3A6] block uppercase mb-2">Step 2: Persyaratan</span>

              {config.enableContributionProof && (
                <div className="p-3 mb-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-between">
                  <span>Upload Bukti Pembayaran {config.contributionProofRequired && '*'}</span>
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
              )}

              {config.enableTagFriends && (
                <div className="p-3 mb-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-between">
                  <span>{config.tagFriendsLabel} {config.tagFriendsRequired && '*'}</span>
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
              )}

              {config.enableRepostStory && (
                <div className="p-3 mb-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-between">
                  <span>{config.repostStoryLabel} {config.repostStoryRequired && '*'}</span>
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
              )}

              {/* Custom fields step 2 */}
              {config.customFields
                .filter((f) => f.step === 2)
                .map((f) => (
                  <div key={f.id} className="mt-2">
                    <label className="block font-semibold text-[#173F42] mb-1">
                      {f.label} {f.required && '*'}
                    </label>
                    <input
                      type="text"
                      disabled
                      placeholder={`[Field Kustom: ${f.label}]`}
                      className="w-full h-10 px-3 rounded-xl border border-[#0EADAD]/30 bg-[#F0FDF4] text-[#087C7E]"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
