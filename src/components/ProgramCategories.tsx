import React, { useState } from 'react';
import { BookOpen, HeartHandshake, Sprout, Sparkles, ArrowRight, Heart, CheckCircle2 } from 'lucide-react';
import { ACTIVITY_CATEGORIES } from '../data/mockData';

interface ProgramCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

export const ProgramCategories: React.FC<ProgramCategoriesProps> = ({ onSelectCategory }) => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'HeartHandshake': return HeartHandshake;
      case 'Sprout': return Sprout;
      case 'Sparkles': default: return Sparkles;
    }
  };

  return (
    <section id="programs" className="py-16 bg-[#FAF9F5] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-[#E0F7FA] text-[#00838F] text-xs font-heading font-bold px-3 py-1 rounded-full border border-[#00838F]/20">
            — PILIHAN RUANG PENGABDIAN —
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2D3748] mt-2">
            Pulang ke mana kali ini? 🏡
          </h2>
          <p className="text-base text-[#4A5568] mt-2 font-medium">
            Di Pulangkesinii, kamu bisa memilih fokus kegiatan sosial yang paling dekat di hati. Semuanya dirancang dengan kehangatan & keterlibatan aktif.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ACTIVITY_CATEGORIES.map((cat) => {
            const IconComponent = getIcon(cat.iconName);
            const isSelected = selectedCat === cat.name;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCat(isSelected ? null : cat.name);
                  onSelectCategory(cat.name);
                }}
                className={`relative bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer transform hover:-translate-y-1 group ${
                  isSelected
                    ? 'border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(78,205,196,1)] sm:shadow-[6px_6px_0px_0px_rgba(78,205,196,1)] bg-[#F0FDF4]'
                    : 'border-[#E2E8F0] hover:border-[#4ECDC4] shadow-2xs'
                }`}
              >
                {/* Header Icon & Count Badge */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${cat.colorBg} border border-[#2D3748]/10 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.colorText}`} />
                  </div>
                  <span className="bg-[#FAF9F5] text-[#718096] text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[#E2E8F0]">
                    {cat.countText}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg sm:text-xl text-[#2D3748] mb-1.5 sm:mb-2 group-hover:text-[#4ECDC4] transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-[#4A5568] leading-relaxed font-medium mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                  {cat.description}
                </p>

                <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs font-bold text-[#4ECDC4]">
                  <span>Lihat Memory</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
