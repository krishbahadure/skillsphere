import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ContributionCard } from '../../components/ui/ContributionCard';
import { ContributionCardSkeleton } from '../../components/ui/Skeleton';

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[#C6FF3D]/20 flex items-center justify-center mb-4">
        <Search size={28} className="text-[#6B6B6B]" />
      </div>
      <h3 className="text-base font-display font-semibold text-[#0A0A0A] mb-2">No tasks found</h3>
      <p className="text-xs text-[#6B6B6B]">Try a different search or check back later.</p>
    </motion.div>
  );
}

export default function ContributionsPage() {
  const { contributions, searchQuery } = useStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'applied'>('all');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = contributions.filter((c) => {
    if (filter === 'applied' && !c.applied) return false;
    if (filter === 'open' && c.applied) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-[#0A0A0A]">Contribution Board</h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            {loading ? 'Loading tasks...' : `${filtered.length} tasks available`}
          </p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-[#FAFAFA] rounded-btn border border-[#EAEAEA] p-1">
          {(['all', 'open', 'applied'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-all duration-150 cursor-pointer ${filter === f ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: contributions.length, color: 'text-[#3D5CFF]', bg: 'bg-[#3D5CFF]/10' },
          { label: 'Applied', value: contributions.filter(c => c.applied).length, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
          { label: 'Credits Available', value: contributions.filter(c => !c.applied).reduce((sum, c) => sum + c.creditsOffered, 0), color: 'text-[#0A0A0A]', bg: 'bg-[#C6FF3D]/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-card p-4`}>
            <p className="text-2xs text-[#6B6B6B] font-medium mb-1">{label}</p>
            <p className={`text-lg font-display font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContributionCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((contrib, i) => (
            <ContributionCard key={contrib.id} contribution={contrib} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
