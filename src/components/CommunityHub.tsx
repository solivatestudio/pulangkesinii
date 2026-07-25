import React from 'react';
import { MessageSquare, Music, Instagram, BookOpen, ExternalLink, ShieldCheck, Heart, Sparkles, Play, Pause } from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <section className="py-16 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-[#FFE066] text-[#2D3748] text-xs font-heading font-bold px-3 py-1 rounded-full border border-[#2D3748]/15">
            — RUANG RELASI & HUB —
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2D3748] mt-2">
            Terhubung Lebih Dekat 🤝
          </h2>
          <p className="text-base text-[#4A5568] mt-2 font-medium">
            Temukan update kegiatan terbaru, obrolan santai di WhatsApp Channel, hingga lagu penenang saat perjalanan pulang.
          </p>
        </div>

        {/* Linktree-style Interactive Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: WhatsApp Channel */}
          <div className="bg-[#E8F5E9] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#81C784] shadow-2xs flex flex-col justify-between group hover:-translate-y-1 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white rounded-2xl border border-[#2D3748]/10 text-[#2E7D32]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="bg-white text-[#2E7D32] font-bold text-[11px] px-2.5 py-1 rounded-full border border-[#81C784]">
                  Official Channel
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-[#2D3748]">
                WhatsApp Broadcast Channel
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Gabung ke saluran WhatsApp resmi Pulangkesinii untuk dapat info paling update seputar kuota batch, jadwal pengumuman, dan acara dadakan!
              </p>
            </div>

            <a
              href="https://whatsapp.com/channel/0029Vb7x44LFXUuSeqigEW0B"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-heading font-bold text-xs py-3 px-4 rounded-xl border border-[#2D3748]/10 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Join WhatsApp Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Spotify Playlist "Lagu Pulang" */}
          <div className="bg-[#FFF9DB] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#FFE066] shadow-2xs flex flex-col justify-between group hover:-translate-y-1 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white rounded-2xl border border-[#2D3748]/10 text-[#B45309]">
                  <Music className="w-6 h-6" />
                </div>
                <span className="bg-white text-[#B45309] font-bold text-[11px] px-2.5 py-1 rounded-full border border-[#FFE066]">
                  Playlist Komunitas 🎵
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-[#2D3748]">
                "Lagu Pulang" — Soundtrack Kebersamaan
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Kumpulan lagu hangat pilihan volunteer dari HIVI!, Sal Priadi, Hindia, & Nadin Amizah yang sering kita putar saat perjalanan pulang.
              </p>

              {/* Music Player Simulator */}
              <div className="bg-white p-3 rounded-2xl border border-[#2D3748]/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={toggleAudio}
                    className="w-9 h-9 bg-[#FFE066] text-[#2D3748] rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition-transform shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-xs text-[#2D3748] truncate">
                      {isPlayingAudio ? 'Sedang Diputar: Menari Dengan Bayangan' : 'Putar Sample Music'}
                    </p>
                    <p className="text-[10px] text-[#718096]">Teman Pulang Curator • 32 Songs</p>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-[#B45309] shrink-0 ml-1" />
              </div>
            </div>

            <button
              onClick={() => alert('Membuka Spotify Playlist "Lagu Pulang"!')}
              className="mt-6 w-full bg-[#B45309] hover:bg-[#92400E] text-white font-heading font-bold text-xs py-3 px-4 rounded-xl border border-[#2D3748]/10 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Dengarkan di Spotify</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Instagram Official */}
          <div className="bg-[#E0F7FA] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#4ECDC4] shadow-2xs flex flex-col justify-between group hover:-translate-y-1 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white rounded-2xl border border-[#2D3748]/10 text-[#00838F]">
                  <Instagram className="w-6 h-6" />
                </div>
                <span className="bg-white text-[#00838F] font-bold text-[11px] px-2.5 py-1 rounded-full border border-[#4ECDC4]">
                  21.2K Followers
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-[#2D3748]">
                Instagram @pulangkesinii
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Rumah dokumentasi utama kami! Lihat recap reels, carousel cerita volunteer, meme hangat, dan pengumuman kelolosan pendaftaran.
              </p>

              <div className="bg-white p-3 rounded-2xl border border-[#2D3748]/10 text-xs text-[#2D3748] font-medium">
                <span className="font-bold text-[#00838F]">#TemanPulangKamu</span> • 332 Posts • Warm Community
              </div>
            </div>

            <a
              href="https://instagram.com/pulangkesinii"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full bg-[#00838F] hover:bg-[#006064] text-white font-heading font-bold text-xs py-3 px-4 rounded-xl border border-[#2D3748]/10 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Kunjungi Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
