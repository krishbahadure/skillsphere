import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { SlidersHorizontal, Bookmark, X, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CourseCard } from '../../components/ui/CourseCard';
import { CourseDetailModal } from '../../components/ui/CourseDetailModal';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { PageTransition } from '../../components/ui/PageTransition';
import { CATEGORIES, DIFFICULTIES } from '../../data/mockData';
import type { Course } from '../../types';

const BATCH_SIZE = 8;

function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[#C6FF3D]/20 flex items-center justify-center mb-4">
        <Search size={28} className="text-[#6B6B6B]" />
      </div>
      <h3 className="text-base font-display font-semibold text-[#0A0A0A] mb-2">No courses found</h3>
      <p className="text-xs text-[#6B6B6B] max-w-content">{message}</p>
    </motion.div>
  );
}

export default function CoursesPage() {
  const { courses, searchQuery } = useStore();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = courses.filter((c) => {
    if (category !== 'All' && c.category !== category) return false;
    if (difficulty !== 'All' && c.difficulty !== difficulty) return false;
    if (bookmarkedOnly && !c.bookmarked) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setCategory('All');
    setDifficulty('All');
    setBookmarkedOnly(false);
  };
  const isFiltered = category !== 'All' || difficulty !== 'All' || bookmarkedOnly;

  return (
    <PageTransition>
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-[#0A0A0A]">Explore Courses</h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            {loading ? 'Loading courses...' : `${filtered.length} courses available`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`flex items-center gap-2 px-3 py-2 rounded-btn text-xs font-medium border transition-all duration-150 cursor-pointer ${bookmarkedOnly ? 'bg-[#3D5CFF] text-white border-[#3D5CFF]' : 'bg-white text-[#6B6B6B] border-[#EAEAEA] hover:border-[#3D5CFF] hover:text-[#3D5CFF]'}`}
            aria-label="Show bookmarked courses only"
          >
            <Bookmark size={14} />
            {bookmarkedOnly ? 'Bookmarked' : 'Saved'}
          </button>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-btn text-xs font-medium border transition-all duration-150 cursor-pointer ${filtersOpen || isFiltered ? 'bg-[#C6FF3D] text-[#0B0B0B] border-[#C6FF3D]' : 'bg-white text-[#6B6B6B] border-[#EAEAEA] hover:border-[#C6FF3D]'}`}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={14} />
            Filters
            {isFiltered && (
              <span className="w-4 h-4 rounded-full bg-[#0B0B0B] text-[#C6FF3D] text-[10px] flex items-center justify-center">
                {[category !== 'All', difficulty !== 'All'].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`badge text-xs font-medium border cursor-pointer transition-all duration-150 ${category === cat ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white text-[#6B6B6B] border-[#EAEAEA] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-card border border-[#EAEAEA] p-4 mb-5 flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-2xs font-medium text-[#6B6B6B] mb-1.5" htmlFor="filter-difficulty">Difficulty</label>
                <select
                  id="filter-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input-field py-1.5 text-xs w-36"
                >
                  {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 mt-4 cursor-pointer"
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={8} />
      ) : visible.length === 0 ? (
        <EmptyState message={isFiltered || searchQuery ? 'Try adjusting your filters or search query.' : 'No courses available yet.'} />
      ) : (
        <>
          <LayoutGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visible.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={i}
                  onExpand={setSelectedCourse}
                />
              ))}
            </div>
          </LayoutGroup>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisibleCount((v) => v + BATCH_SIZE)}
                className="btn-secondary"
              >
                Load more courses
              </motion.button>
            </div>
          )}
        </>
      )}

      {/* Course Detail Modal — rendered via portal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
    </PageTransition>
  );
}
