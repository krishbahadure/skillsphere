import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Star, Clock, Users, Coins, Bookmark, Share2,
  ChevronRight, CheckCircle, BookOpen
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Course } from '../../types';
import { useNavigate } from "react-router-dom";

/* ─────────────────── helpers ─────────────────── */

const diffColors: Record<string, string> = {
  Beginner: 'bg-[#22C55E]/15 text-[#22C55E]',
  Intermediate: 'bg-[#3D5CFF]/10 text-[#3D5CFF]',
  Advanced: 'bg-orange-100 text-orange-600',
};

function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-[#EAEAEA]'}
        />
      ))}
      <span className="text-[11px] text-[#6B6B6B] ml-1">{rating}</span>
    </span>
  );
}

/* ─────────────────── Enroll Confirmation ─────────────────── */
function EnrollConfirm({
  course, onConfirm, onCancel,
}: { course: Course; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl"
    >
      <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-card-hover p-6 mx-6 max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-full bg-[#C6FF3D]/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={24} className="text-[#0A0A0A]" />
        </div>
        <h3 className="text-base font-display font-bold text-[#0A0A0A] mb-1">Enrol in this course?</h3>
        <p className="text-xs text-[#6B6B6B] mb-1 leading-relaxed">{course.title}</p>
        <div className="flex items-center justify-center gap-1.5 mb-5">
          <Coins size={14} className="text-[#0A0A0A]" />
          <span className="text-sm font-bold text-[#0A0A0A]">{course.creditCost} credits will be deducted</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-btn border border-[#EAEAEA] text-xs font-semibold text-[#6B6B6B] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-btn bg-[#C6FF3D] text-[#0B0B0B] text-xs font-bold hover:bg-[#B8F020] transition-colors duration-150 cursor-pointer"
          >
            Confirm Enrolment
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Main Modal ─────────────────── */
interface Props {
  course: Course | null;
  onClose: () => void;
}

export function CourseDetailModal({ course, onClose }: Props) {
  const { toggleBookmark, courses } = useStore();
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Current bookmark state (live from store)
  const live = course ? courses.find(c => c.id === course.id) : null;

  // Related courses (same category, exclude current)
  const related = course
    ? courses.filter(c => c.category === course.category && c.id !== course.id).slice(0, 6)
    : [];

  // Esc key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Scroll lock
  useEffect(() => {
    if (course) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [course]);

  // Reset state when new course selected
  useEffect(() => {
    setEnrolled(false);
    setShowConfirm(false);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [course?.id]);

  const navigate = useNavigate();

  const handleConfirmEnrol = () => {
      setShowConfirm(false);
      setEnrolled(true);

      setTimeout(() => {
          onClose();
          navigate(`/app/course/${course!.id}`);
      }, 800);
  };

  if (!course) return null;

  const modal = (
    <AnimatePresence>
      {course && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key={`modal-${course.id}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="relative bg-white rounded-[24px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.28)] w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Enroll confirmation overlay */}
              <AnimatePresence>
                {showConfirm && (
                  <EnrollConfirm
                    course={course}
                    onConfirm={handleConfirmEnrol}
                    onCancel={() => setShowConfirm(false)}
                  />
                )}
              </AnimatePresence>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-150 cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              {/* ── Scrollable body ── */}
              <div ref={scrollRef} className="overflow-y-auto overscroll-contain flex-1">

                {/* Hero thumbnail */}
                <div className="relative w-full aspect-[16/7] overflow-hidden shrink-0">
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Floating category chip */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold border border-white/30">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* ── Header Info ── */}
                <div className="px-6 py-5 border-b border-[#EAEAEA]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-display font-bold text-[#0A0A0A] leading-snug mb-2">{course.title}</h2>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 mb-3">
                        <img src={course.instructor.avatarUrl} alt={course.instructor.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs font-medium text-[#6B6B6B]">by <span className="text-[#0A0A0A]">{course.instructor.name}</span></span>
                      </div>

                      {/* Meta pills row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Stars rating={course.rating} />
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${diffColors[course.difficulty]}`}>{course.difficulty}</span>
                        <span className="flex items-center gap-1 text-[11px] text-[#6B6B6B]"><Clock size={11} />{fmt(course.durationMins)}</span>
                        <span className="flex items-center gap-1 text-[11px] text-[#6B6B6B]"><Users size={11} />{course.studentsCount.toLocaleString()} students</span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0A0A0A]"><Coins size={11} />{course.creditCost} credits</span>
                      </div>

                      {/* Tags */}
                      {course.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {course.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-[#FAFAFA] border border-[#EAEAEA] text-[10px] text-[#6B6B6B]">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Credit cost badge */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#C6FF3D] flex flex-col items-center justify-center">
                        <Coins size={18} className="text-[#0B0B0B] mb-0.5" />
                        <span className="text-sm font-display font-bold text-[#0B0B0B]">{course.creditCost}</span>
                      </div>
                      <span className="text-[9px] text-[#6B6B6B] mt-1">credits</span>
                    </div>
                  </div>
                </div>

                {/* ── Action Bar ── */}
                <div className="px-6 py-4 flex items-center gap-3 border-b border-[#EAEAEA] bg-[#FAFAFA]">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { if (!enrolled) setShowConfirm(true); }}
                    disabled={enrolled}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-btn font-semibold text-sm transition-all duration-200 cursor-pointer ${
                      enrolled
                        ? 'bg-[#22C55E] text-white cursor-default'
                        : 'bg-[#C6FF3D] text-[#0B0B0B] hover:bg-[#B8F020]'
                    }`}
                  >
                    {enrolled ? (
                      <><CheckCircle size={16} /> Enrolled!</>
                    ) : (
                      <><ChevronRight size={16} /> Enrol Now</>
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleBookmark(course.id)}
                    className="p-3 rounded-btn border border-[#EAEAEA] hover:border-[#3D5CFF] transition-colors duration-150 cursor-pointer"
                    aria-label="Bookmark"
                  >
                    <Bookmark
                      size={16}
                      className={live?.bookmarked ? 'fill-[#3D5CFF] text-[#3D5CFF]' : 'text-[#6B6B6B]'}
                    />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    className="p-3 rounded-btn border border-[#EAEAEA] hover:border-[#C6FF3D] transition-colors duration-150 cursor-pointer"
                    aria-label="Share"
                    title="Copy link"
                  >
                    <Share2 size={16} className="text-[#6B6B6B]" />
                  </motion.button>
                </div>

                {/* ── Body Content ── */}
                <div className="px-6 py-5 space-y-6">

                  {/* Description */}
                  {course.description && (
                    <div>
                      <h3 className="text-sm font-display font-bold text-[#0A0A0A] mb-2">About this course</h3>
                      <p className="text-xs text-[#6B6B6B] leading-relaxed">{course.description}</p>
                    </div>
                  )}

                  {/* Skills Learned */}
                  {course.skillsLearned && course.skillsLearned.length > 0 && (
                    <div>
                      <h3 className="text-sm font-display font-bold text-[#0A0A0A] mb-3">What you'll learn</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.skillsLearned.map(s => (
                          <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3D5CFF]/08 border border-[#3D5CFF]/20 text-[11px] font-medium text-[#3D5CFF]">
                            <CheckCircle size={10} />
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructor */}
                  {course.instructorBio && (
                    <div>
                      <h3 className="text-sm font-display font-bold text-[#0A0A0A] mb-3">Your Instructor</h3>
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
                        <img src={course.instructor.avatarUrl} alt={course.instructor.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 ring-2 ring-[#C6FF3D]/40" />
                        <div>
                          <p className="text-sm font-semibold text-[#0A0A0A]">{course.instructor.name}</p>
                          <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">{course.instructorBio}</p>
                          <button className="mt-2 text-[11px] text-[#3D5CFF] font-medium hover:underline cursor-pointer">
                            View Creator Profile →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  {course.reviews && course.reviews.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-display font-bold text-[#0A0A0A]">Student Reviews</h3>
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold flex items-center gap-1">
                          <Star size={9} className="fill-yellow-500" /> {course.rating}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {course.reviews.map(r => (
                          <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl border border-[#EAEAEA]">
                            <img src={r.avatarUrl} alt={r.author} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-[#0A0A0A]">{r.author}</span>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={10} className={i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#EAEAEA]'} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-[#6B6B6B] leading-relaxed">{r.comment}</p>
                              <p className="text-[10px] text-[#6B6B6B] mt-1">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Courses */}
                  {related.length > 0 && (
                    <div className="pb-4">
                      <h3 className="text-sm font-display font-bold text-[#0A0A0A] mb-3">More in {course.category}</h3>
                      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                        {related.map(c => (
                          <div
                            key={c.id}
                            className="shrink-0 w-44 snap-start rounded-xl border border-[#EAEAEA] overflow-hidden hover:border-[#C6FF3D] hover:-translate-y-1 transition-all duration-150 cursor-pointer"
                          >
                            <img src={c.thumbnailUrl} alt={c.title} className="w-full h-24 object-cover" />
                            <div className="p-2.5">
                              <p className="text-[11px] font-semibold text-[#0A0A0A] line-clamp-2 mb-1">{c.title}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-[#6B6B6B]">{c.instructor.name.split(' ')[0]}</span>
                                <span className="text-[10px] font-bold text-[#0A0A0A] bg-[#C6FF3D] px-1.5 py-0.5 rounded">{c.creditCost}cr</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
