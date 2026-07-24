import { motion } from 'framer-motion';
import { Calendar, Users, Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Contribution } from '../../types';

interface ContributionCardProps {
  contribution: Contribution;
  index?: number;
}

function getDeadlineInfo(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const isUrgent = days <= 3 && days > 0;
  const isPast = days <= 0;
  const label = isPast ? 'Overdue' : days === 1 ? '1 day left' : `${days} days left`;
  return { days, isUrgent, isPast, label };
}

export function ContributionCard({ contribution, index = 0 }: ContributionCardProps) {
  const applyToContribution = useStore((s) => s.applyToContribution);

  const { isUrgent, isPast, label } = getDeadlineInfo(contribution.deadline);
  const deadlineColor = isPast ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-[#6B6B6B]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
      className="bg-white rounded-card border border-[#EAEAEA] shadow-card hover:shadow-card-hover p-6 transition-all duration-200 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-[#0A0A0A] leading-snug flex-1">
          {contribution.title}
        </h3>
        <span className="badge bg-[#C6FF3D] text-[#0B0B0B] font-bold whitespace-nowrap flex items-center gap-1 shrink-0">
          <Zap size={12} />
          {contribution.creditsOffered}
        </span>
      </div>

      {/* Description */}
      <p className="text-2xs text-[#6B6B6B] leading-relaxed line-clamp-3">
        {contribution.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {contribution.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="badge bg-[#3D5CFF]/10 text-[#3D5CFF] text-xs"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-2xs">
        <div className="flex items-center gap-3 text-[#6B6B6B]">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {contribution.applicantsCount} applied
          </span>
          <span className={`flex items-center gap-1 font-medium ${deadlineColor}`}>
            <Calendar size={12} />
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={contribution.postedBy.avatarUrl}
            alt={contribution.postedBy.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-[#6B6B6B]">{contribution.postedBy.name}</span>
        </div>
      </div>

      {/* Apply button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => applyToContribution(contribution.id)}
        className={`w-full py-2.5 rounded-btn text-xs font-semibold transition-all duration-200 cursor-pointer
          ${contribution.applied
            ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
            : 'bg-[#3D5CFF] text-white hover:bg-[#2D4AEE]'
          }`}
        aria-label={contribution.applied ? 'Applied to contribution' : 'Apply to contribution'}
      >
        {contribution.applied ? '✓ Applied' : 'Apply Now'}
      </motion.button>
    </motion.div>
  );
}
