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
      <div className="md:hidden bg-white border-b border-[#E0F2F1] px-5 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E0F7F6] p-1 flex items-center justify-center border border-[#CDEEEB]">
            <img src="/assets/logo-palette.png" alt="Pulangkesinii" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-base text-[#173F42]">Pulangkesinii</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-[#F0F7F7] text-[#087C7E] hover:bg-[#E0F7F6] cursor-pointer transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#071D22]/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-72 h-screen bg-white border-r border-[#E0F2F1] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Navigation */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0F7F7]">
            <div className="w-11 h-11 rounded-2xl bg-[#E0F7F6] p-1.5 flex items-center justify-center shadow-xs border border-[#CDEEEB] flex-none">
              <img src="/assets/logo-palette.png" alt="Pulangkesinii" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-base text-[#173F42] leading-tight truncate">Pulangkesinii</div>
              <div className="text-[11px] text-[#0EADAD] font-semibold mt-0.5 tracking-wide">Portal Admin</div>
            </div>
          </div>

          {/* Navigation Group */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1 text-[10px] font-bold text-[#8EA2A6] uppercase tracking-wider">
              Menu Pengelola
            </div>
            <nav className="space-y-1">
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
                    className={`w-full h-11 px-3.5 rounded-xl text-[13px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0EADAD] text-white font-semibold shadow-sm shadow-[#0EADAD]/25'
                        : 'text-[#4A5D61] hover:bg-[#F2F8F8] hover:text-[#0EADAD]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 flex-none ${isActive ? 'text-white' : 'text-[#8FA3A6]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : (item.badgeColor || 'bg-[#0EADAD]') + ' text-white'
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
        </div>

        {/* Bottom: External link & User Profile */}
        <div className="p-5 border-t border-[#EEF3F4] space-y-3 bg-[#FCFDFD]">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full h-10 px-3.5 rounded-xl bg-[#F0F7F7] hover:bg-[#E0F7F6] text-[#087C7E] text-xs font-semibold flex items-center justify-between transition-all"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#0EADAD]" />
          </a>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E0F2F1]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#E0F7F6] text-[#087C7E] flex items-center justify-center text-xs font-bold flex-none">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-[#173F42] truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[#8FA3A6] text-[10px] capitalize">{user?.role || 'Superadmin'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer flex-none ml-2"
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
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#6B7E82] font-semibold">Total Kegiatan</span>
              <div className="w-8 h-8 rounded-xl bg-[#E0F7F6] text-[#087C7E] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#173F42] block tracking-tight">{stats.totalActivities}</span>
              <span className="text-[11px] text-[#00A389] font-medium mt-1 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A389]" />
                {stats.openActivities} aktif di web
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#6B7E82] font-semibold">Pendaftaran</span>
              <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#173F42] block tracking-tight">{stats.totalRegistrations}</span>
              <span className="text-[11px] text-[#D97706] font-medium mt-1 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                {stats.pendingRegistrations} verifikasi
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#6B7E82] font-semibold">Foto Galeri</span>
              <div className="w-8 h-8 rounded-xl bg-[#DDECFF] text-[#2563EB] flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#173F42] block tracking-tight">{stats.totalPhotos}</span>
              <span className="text-[11px] text-[#2563EB] font-medium mt-1 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                Momen kebaikan
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0F2F1] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#6B7E82] font-semibold">Tanya Jawab</span>
              <div className="w-8 h-8 rounded-xl bg-[#FFE1D9] text-[#EA580C] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#173F42] block tracking-tight">{stats.totalFaqs}</span>
              <span className="text-[11px] text-[#EA580C] font-medium mt-1 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                FAQ aktif di beranda
              </span>
            </div>
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
