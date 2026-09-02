import React, { useState, useEffect } from 'react';
import { Save, Check, CreditCard, Phone, Mail, Instagram, MapPin } from 'lucide-react';
import { UploadButton } from '../../utils/uploadthing';

export const SettingsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savingAccounts, setSavingAccounts] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const [accounts, setAccounts] = useState({
    bca: { bank: 'BCA', accountNumber: '1234567890', accountName: 'Pulangkesinii Komunitas' },
    mandiri: { bank: 'Mandiri', accountNumber: '9876543210', accountName: 'Pulangkesinii Komunitas' },
    seabank: { bank: 'SeaBank', accountNumber: '9012345678', accountName: 'Pulangkesinii Komunitas' },
    gopay: { bank: 'GoPay / OVO', accountNumber: '085779321681', accountName: 'Pulangkesinii' },
    qrisImageUrl: '/assets/decor-1.png',
  });

  const [contact, setContact] = useState({
    whatsappNumber: '6285779321681',
    whatsappFormatted: '+62 857-7932-1681',
    email: 'pulangkesinii@gmail.com',
    instagram: '@pulangkesinii',
    tiktok: '@Pulangkesinii_',
    basecamp: 'Jakarta Timur',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.payment_accounts) setAccounts(data.payment_accounts);
        if (data.contact_info) setContact(data.contact_info);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveAccounts = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAccounts(true);
    try {
      const res = await fetch('/api/settings/payment_accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: accounts }),
      });
      if (res.ok) alert('Rekening pembayaran berhasil disimpan ke database!');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAccounts(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      const res = await fetch('/api/settings/contact_info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: contact }),
      });
      if (res.ok) alert('Info kontak berhasil disimpan ke database!');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingContact(false);
    }
  };

  if (loading) {
    return <div className="p-12 bg-white rounded-2xl text-center text-xs text-gray-500">Memuat pengaturan...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <h2 className="admin-title text-2xl text-[#173F42]">Pengaturan Website</h2>
        <p className="text-xs text-[#6B7E82] mt-1">
          Atur rekening pembayaran biaya kontribusi dan informasi kontak resmi yang ditampilkan di website
        </p>
      </div>

      {/* Rekening Pembayaran */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
          <CreditCard className="w-5 h-5 text-[#0EADAD]" />
          <div>
            <h3 className="font-bold text-sm text-[#173F42]">Rekening Transfer Biaya Kontribusi</h3>
            <p className="text-xs text-gray-500">Rekening yang ditampilkan kepada pendaftar di formulir registrasi</p>
          </div>
        </div>

        <form onSubmit={handleSaveAccounts} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-[#173F42] block">BCA</span>
              <input
                type="text"
                value={accounts.bca.accountNumber}
                onChange={(e) => setAccounts({ ...accounts, bca: { ...accounts.bca, accountNumber: e.target.value } })}
                placeholder="Nomor Rekening"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
              <input
                type="text"
                value={accounts.bca.accountName}
                onChange={(e) => setAccounts({ ...accounts, bca: { ...accounts.bca, accountName: e.target.value } })}
                placeholder="Atas Nama"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-[#173F42] block">Mandiri</span>
              <input
                type="text"
                value={accounts.mandiri.accountNumber}
                onChange={(e) => setAccounts({ ...accounts, mandiri: { ...accounts.mandiri, accountNumber: e.target.value } })}
                placeholder="Nomor Rekening"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
              <input
                type="text"
                value={accounts.mandiri.accountName}
                onChange={(e) => setAccounts({ ...accounts, mandiri: { ...accounts.mandiri, accountName: e.target.value } })}
                placeholder="Atas Nama"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-[#173F42] block">SeaBank</span>
              <input
                type="text"
                value={accounts.seabank.accountNumber}
                onChange={(e) => setAccounts({ ...accounts, seabank: { ...accounts.seabank, accountNumber: e.target.value } })}
                placeholder="Nomor Rekening"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
              <input
                type="text"
                value={accounts.seabank.accountName}
                onChange={(e) => setAccounts({ ...accounts, seabank: { ...accounts.seabank, accountName: e.target.value } })}
                placeholder="Atas Nama"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-[#173F42] block">GoPay / OVO</span>
              <input
                type="text"
                value={accounts.gopay.accountNumber}
                onChange={(e) => setAccounts({ ...accounts, gopay: { ...accounts.gopay, accountNumber: e.target.value } })}
                placeholder="Nomor E-Wallet"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
              <input
                type="text"
                value={accounts.gopay.accountName}
                onChange={(e) => setAccounts({ ...accounts, gopay: { ...accounts.gopay, accountName: e.target.value } })}
                placeholder="Atas Nama"
                className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingAccounts}
              className="h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{savingAccounts ? 'Menyimpan...' : 'Simpan Nomor Rekening'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Kontak Resmi */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
          <Phone className="w-5 h-5 text-[#0EADAD]" />
          <div>
            <h3 className="font-bold text-sm text-[#173F42]">Informasi Kontak & Humas</h3>
            <p className="text-xs text-gray-500">Nomor WhatsApp dan tautan media sosial resmi</p>
          </div>
        </div>

        <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#26383C] mb-1">WhatsApp (Format 62...)</label>
              <input
                type="text"
                value={contact.whatsappNumber}
                onChange={(e) => setContact({ ...contact, whatsappNumber: e.target.value })}
                placeholder="6285779321681"
                className="w-full h-10 px-3 border border-gray-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#26383C] mb-1">Email Resmi</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="pulangkesinii@gmail.com"
                className="w-full h-10 px-3 border border-gray-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#26383C] mb-1">Instagram</label>
              <input
                type="text"
                value={contact.instagram}
                onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                placeholder="@pulangkesinii"
                className="w-full h-10 px-3 border border-gray-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#26383C] mb-1">Basecamp / Wilayah Pusat</label>
              <input
                type="text"
                value={contact.basecamp}
                onChange={(e) => setContact({ ...contact, basecamp: e.target.value })}
                placeholder="Jakarta Timur"
                className="w-full h-10 px-3 border border-gray-300 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingContact}
              className="h-10 px-5 bg-[#0EADAD] hover:bg-[#0C9696] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{savingContact ? 'Menyimpan...' : 'Simpan Info Kontak'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
