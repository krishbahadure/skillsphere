import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD'];
const SKILL_SUGGESTIONS = ['React', 'TypeScript', 'Python', 'Figma', 'Node.js', 'SQL', 'Machine Learning', 'UI Design', 'Marketing', 'Finance'];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { setUser, login } = useStore();
  const [form, setForm] = useState({
    name: '', college: '', department: '', year: '3rd Year', bio: '', skills: [] as string[], skillInput: '',
  });

  const addSkill = (skill: string) => {
    if (skill && !form.skills.includes(skill)) {
      setForm(p => ({ ...p, skills: [...p.skills, skill], skillInput: '' }));
    }
  };

  const removeSkill = (skill: string) => {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: form.name || undefined, college: form.college || undefined, department: form.department || undefined, year: form.year, bio: form.bio || undefined, skills: form.skills.length > 0 ? form.skills : undefined });
    login();
    navigate('/app/courses');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#C6FF3D]/15 blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full bg-[#3D5CFF]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#C6FF3D]/20 text-[#0A0A0A] px-4 py-2 rounded-pill text-xs font-medium mb-4">
            Step 3 of 3 — Profile Setup
          </div>
          <h1 className="text-xl font-display font-semibold text-[#0A0A0A]">Set up your profile</h1>
          <p className="text-xs text-[#6B6B6B] mt-1">Help others know who you are and what you're great at</p>
        </div>

        <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C6FF3D] to-[#3D5CFF] flex items-center justify-center text-white font-display font-bold text-xl cursor-pointer hover:opacity-90 transition-opacity" aria-label="Upload avatar">
                {form.name ? form.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="text-xs font-medium text-[#0A0A0A]">Profile Photo</p>
                <p className="text-2xs text-[#6B6B6B]">Click to upload (demo only)</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="setup-name">Full Name</label>
              <input id="setup-name" className="input-field" placeholder="Alex Chen" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="setup-college">College / University</label>
                <input id="setup-college" className="input-field" placeholder="IIT Bombay" value={form.college} onChange={e => setForm(p => ({ ...p, college: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="setup-dept">Department</label>
                <input id="setup-dept" className="input-field" placeholder="Computer Science" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="setup-year">Year</label>
              <select id="setup-year" className="input-field" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="setup-skills">Skills</label>
              <div className="input-field flex flex-wrap gap-2 min-h-[44px] p-2">
                {form.skills.map(skill => (
                  <span key={skill} className="badge bg-[#3D5CFF]/10 text-[#3D5CFF] text-xs flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 cursor-pointer" aria-label={`Remove ${skill}`}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  id="setup-skills"
                  className="flex-1 min-w-[80px] outline-none text-xs bg-transparent"
                  placeholder="Type a skill and press Enter"
                  value={form.skillInput}
                  onChange={e => setForm(p => ({ ...p, skillInput: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(form.skillInput.trim()); } }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 6).map(s => (
                  <button key={s} type="button" onClick={() => addSkill(s)} className="badge bg-[#FAFAFA] text-[#6B6B6B] border border-[#EAEAEA] hover:border-[#3D5CFF] hover:text-[#3D5CFF] cursor-pointer text-xs transition-colors duration-100">
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="setup-bio">Bio</label>
              <textarea id="setup-bio" rows={3} className="input-field resize-none" placeholder="Tell the community about yourself, your interests, and what you'd like to learn or teach..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            </div>

            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary w-full justify-center mt-2">
              Save & Continue →
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
