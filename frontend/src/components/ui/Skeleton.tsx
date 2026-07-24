import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      aria-hidden="true"
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-card border border-[#EAEAEA] overflow-hidden">
      <Skeleton className="w-full aspect-video" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-pill" />
          <Skeleton className="h-5 w-20 rounded-pill" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-pill" />
        </div>
      </div>
    </div>
  );
}

export function ContributionCardSkeleton() {
  return (
    <div className="bg-white rounded-card border border-[#EAEAEA] p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-pill" />
        <Skeleton className="h-6 w-20 rounded-pill" />
        <Skeleton className="h-6 w-14 rounded-pill" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-20 rounded-btn" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
        >
          <CourseCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}
