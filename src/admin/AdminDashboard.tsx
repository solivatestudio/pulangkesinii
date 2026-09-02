import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { ActivitiesTab } from './tabs/ActivitiesTab';
import { RegistrationsTab } from './tabs/RegistrationsTab';
import { GalleryTab } from './tabs/GalleryTab';
import { FaqsTab } from './tabs/FaqsTab';
import { SettingsTab } from './tabs/SettingsTab';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'registrations' | 'gallery' | 'faqs' | 'settings'>('activities');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalActivities: 0,
    openActivities: 0,
    pendingRegistrations: 0,
    totalRegistrations: 0,
    totalPhotos: 0,
    totalFaqs: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Load summary stats
    const loadStats = async () => {
      try {
        const [actRes, regRes, galRes, faqRes] = await Promise.all([
          fetch('/api/activities').then((r) => r.json()).catch(() => []),
          fetch('/api/registrations').then((r) => r.json()).catch(() => []),
          fetch('/api/gallery').then((r) => r.json()).catch(() => []),
          fetch('/api/faqs').then((r) => r.json()).catch(() => []),
        ]);

        setStats({
          totalActivities: Array.isArray(actRes) ? actRes.length : 0,
          openActivities: Array.isArray(actRes) ? actRes.filter((a: any) => a.status === 'open' || a.status === 'closing_soon').length : 0,
          totalRegistrations: Array.isArray(regRes) ? regRes.length : 0,
          pendingRegistrations: Array.isArray(regRes) ? regRes.filter((r: any) => r.status === 'menunggu_verifikasi').length : 0,
          totalPhotos: Array.isArray(galRes) ? galRes.length : 0,
          totalFaqs: Array.isArray(faqRes) ? faqRes.length : 0,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    loadStats();
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    onLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'activities', label: 'Kegiatan & Cards', icon: Calendar, badge: stats.openActivities },
    { id: 'registrations', label: 'Pendaftaran Peserta', icon: Users, badge: stats.pendingRegistrations, badgeColor: 'bg-amber-500' },
    { id: 'gallery', label: 'Galeri Momen', icon: ImageIcon },
    { id: 'faqs', label: 'FAQ & Tanya Jawab', icon: HelpCircle },
    { id: 'settings', label: 'Rekening & Kontak', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9F9] flex flex-col md:flex-row text-[#26383C] admin-scope">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-[#E0F2F1] p-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0EADAD] flex items-center justify-center text-white font-black text-sm">
            P
          </div>
          <span className="font-bold text-sm text-[#173F42] font-heading">Pulangkesinii Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-100 text-gray-700 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-[#E0F2F1] p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0EADAD] flex items-center justify-center text-white font-black text-base shadow-sm">
              P
            </div>
            <div>
              <h1 className="font-bold text-sm text-[#173F42]">Pulangkesinii</h1>
              <span className="text-[10px] text-[#0EADAD] font-bold tracking-wider uppercase">Content Manager</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full h-11 px-3.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0EADAD] text-white shadow-sm shadow-[#0EADAD]/20'
                      : 'text-[#4A5D61] hover:bg-[#F0F7F7] hover:text-[#0EADAD]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-none" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white text-[#0EADAD]' : (item.badgeColor || 'bg-[#0EADAD]') + ' text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / User & Logout */}
        <div className="pt-4 border-t border-[#EEF3F4] space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full h-9 px-3 rounded-lg bg-[#F0F7F7] text-[#0EADAD] hover:bg-[#E0F7F6] text-[11px] font-bold flex items-center justify-between transition-all"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="text-[11px]">
                <div className="font-bold text-[#173F42]">{user?.name || 'Administrator'}</div>
                <div className="text-gray-400 text-[9px]">{user?.role || 'Superadmin'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-[#E0F2F1] shadow-xs">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Total Kegiatan</span>
            <span className="text-xl sm:text-2xl font-black text-[#173F42] mt-1 block">{stats.totalActivities}</span>
            <span className="text-[10px] text-[#00A389] font-semibold mt-0.5 block">{stats.openActivities} aktif</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E0F2F1] shadow-xs">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Total Pendaftar</span>
            <span className="text-xl sm:text-2xl font-black text-[#173F42] mt-1 block">{stats.totalRegistrations}</span>
            <span className="text-[10px] text-[#D97706] font-semibold mt-0.5 block">{stats.pendingRegistrations} perlu verifikasi</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E0F2F1] shadow-xs">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Foto Galeri Momen</span>
            <span className="text-xl sm:text-2xl font-black text-[#173F42] mt-1 block">{stats.totalPhotos}</span>
            <span className="text-[10px] text-[#0EADAD] font-semibold mt-0.5 block">Dokumentasi kegiatan</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E0F2F1] shadow-xs">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">FAQ & Tanya Jawab</span>
            <span className="text-xl sm:text-2xl font-black text-[#173F42] mt-1 block">{stats.totalFaqs}</span>
            <span className="text-[10px] text-[#4A5D61] font-semibold mt-0.5 block">Pertanyaan aktif</span>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'activities' && <ActivitiesTab />}
        {activeTab === 'registrations' && <RegistrationsTab />}
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'faqs' && <FaqsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
