import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(
          res.status === 500
            ? 'Server backend sedang mengalami kendala (500). Mohon coba lagi beberapa saat.'
            : `Gagal memproses respon server (${res.status}).`
        );
      }

      if (!res.ok) {
        throw new Error(data.error || 'Username atau password tidak sesuai');
      }

      onLoginSuccess(data.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F7] flex items-center justify-center p-4 admin-scope">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_15px_35px_rgba(14,173,173,0.12)] border border-[#E0F2F1]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E0F7F6] text-[#0EADAD] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-[#173F42]">Dashboard Admin</h1>
          <p className="text-xs text-[#6B7E82] mt-1">
            Masuk untuk mengelola kegiatan, pendaftar, galeri, dan konten Pulangkesinii
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-[#FFF2F0] border border-[#FFCCC7] rounded-xl flex items-start gap-2.5 text-xs text-[#CF1322]">
            <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#26383C] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8FA3A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                autoComplete="username"
                className="w-full h-11 pl-10 pr-3.5 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] focus:ring-2 focus:ring-[#0EADAD]/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26383C] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8FA3A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="w-full h-11 pl-10 pr-10 text-xs rounded-xl border border-[#D5DFE0] focus:border-[#0EADAD] focus:ring-2 focus:ring-[#0EADAD]/20 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8FA3A6] hover:text-[#26383C] p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0EADAD] hover:bg-[#0C9696] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#0EADAD]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Memeriksa kredensial...' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[#EEF3F4] text-center">
          <p className="text-[11px] text-[#7A8C90]">
            Portal terproteksi khusus tim pengelola Komunitas Pulangkesinii
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0EADAD] hover:underline mt-3"
          >
            ← Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </div>
  );
};
