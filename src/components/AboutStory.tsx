import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Target, 
  Compass, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { VALUES_DATA } from '../data/mockData';

export const AboutStory: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'TrendingUp': return TrendingUp;
      case 'Sparkles': return Sparkles;
      case 'ShieldCheck': default: return ShieldCheck;
    }
  };

  return (
    <section id="tentang-kami" className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Story Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF9DB] text-[#B45309] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#FFE066] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR STORY & IDENTITAS</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32] mt-1">
            Kenal Lebih Dekat Pulangkesinii 💌
          </h2>
          <p className="font-handwriting text-xl sm:text-2xl text-[#0EADAD] font-bold mt-2">
            "Every Great Community Starts with One Simple Question..."
          </p>
        </div>

        {/* Narrative Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left Text Narrative */}
          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#172B32] leading-relaxed">
            <div className="bg-[#E6F7F7] p-5 sm:p-6 rounded-3xl border border-[#0EADAD]/30 space-y-3">
              <p className="font-semibold italic text-[#0EADAD] text-sm sm:text-base">
                “Bagaimana jika ada sebuah tempat di mana anak muda bisa berbuat baik, bertemu orang-orang baru tanpa harus merasa sendiri, lalu pulang dengan versi dirinya yang lebih baik?”
              </p>
              <p className="text-xs text-[#647A80] font-bold uppercase tracking-wider">
                — Pertanyaan awal kelahiran Pulangkesinii pada 2 Agustus 2025
              </p>
            </div>

            <p className="text-[#647A80]">
              Pulangkesinii lahir dari keyakinan bahwa setiap orang membutuhkan tempat untuk kembali. Bukan hanya rumah dalam bentuk bangunan, melainkan ruang yang membuat siapa saja merasa diterima, didengar, dihargai, dan bertumbuh melalui kebaikan sosial.
            </p>

            <p className="text-[#647A80]">
              Di Pulangkesinii, <strong className="text-[#172B32]">“pulang”</strong> bukan berarti kembali ke sebuah dinding, melainkan kembali pada rasa: <span className="text-[#0EADAD] font-bold">rasa nyaman, rasa memiliki, dan keyakinan bahwa kita tidak berjalan sendirian.</span>
            </p>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="bg-[#F8FBFB] p-4 rounded-3xl border border-[#CBD5E0] shadow-soft overflow-hidden">
                <div className="rounded-2xl overflow-hidden aspect-4/3 relative">
                  <img
                    src="/assets/decor-2.png"
                    alt="Komunitas Pulangkesinii Kebersamaan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-semibold">
                      Senyum & kehangatan bersama #TemanPulangKamu
                    </p>
                  </div>
                </div>
              </div>

              {/* Yellow Star Sticker */}
              <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-2xl border border-[#E2E8F0] shadow-md flex items-center gap-2 animate-float-gentle">
                <img src="/assets/star-yellow.png" alt="Star" className="w-8 h-8 object-contain" />
                <span className="font-heading font-bold text-xs text-[#172B32]">Sejak 2025</span>
              </div>
            </div>
          </div>

        </div>

        {/* Visi & Misi Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          
          {/* Visi */}
          <div className="bg-[#E6F7F7] p-6 sm:p-8 rounded-3xl border border-[#0EADAD]/30 shadow-soft space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0EADAD] text-white rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#172B32]">
                Visi Pulangkesinii
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#172B32] leading-relaxed font-medium pt-1">
              Menjadi komunitas sosial yang menginspirasi generasi muda untuk bertumbuh, berbagi, dan menciptakan dampak positif bagi masyarakat melalui aksi nyata yang berkelanjutan.
            </p>
          </div>

          {/* Misi */}
          <div className="bg-[#F8FBFB] p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-soft space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00B4EB] text-white rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#172B32]">
                Misi Kami
              </h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#647A80] font-medium pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EADAD] shrink-0 mt-0.5" />
                <span>Menjadi ruang aman bagi anak muda untuk berkembang melalui kegiatan sosial.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EADAD] shrink-0 mt-0.5" />
                <span>Mendorong budaya volunteer yang inklusif, menyenangkan, dan berdampak.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0EADAD] shrink-0 mt-0.5" />
                <span>Menghubungkan individu, komunitas, dan mitra dalam kolaborasi sosial berkelanjutan.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 5 Nilai-Nilai Pulangkesinii */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#172B32]">
              Nilai-Nilai yang Kami Hidupi
            </h3>
            <p className="text-xs sm:text-sm text-[#647A80] mt-1">
              Fondasi etika dan semangat yang selalu kami bawa dalam setiap langkah aksi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {VALUES_DATA.map((val) => {
              const IconComp = getIcon(val.iconName);
              return (
                <div
                  key={val.name}
                  className={`p-4 sm:p-5 rounded-2xl ${val.colorBg} border ${val.colorBorder} shadow-2xs space-y-2 card-hover-lift`}
                >
                  <div className="flex items-center justify-between">
                    <IconComp className={`w-5 h-5 ${val.colorText}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#647A80]">
                      Value
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#172B32]">
                    {val.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#172B32]/80">
                    {val.microcopy}
                  </p>
                  <p className="text-[11px] text-[#647A80] leading-relaxed pt-1">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
