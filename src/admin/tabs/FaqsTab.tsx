import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, HelpCircle, Check, X } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex?: number;
}

export const FaqsTab: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('kegiatan');
  const [saving, setSaving] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('kegiatan');
    setIsModalOpen(true);
  };

  const openEditModal = (f: FaqItem) => {
    setEditingId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `/api/faqs/${editingId}` : '/api/faqs';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, category }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert('Gagal menyimpan FAQ');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus pertanyaan ini?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFaqs(faqs.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#173F42]">FAQ & Tanya Jawab</h2>
          <p className="text-xs text-[#6B7E82] mt-0.5">
            Atur pertanyaan dan jawaban yang tampil di accordion FAQ beranda
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="h-10 px-4 bg-[#0EADAD] hover:bg-[#0C9696] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pertanyaan</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-[#6B7E82]">
          Memuat FAQ...
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="bg-white p-4 rounded-2xl border border-[#E0F2F1] flex items-start justify-between gap-4 shadow-xs">
              <div className="space-y-1 text-xs">
                <span className="px-2 py-0.5 bg-[#E0F7F6] text-[#087C7E] font-bold text-[10px] rounded uppercase">
                  {f.category}
                </span>
                <h4 className="font-bold text-[#173F42] text-sm pt-1">{f.question}</h4>
                <p className="text-[#6B7E82] leading-relaxed pt-1">{f.answer}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-none">
                <button
                  onClick={() => openEditModal(f)}
                  className="h-8 px-2.5 bg-[#F0F7F7] text-[#0EADAD] rounded-lg font-bold flex items-center gap-1 hover:bg-[#E0F7F6]"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="h-8 w-8 bg-[#FFF2F0] text-[#CF1322] rounded-lg flex items-center justify-center hover:bg-[#FFEBE8]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-[#E0F2F1]">
            <div className="px-6 py-4 border-b border-[#F0F7F7] flex items-center justify-between bg-[#FAFAFA]">
              <h3 className="font-bold text-sm text-[#173F42]">
                {editingId ? 'Edit FAQ' : 'Tambah FAQ Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#26383C] mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-2.5 border border-[#D5DFE0] rounded-xl outline-none"
                >
                  <option value="kegiatan">Kegiatan</option>
                  <option value="pendaftaran">Pendaftaran</option>
                  <option value="komunitas">Komunitas</option>
                  <option value="partner">Partner & Kolaborasi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#26383C] mb-1">Pertanyaan *</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Contoh: Apakah ada sertifikat kegiatan?"
                  className="w-full h-10 px-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#26383C] mb-1">Jawaban *</label>
                <textarea
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Tuliskan jawaban yang ramah dan informatif..."
                  className="w-full p-3 border border-[#D5DFE0] rounded-xl outline-none focus:border-[#0EADAD]"
                  required
                />
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
                  {saving ? 'Menyimpan...' : 'Simpan FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
