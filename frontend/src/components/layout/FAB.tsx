import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, BookOpen, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui/Modal';
import type { Course, Contribution } from '../../types';

// Publish Course Modal
function PublishCourseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const addCourse = useStore((s) => s.addCourse);
  const user = useStore((s) => s.user);
  const [form, setForm] = useState({
    title: '', category: 'Design', difficulty: 'Beginner' as Course['difficulty'],
    description: '', lessonsCount: '', durationMins: '', creditCost: '',
    thumbnailUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      title: form.title,
      thumbnailUrl: form.thumbnailUrl || `https://picsum.photos/seed/${Date.now()}/640/360`,
      category: form.category,
      difficulty: form.difficulty,
      instructor: { name: user.name, avatarUrl: user.avatarUrl },
      durationMins: parseInt(form.durationMins) || 60,
      studentsCount: 0,
      creditCost: parseInt(form.creditCost) || 10,
      rating: 0,
      bookmarked: false,
    };
    addCourse(newCourse);
    onClose();
    setForm({ title: '', category: 'Design', difficulty: 'Beginner', description: '', lessonsCount: '', durationMins: '', creditCost: '', thumbnailUrl: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish a Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-thumbnail">Thumbnail URL <span className="text-[#6B6B6B] font-normal">(or leave blank for auto)</span></label>
          <input id="pub-thumbnail" className="input-field" placeholder="https://..." value={form.thumbnailUrl} onChange={e => setForm(p => ({ ...p, thumbnailUrl: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-title">Course Title *</label>
          <input id="pub-title" required className="input-field" placeholder="e.g. React 18 Deep Dive" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-category">Category *</label>
            <select id="pub-category" required className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {['Design','Web Dev','Data Science','Marketing','Finance','Languages'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-difficulty">Difficulty *</label>
            <select id="pub-difficulty" required className="input-field" value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value as Course['difficulty'] }))}>
              {['Beginner','Intermediate','Advanced'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-lessons">Lessons</label>
            <input id="pub-lessons" type="number" min="1" className="input-field" placeholder="12" value={form.lessonsCount} onChange={e => setForm(p => ({ ...p, lessonsCount: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-duration">Duration (min)</label>
            <input id="pub-duration" type="number" min="1" className="input-field" placeholder="120" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-credits">Credit Cost</label>
            <input id="pub-credits" type="number" min="1" className="input-field" placeholder="15" value={form.creditCost} onChange={e => setForm(p => ({ ...p, creditCost: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="pub-desc">Description</label>
          <textarea id="pub-desc" rows={3} className="input-field resize-none" placeholder="What will students learn?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button type="submit" className="btn-primary flex-1 justify-center">Publish Course</button>
        </div>
      </form>
    </Modal>
  );
}

// Post Contribution Modal
function PostContributionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const addContribution = useStore((s) => s.addContribution);
  const user = useStore((s) => s.user);
  const [form, setForm] = useState({
    title: '', description: '', skills: '', creditsOffered: '', deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContrib: Contribution = {
      id: `cn-${Date.now()}`,
      title: form.title,
      description: form.description,
      requiredSkills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      creditsOffered: parseInt(form.creditsOffered) || 30,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
      postedBy: { name: user.name, avatarUrl: user.avatarUrl },
      applicantsCount: 0,
      applied: false,
    };
    addContribution(newContrib);
    onClose();
    setForm({ title: '', description: '', skills: '', creditsOffered: '', deadline: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a Contribution Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="post-title">Task Title *</label>
          <input id="post-title" required className="input-field" placeholder="e.g. Design a Landing Page Mockup" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="post-desc">Description *</label>
          <textarea id="post-desc" required rows={4} className="input-field resize-none" placeholder="Describe what you need, deliverables, and any constraints..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="post-skills">Required Skills <span className="text-[#6B6B6B] font-normal">(comma separated)</span></label>
          <input id="post-skills" className="input-field" placeholder="Figma, UI Design, Typography" value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="post-credits">Credits Offered *</label>
            <input id="post-credits" required type="number" min="1" className="input-field" placeholder="40" value={form.creditsOffered} onChange={e => setForm(p => ({ ...p, creditsOffered: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="post-deadline">Deadline *</label>
            <input id="post-deadline" required type="date" className="input-field" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button type="submit" className="btn-primary flex-1 justify-center">Post Task</button>
        </div>
      </form>
    </Modal>
  );
}

// FAB
export function FAB() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showCourse, setShowCourse] = useState(false);
  const [showContrib, setShowContrib] = useState(false);

  const isCoursePage = location.pathname.includes('/app/courses');
  const isContribPage = location.pathname.includes('/app/contributions');

  const handleFABClick = () => {
    if (isCoursePage) {
      setShowCourse(true);
    } else if (isContribPage) {
      setShowContrib(true);
    } else {
      setOpen(!open);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleFABClick}
        whileHover={{ scale: 1.08, rotate: 12 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[#C6FF3D] text-[#0B0B0B] shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl"
        aria-label="Quick action"
      >
        <Plus size={24} strokeWidth={2.5} />
      </motion.button>

      {/* Generic quick-action menu (non-course/contrib pages) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-24 right-6 z-30 flex flex-col gap-2"
            >
              <button onClick={() => { setOpen(false); setShowCourse(true); }} className="flex items-center gap-3 bg-white rounded-btn border border-[#EAEAEA] shadow-card px-4 py-2.5 text-sm font-medium text-[#0A0A0A] hover:border-[#C6FF3D] transition-colors duration-150 cursor-pointer">
                <BookOpen size={16} className="text-[#3D5CFF]" /> Publish Course
              </button>
              <button onClick={() => { setOpen(false); setShowContrib(true); }} className="flex items-center gap-3 bg-white rounded-btn border border-[#EAEAEA] shadow-card px-4 py-2.5 text-sm font-medium text-[#0A0A0A] hover:border-[#C6FF3D] transition-colors duration-150 cursor-pointer">
                <Users size={16} className="text-[#22C55E]" /> Post Task
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PublishCourseModal isOpen={showCourse} onClose={() => setShowCourse(false)} />
      <PostContributionModal isOpen={showContrib} onClose={() => setShowContrib(false)} />
    </>
  );
}
