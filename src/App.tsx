import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsCounter } from './components/StatsCounter';
import { OpenRecruitmentPass } from './components/OpenRecruitmentPass';
import { RecruitmentModal } from './components/RecruitmentModal';
import { ProgramCategories } from './components/ProgramCategories';
import { MemoryWall } from './components/MemoryWall';
import { PulangBercerita } from './components/PulangBercerita';
import { CommunityHub } from './components/CommunityHub';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MascotWidget } from './components/MascotWidget';
import { INITIAL_BATCHES, MEMORY_PHOTOS, INITIAL_STORIES } from './data/mockData';
import { VolunteerApplication, CommunityStory } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [recruitmentModalOpen, setRecruitmentModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [userPass, setUserPass] = useState<VolunteerApplication | null>(null);
  const [stories, setStories] = useState<CommunityStory[]>(INITIAL_STORIES);

  // Load saved user application pass if exists
  useEffect(() => {
    const saved = localStorage.getItem('pulangkesinii_volunteer_pass');
    if (saved) {
      try {
        setUserPass(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved pass', err);
      }
    }
  }, []);

  const handleApplicationSuccess = (app: VolunteerApplication) => {
    setUserPass(app);
    localStorage.setItem('pulangkesinii_volunteer_pass', JSON.stringify(app));
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategoryFilter(catName);
    const element = document.getElementById('memory-wall');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddStory = (newStory: CommunityStory) => {
    setStories((prev) => [newStory, ...prev]);
  };

  const currentBatch = INITIAL_BATCHES[0]; // Batch 39 Open

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2D3748] flex flex-col font-sans">
      
      {/* Top Sticky Navbar */}
      <Navbar
        onOpenRecruitmentModal={() => setRecruitmentModalOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-grow">
        
        {/* Hero Section */}
        <Hero
          onOpenRecruitment={() => setRecruitmentModalOpen(true)}
          onExploreMemoryWall={() => {
            setActiveSection('memory-wall');
            document.getElementById('memory-wall')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Live Stats Impact Counter */}
        <StatsCounter />

        {/* Open Recruitment Batch 39 Pass Section */}
        <OpenRecruitmentPass
          batch={currentBatch}
          onOpenRecruitment={() => setRecruitmentModalOpen(true)}
        />

        {/* Program Categories ("Pulang ke mana kali ini?") */}
        <ProgramCategories onSelectCategory={handleSelectCategory} />

        {/* Memory Wall (Digital Scrapbook Gallery) */}
        <MemoryWall
          photos={MEMORY_PHOTOS}
          selectedCategoryFilter={selectedCategoryFilter}
          onClearFilter={() => setSelectedCategoryFilter(null)}
        />

        {/* Pulang Bercerita (Diary & Testimonials) */}
        <PulangBercerita
          stories={stories}
          onAddStory={handleAddStory}
        />

        {/* Community Linktree & Relasi Hub */}
        <CommunityHub />

        {/* FAQ Section */}
        <FaqSection />

      </main>

      {/* Footer */}
      <Footer onOpenRecruitment={() => setRecruitmentModalOpen(true)} />

      {/* Interactive Mascot Floating Widget */}
      <MascotWidget onOpenRecruitment={() => setRecruitmentModalOpen(true)} />

      {/* Interactive Recruitment Modal Form */}
      <RecruitmentModal
        isOpen={recruitmentModalOpen}
        onClose={() => setRecruitmentModalOpen(false)}
        onApplicationSuccess={handleApplicationSuccess}
        userPass={userPass}
      />

    </div>
  );
}
