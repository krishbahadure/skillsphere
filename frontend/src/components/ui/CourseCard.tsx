import { motion } from 'framer-motion';
import { Star, Clock, Users, Bookmark } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Course } from '../../types';

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-[#22C55E]/10 text-[#22C55E]',
  Intermediate: 'bg-[#3D5CFF]/10 text-[#3D5CFF]',
  Advanced: 'bg-orange-100 text-orange-600',
};

interface CourseCardProps {
  course: Course;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const toggleBookmark = useStore((s) => s.toggleBookmark);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}` : `${m}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="card group overflow-hidden cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#FAFAFA]">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="badge bg-black/60 text-white backdrop-blur-sm text-xs">
            {course.category}
          </span>
        </div>
        {/* Bookmark */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(course.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-btn bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-150 cursor-pointer"
          aria-label={course.bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark
            size={15}
            className={course.bookmarked ? 'fill-[#3D5CFF] text-[#3D5CFF]' : 'text-[#6B6B6B]'}
          />
        </motion.button>
        {/* Difficulty */}
        <div className="absolute bottom-3 left-3">
          <span className={`badge text-xs ${difficultyColors[course.difficulty]} bg-white/90 backdrop-blur-sm`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#0A0A0A] leading-snug line-clamp-2 mb-3 group-hover:text-[#3D5CFF] transition-colors duration-150">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={course.instructor.avatarUrl}
            alt={course.instructor.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-2xs text-[#6B6B6B]">{course.instructor.name}</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-2xs text-[#6B6B6B] mb-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDuration(course.durationMins)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {course.studentsCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={12} className="fill-yellow-400" />
            {course.rating}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EAEAEA]">
          <span className="badge bg-[#C6FF3D] text-[#0B0B0B] font-semibold">
            {course.creditCost} credits
          </span>
        </div>
      </div>
    </motion.div>
  );
}
