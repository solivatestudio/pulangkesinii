import React from 'react';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Tag, 
  X,
  Compass
} from 'lucide-react';
import { ActivityItem, ActivityCategory } from '../types';
import { ActivityCard } from './ActivityCard';

interface ActivitiesCatalogueProps {
  activities: ActivityItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ActivityCategory;
  setSelectedCategory: (cat: ActivityCategory) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedPriceFilter: 'all' | 'free' | 'paid';
  setSelectedPriceFilter: (p: 'all' | 'free' | 'paid') => void;
  onSelectActivity: (act: ActivityItem) => void;
  onQuickRegister: (act: ActivityItem) => void;
}

export const ActivitiesCatalogue: React.FC<ActivitiesCatalogueProps> = ({
  activities,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  selectedPriceFilter,
  setSelectedPriceFilter,
  onSelectActivity,
  onQuickRegister,
}) => {
  const categoryList: ActivityCategory[] = [
    'Semua',
    'Volunteer',
    'Voluntrip',
    'Fun Activity',
    'Social Care',
    'Lingkungan',
    'Pendidikan',
  ];

  const cityList = [
    'Semua Kota',
    'Jakarta',
    'Depok',
    'Tangerang',
    'Bandung',
    'Jogja',
    'Surabaya'
  ];

  // Filtering Logic
  const filteredActivities = activities.filter((act) => {
    const matchSearch =
      !searchQuery ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === 'Semua' || act.category === selectedCategory;

    const matchCity =
      selectedCity === 'Semua Kota' || act.city.toLowerCase() === selectedCity.toLowerCase();

    const matchPrice =
      selectedPriceFilter === 'all'
        ? true
        : selectedPriceFilter === 'free'
        ? act.price === 0
        : act.price > 0;

    return matchSearch && matchCategory && matchCity && matchPrice;
  });

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'Semua' ||
    selectedCity !== 'Semua Kota' ||
    selectedPriceFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedCity('Semua Kota');
    setSelectedPriceFilter('all');
  };

  return (
    <section id="kegiatan" className="py-14 sm:py-20 bg-[#F8FBFB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#E6F7F7] text-[#0EADAD] text-xs font-heading font-bold px-3.5 py-1 rounded-full border border-[#0EADAD]/30 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>KATALOG KEGIATAN AKTIF</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#172B32]">
              Temukan Kegiatan untuk Kamu 🌟
            </h2>
            <p className="text-xs sm:text-sm text-[#647A80] mt-1 font-medium">
              Pilih kegiatan berdasarkan minat, waktu, dan kota yang paling dekat denganmu.
            </p>
          </div>

          {/* Results count badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#647A80] bg-white px-3 py-1.5 rounded-full border border-[#E2E8F0] shadow-2xs">
              Menampilkan <strong className="text-[#0EADAD]">{filteredActivities.length}</strong> kegiatan
            </span>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-soft mb-8 space-y-4">
          
          {/* Top Bar: Search Input & City & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#0EADAD] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama kegiatan atau tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FBFB] border border-[#E2E8F0] focus:border-[#0EADAD] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none transition-all placeholder:text-[#647A80]/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#647A80] hover:text-[#172B32]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <div className="sm:col-span-3 relative">
              <MapPin className="w-4 h-4 text-[#00B4EB] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#F8FBFB] border border-[#E2E8F0] focus:border-[#0EADAD] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-[#172B32] focus:outline-none cursor-pointer"
              >
                {cityList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="sm:col-span-3">
              <div className="grid grid-cols-3 bg-[#F8FBFB] p-1 rounded-xl border border-[#E2E8F0] text-xs font-semibold">
                <button
                  onClick={() => setSelectedPriceFilter('all')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedPriceFilter === 'all' ? 'bg-[#0EADAD] text-white shadow-2xs' : 'text-[#647A80] hover:text-[#172B32]'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedPriceFilter('free')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedPriceFilter === 'free' ? 'bg-[#0EADAD] text-white shadow-2xs' : 'text-[#647A80] hover:text-[#172B32]'
                  }`}
                >
                  Gratis
                </button>
                <button
                  onClick={() => setSelectedPriceFilter('paid')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedPriceFilter === 'paid' ? 'bg-[#0EADAD] text-white shadow-2xs' : 'text-[#647A80] hover:text-[#172B32]'
                  }`}
                >
                  Berbayar
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Category Scrollable Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#E2E8F0]/60 pb-1">
            <span className="text-xs font-bold text-[#647A80] shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Kategori:
            </span>

            {categoryList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0EADAD] text-white shadow-2xs font-bold'
                      : 'bg-[#F8FBFB] text-[#647A80] hover:bg-[#E6F7F7] hover:text-[#0EADAD] border border-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="ml-auto inline-flex items-center gap-1 text-xs text-red-500 font-bold hover:underline shrink-0 pl-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

        </div>

        {/* Activities Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onSelectActivity={onSelectActivity}
                onQuickRegister={onQuickRegister}
              />
            ))}
          </div>
        ) : (
          /* Empty State as specified in master brief Section 22 */
          <div className="bg-white rounded-3xl border border-dashed border-[#CBD5E0] p-10 sm:p-16 text-center max-w-xl mx-auto space-y-4 shadow-2xs">
            <div className="w-16 h-16 bg-[#E6F7F7] rounded-full flex items-center justify-center text-2xl mx-auto">
              🔍
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#172B32]">
              Belum Menemukan Kegiatan yang Cocok
            </h3>
            <p className="text-xs sm:text-sm text-[#647A80] leading-relaxed">
              Coba ubah kata kunci pencarian atau ganti filter kota dan kategori untuk melihat kegiatan kebaikan lainnya.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-[#0EADAD] hover:bg-[#108080] text-white font-heading font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Lihat Semua Kegiatan</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
