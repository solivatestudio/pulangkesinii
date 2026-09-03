import React, { useEffect, useState } from 'react';
import { Eye, GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import { defaultFormConfig, normalizeFormConfig, type CustomFormField, type FormConfig } from '../../formConfig';

export const FormBuilderTab: React.FC = () => {
  const [config, setConfig] = useState<FormConfig>(defaultFormConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'fields' | 'custom' | 'preview'>('fields');
  const [draft, setDraft] = useState({ label: '', type: 'text' as CustomFormField['type'], options: '', required: false, step: 1 as 1 | 2 });

  useEffect(() => {
    fetch('/api/settings/registration_form_config').then((res) => res.json()).then((data) => setConfig(normalizeFormConfig(data?.value))).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/registration_form_config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: config }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan konfigurasi');
      alert('Form publik berhasil diperbarui.');
    } catch (error) { alert(error instanceof Error ? error.message : 'Gagal menyimpan konfigurasi'); }
    finally { setSaving(false); }
  };

  const updateField = (id: string, patch: object) => setConfig((prev) => ({ ...prev, fields: prev.fields.map((field) => field.id === id ? { ...field, ...patch } : field) }));
  const addCustom = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.label.trim()) return;
    const field: CustomFormField = { id: crypto.randomUUID(), label: draft.label.trim(), type: draft.type, required: draft.required, step: draft.step, options: ['select', 'radio'].includes(draft.type) ? draft.options.split(',').map((item) => item.trim()).filter(Boolean) : undefined };
    setConfig((prev) => ({ ...prev, customFields: [...prev.customFields, field] }));
    setDraft({ label: '', type: 'text', options: '', required: false, step: 1 });
  };

  if (loading) return <div className="p-12 bg-white rounded-2xl text-center text-xs">Memuat form publik...</div>;
  return <div className="space-y-5">
    <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] flex flex-col sm:flex-row justify-between gap-4">
      <div><h2 className="admin-title text-2xl text-[#173F42]">Form Builder Pendaftaran</h2><p className="text-xs text-[#6B7E82] mt-1">Semua field di bawah ini adalah field yang benar-benar tampil di form publik.</p></div>
      <button onClick={save} disabled={saving} className="h-10 px-5 bg-[#0EADAD] text-white text-xs font-bold rounded-xl flex items-center gap-2"><Save className="w-4 h-4" />{saving ? 'Menyimpan...' : 'Simpan & Terapkan'}</button>
    </div>
    <div className="flex gap-2 overflow-x-auto">{([['fields','11 Field Publik'],['custom',`Field Tambahan (${config.customFields.length})`],['preview','Preview Struktur']] as const).map(([id,label]) => <button key={id} onClick={() => setTab(id)} className={`px-4 h-9 rounded-xl text-xs font-bold ${tab === id ? 'bg-[#173F42] text-white' : 'bg-white text-[#5A6E72]'}`}>{label}</button>)}</div>

    {tab === 'fields' && <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border grid md:grid-cols-2 gap-4 text-xs">
        <label>Judul Form<input value={config.formTitle} onChange={(e) => setConfig({...config, formTitle:e.target.value})} className="block w-full h-10 px-3 mt-1 border rounded-xl" /></label>
        <label>Deskripsi Form<input value={config.formDescription} onChange={(e) => setConfig({...config, formDescription:e.target.value})} className="block w-full h-10 px-3 mt-1 border rounded-xl" /></label>
        <label>Nama Kanal Resmi<input value={config.officialChannelName} onChange={(e) => setConfig({...config, officialChannelName:e.target.value})} className="block w-full h-10 px-3 mt-1 border rounded-xl" /></label>
        <label>URL Kanal Resmi<input type="url" value={config.officialChannelUrl} onChange={(e) => setConfig({...config, officialChannelUrl:e.target.value})} className="block w-full h-10 px-3 mt-1 border rounded-xl" /></label>
        <label>URL Link Grup WhatsApp (Tombol Sukses)<input type="url" value={config.whatsappGroupUrl || ''} onChange={(e) => setConfig({...config, whatsappGroupUrl:e.target.value})} placeholder="https://chat.whatsapp.com/..." className="block w-full h-10 px-3 mt-1 border rounded-xl" /></label>
        <label>URL Kebijakan Kontribusi<input type="url" value={config.contributionPolicyUrl} onChange={(e) => setConfig({...config, contributionPolicyUrl:e.target.value})} className="block w-full h-10 px-3 mt-1 border rounded-xl" /></label>
        <label className="md:col-span-2">Metode Pembayaran<input value={config.paymentMethods.join(', ')} onChange={(e) => setConfig({...config, paymentMethods:e.target.value.split(',').map((v)=>v.trim()).filter(Boolean)})} className="block w-full h-10 px-3 mt-1 border rounded-xl" /><small>Pisahkan dengan koma</small></label>
      </div>
      {[1,2].map((step) => <div key={step} className="space-y-2"><h3 className="font-bold text-sm text-[#173F42]">Langkah {step}</h3>{config.fields.filter((field)=>field.step===step).map((field)=><div key={field.id} className="bg-white border rounded-2xl p-4 grid md:grid-cols-[24px_1fr_1fr_auto] gap-3 items-center text-xs"><GripVertical className="w-4 h-4 text-gray-300"/><div><strong>{field.id}</strong><input value={field.label} onChange={(e)=>updateField(field.id,{label:e.target.value})} className="block w-full h-9 px-3 mt-1 border rounded-lg" /></div><div><span>Helper / placeholder</span><input value={field.helperText || field.placeholder || ''} onChange={(e)=>updateField(field.id,{helperText:e.target.value,placeholder:e.target.value})} className="block w-full h-9 px-3 mt-1 border rounded-lg" /></div><div className="flex md:flex-col gap-3"><label><input type="checkbox" checked={field.enabled} onChange={(e)=>updateField(field.id,{enabled:e.target.checked})}/> Tampil</label><label><input type="checkbox" checked={field.required} onChange={(e)=>updateField(field.id,{required:e.target.checked})}/> Wajib</label></div></div>)}</div>)}
    </div>}

    {tab === 'custom' && <div className="grid lg:grid-cols-3 gap-5"><form onSubmit={addCustom} className="bg-white p-5 rounded-2xl border space-y-3 text-xs"><h3 className="font-bold">Tambah Field</h3><input required placeholder="Label pertanyaan" value={draft.label} onChange={(e)=>setDraft({...draft,label:e.target.value})} className="w-full h-10 px-3 border rounded-xl"/><select value={draft.type} onChange={(e)=>setDraft({...draft,type:e.target.value as CustomFormField['type']})} className="w-full h-10 px-3 border rounded-xl"><option value="text">Teks singkat</option><option value="textarea">Teks panjang</option><option value="select">Dropdown</option><option value="radio">Radio</option></select>{['select','radio'].includes(draft.type)&&<input placeholder="Opsi, dipisahkan, koma" value={draft.options} onChange={(e)=>setDraft({...draft,options:e.target.value})} className="w-full h-10 px-3 border rounded-xl"/>}<select value={draft.step} onChange={(e)=>setDraft({...draft,step:Number(e.target.value) as 1|2})} className="w-full h-10 px-3 border rounded-xl"><option value={1}>Langkah 1</option><option value={2}>Langkah 2</option></select><label><input type="checkbox" checked={draft.required} onChange={(e)=>setDraft({...draft,required:e.target.checked})}/> Wajib diisi</label><button className="w-full h-10 bg-[#173F42] text-white rounded-xl font-bold flex justify-center items-center gap-2"><Plus className="w-4 h-4"/>Tambahkan</button></form><div className="lg:col-span-2 space-y-2">{config.customFields.map((field)=><div key={field.id} className="bg-white border p-4 rounded-xl flex justify-between text-xs"><div><strong>{field.label}</strong><p>{field.type} · Langkah {field.step} · {field.required?'Wajib':'Opsional'}</p></div><button onClick={()=>setConfig((prev)=>({...prev,customFields:prev.customFields.filter((f)=>f.id!==field.id)}))}><Trash2 className="w-4 h-4 text-red-500"/></button></div>)}</div></div>}

    {tab === 'preview' && <div className="max-w-xl mx-auto bg-[#f8fbfb] p-5 rounded-3xl border"><div className="text-center mb-4"><Eye className="mx-auto text-[#0EADAD]"/><h3 className="font-bold text-xl">{config.formTitle}</h3><p className="text-xs text-gray-500">{config.formDescription}</p></div>{[1,2].map((step)=><div key={step} className="space-y-2 mb-5"><strong className="text-xs">Langkah {step}</strong>{[...config.fields.filter((f)=>f.step===step&&f.enabled),...config.customFields.filter((f)=>f.step===step)].map((field)=><div key={field.id} className="bg-white border p-3 rounded-xl text-xs"><b>{field.label}</b>{field.required&&<span className="text-red-500"> *</span>}<div className="h-9 bg-gray-50 border rounded-lg mt-2"/></div>)}</div>)}</div>}
  </div>;
};
