import React, { useState, useEffect } from 'react';
import { Save, CreditCard, Phone, LockKeyhole, Plus, Trash2 } from 'lucide-react';
import { notify } from '../../utils/notifications';

type PaymentAccount = {
  bank: string;
  accountNumber: string;
  accountName: string;
};

const defaultAccounts: PaymentAccount[] = [];

const normalizeAccounts = (value: unknown): PaymentAccount[] => {
  if (!value || typeof value !== 'object') return defaultAccounts;
  const settings = value as Record<string, unknown>;
  if (Array.isArray(settings.accounts)) {
    return settings.accounts
      .filter((account): account is Record<string, unknown> => Boolean(account) && typeof account === 'object')
      .map((account) => ({
        bank: typeof account.bank === 'string' ? account.bank : '',
        accountNumber: typeof account.accountNumber === 'string' ? account.accountNumber : '',
        accountName: typeof account.accountName === 'string' ? account.accountName : '',
      }));
  }

  // Data pengaturan lama menyimpan rekening sebagai bca, mandiri, seabank, dan gopay.
  return ['bca', 'mandiri', 'seabank', 'gopay'].flatMap((key) => {
    const account = settings[key];
    if (!account || typeof account !== 'object') return [];
    const legacy = account as Record<string, unknown>;
    return [{
      bank: typeof legacy.bank === 'string' ? legacy.bank : '',
      accountNumber: typeof legacy.accountNumber === 'string' ? legacy.accountNumber : '',
      accountName: typeof legacy.accountName === 'string' ? legacy.accountName : '',
    }];
  });
};

export const SettingsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savingAccounts, setSavingAccounts] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [accountErrors, setAccountErrors] = useState<Record<number, string>>({});
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmation: '' });

  const [accounts, setAccounts] = useState<PaymentAccount[]>(defaultAccounts);
  const [qrisImageUrl, setQrisImageUrl] = useState('/images/web/qris.webp');

  const [contact, setContact] = useState({
    whatsappNumber: '', whatsappFormatted: '', email: '', instagram: '', tiktok: '', basecamp: '', address: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.payment_accounts) {
          const acc = data.payment_accounts;
          setAccounts(normalizeAccounts(acc));
          if (acc.qrisImageUrl) setQrisImageUrl(acc.qrisImageUrl);
        }
        if (data.contact_info) setContact((prev) => ({ ...prev, ...data.contact_info }));
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
    const cleanAccounts = accounts.map((account) => ({
      bank: account.bank.trim(),
      accountNumber: account.accountNumber.trim(),
      accountName: account.accountName.trim(),
    }));
    if (cleanAccounts.some((account) => !account.bank || !account.accountNumber || !account.accountName)) {
      notify('Lengkapi nama bank/e-wallet, nomor rekening, dan atas nama pada setiap rekening.', 'error');
      return;
    }
    const nextAccountErrors = Object.fromEntries(cleanAccounts.map((account, index) => [index, /^\d{8,20}$/.test(account.accountNumber) ? '' : 'Nomor rekening/e-wallet hanya boleh angka (8–20 digit).']));
    setAccountErrors(nextAccountErrors);
    if (Object.values(nextAccountErrors).some(Boolean)) return;
    setSavingAccounts(true);
    try {
      const res = await fetch('/api/settings/payment_accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: { accounts: cleanAccounts, qrisImageUrl } }),
      });
      if (res.ok) {
        setAccounts(cleanAccounts);
        notify('Rekening pembayaran berhasil disimpan.');
      } else {
        notify('Rekening belum tersimpan. Coba lagi.', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Koneksi bermasalah. Periksa internet lalu coba lagi.', 'error');
    } finally {
      setSavingAccounts(false);
    }
  };

  const updateAccount = (index: number, field: keyof PaymentAccount, value: string) => {
    setAccounts((current) => current.map((account, accountIndex) => accountIndex === index ? { ...account, [field]: value } : account));
    if (field === 'accountNumber') setAccountErrors((current) => ({ ...current, [index]: value && !/^\d{8,20}$/.test(value) ? 'Nomor rekening/e-wallet hanya boleh angka (8–20 digit).' : '' }));
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextContactErrors: Record<string, string> = {};
    if (contact.whatsappNumber && !/^(?:628|08)\d{7,12}$/.test(contact.whatsappNumber)) nextContactErrors.whatsappNumber = 'Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx tanpa tanda +, spasi, atau simbol.';
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) nextContactErrors.email = 'Format email belum valid.';
    setContactErrors(nextContactErrors);
    if (Object.keys(nextContactErrors).length) return;
    setSavingContact(true);
    try {
      const res = await fetch('/api/settings/contact_info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: contact }),
      });
      if (res.ok) notify('Informasi kontak berhasil disimpan.');
      else notify('Informasi kontak belum tersimpan. Coba lagi.', 'error');
    } catch (err) {
      console.error(err);
      notify('Koneksi bermasalah. Periksa internet lalu coba lagi.', 'error');
    } finally {
      setSavingContact(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (passwords.newPassword !== passwords.confirmation) {
      setPasswordError('Konfirmasi password baru tidak sama.');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah password');
      notify(data.message);
      window.location.assign('/admin/login');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Gagal mengubah password');
    } finally {
      setSavingPassword(false);
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
            {accounts.map((account, index) => (
              <div key={index} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-[#173F42]">Rekening {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setAccounts((current) => current.filter((_, accountIndex) => accountIndex !== index))}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold cursor-pointer"
                    aria-label={`Hapus rekening ${index + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
                <input type="text" value={account.bank} onChange={(e) => updateAccount(index, 'bank', e.target.value)} placeholder="Nama bank atau e-wallet" className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none" />
                <div>
                  <input type="text" inputMode="numeric" value={account.accountNumber} onChange={(e) => updateAccount(index, 'accountNumber', e.target.value)} placeholder="Nomor rekening / e-wallet" aria-invalid={Boolean(accountErrors[index])} className={`w-full h-9 px-3 bg-white border rounded-lg outline-none ${accountErrors[index] ? 'border-red-500' : 'border-gray-300'}`} />
                  {accountErrors[index] && <p className="mt-1 text-[11px] text-red-600" role="alert">{accountErrors[index]}</p>}
                </div>
                <input type="text" value={account.accountName} onChange={(e) => updateAccount(index, 'accountName', e.target.value)} placeholder="Atas nama" className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg outline-none" />
              </div>
            ))}
          </div>

          {accounts.length === 0 && <p className="text-gray-500">Belum ada rekening. Tambahkan rekening atau e-wallet yang ingin ditampilkan.</p>}

          <button type="button" onClick={() => setAccounts((current) => [...current, { bank: '', accountNumber: '', accountName: '' }])} className="h-9 px-3 border border-dashed border-[#0EADAD] text-[#087c7e] hover:bg-[#f0fbfb] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> Tambah Rekening
          </button>

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
              <label className="block font-bold text-[#26383C] mb-1">WhatsApp (Format 08... atau 628...)</label>
              <input
                type="text"
                inputMode="numeric"
                value={contact.whatsappNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setContact({ ...contact, whatsappNumber: value });
                  setContactErrors((errors) => ({ ...errors, whatsappNumber: value && !/^(?:628|08)\d{7,12}$/.test(value) ? 'Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx tanpa tanda +, spasi, atau simbol.' : '' }));
                }}
                placeholder="085779321681 atau 6285779321681"
                aria-invalid={Boolean(contactErrors.whatsappNumber)}
                className={`w-full h-10 px-3 border rounded-xl outline-none ${contactErrors.whatsappNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {contactErrors.whatsappNumber && <p className="mt-1 text-[11px] text-red-600" role="alert">{contactErrors.whatsappNumber}</p>}
            </div>

            <div>
              <label className="block font-bold text-[#26383C] mb-1">Email Resmi</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setContact({ ...contact, email: value });
                  setContactErrors((errors) => ({ ...errors, email: value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Format email belum valid.' : '' }));
                }}
                placeholder="pulangkesinii@gmail.com"
                aria-invalid={Boolean(contactErrors.email)}
                className={`w-full h-10 px-3 border rounded-xl outline-none ${contactErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {contactErrors.email && <p className="mt-1 text-[11px] text-red-600" role="alert">{contactErrors.email}</p>}
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

            <div>
              <label className="block font-bold text-[#26383C] mb-1">Alamat Pengiriman Donasi</label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                placeholder="Alamat lengkap untuk pengiriman donasi barang"
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

      <div className="bg-white p-6 rounded-2xl border border-[#E0F2F1] shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
          <LockKeyhole className="w-5 h-5 text-[#0EADAD]" />
          <div><h3 className="font-bold text-sm text-[#173F42]">Ganti Password Admin</h3><p className="text-xs text-gray-500">Setelah berhasil, sesi akan ditutup dan Anda harus login kembali.</p></div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-xl">
          <div><label className="block font-bold mb-1">Password Saat Ini</label><input type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="w-full h-10 px-3 border border-gray-300 rounded-xl outline-none focus:border-[#0EADAD]" /></div>
          <div><label className="block font-bold mb-1">Password Baru</label><input type="password" autoComplete="new-password" required minLength={12} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full h-10 px-3 border border-gray-300 rounded-xl outline-none focus:border-[#0EADAD]" /><p className="mt-1 text-gray-500">Minimal 12 karakter, berisi huruf besar, huruf kecil, dan angka.</p></div>
          <div><label className="block font-bold mb-1">Konfirmasi Password Baru</label><input type="password" autoComplete="new-password" required minLength={12} value={passwords.confirmation} onChange={(e) => setPasswords({ ...passwords, confirmation: e.target.value })} className="w-full h-10 px-3 border border-gray-300 rounded-xl outline-none focus:border-[#0EADAD]" /></div>
          {passwordError && <p className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold">{passwordError}</p>}
          <button type="submit" disabled={savingPassword} className="h-10 px-5 bg-[#173F42] text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"><LockKeyhole className="w-4 h-4" />{savingPassword ? 'Mengubah...' : 'Ganti Password'}</button>
        </form>
      </div>
    </div>
  );
};
