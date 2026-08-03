import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Camera, Github, Linkedin, Globe, Instagram, MapPin, ChevronRight, GraduationCap, Briefcase } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { UserRole } from '../../types';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD'];
const CATEGORIES = ['Design', 'Web Dev', 'Data Science', 'Marketing', 'Finance', 'Languages', 'AI/ML', 'Business'];
const PRIVACY_OPTIONS = ['Public', 'Friends Only', 'Private'];
const ROLES: UserRole[] = ['Student', 'Company & Freelancer'];
const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'Singapore', 'UAE', 'France', 'Japan', 'Brazil', 'Other',
];

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">{children}</label>;
}

function Input({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return <input id={id} {...props} className="input-field text-sm" />;
}

function TextArea({ id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }) {
  return <textarea id={id} {...props} className="input-field text-sm resize-none" />;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-card border border-[#EAEAEA] p-6">
      <h2 className="text-sm font-display font-bold text-[#0A0A0A] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function SkillTagInput({
  label, tags, onAdd, onRemove, suggestions, placeholder,
}: {
  label: string; tags: string[]; onAdd: (s: string) => void;
  onRemove: (s: string) => void; suggestions?: string[]; placeholder?: string;
}) {
  const [input, setInput] = useState('');
  return (
    <div>
      <Label htmlFor={`tag-${label}`}>{label}</Label>
      <div className="input-field flex flex-wrap gap-2 min-h-[46px] p-2">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3D5CFF]/10 text-[#3D5CFF] text-xs font-medium">
            {t}
            <button type="button" onClick={() => onRemove(t)} className="hover:text-red-500 cursor-pointer" aria-label={`Remove ${t}`}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id={`tag-${label}`}
          className="flex-1 min-w-[100px] outline-none text-xs bg-transparent"
          placeholder={placeholder || 'Type and press Enter'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); const v = input.trim(); if (v) { onAdd(v); setInput(''); } }
          }}
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.filter(s => !tags.includes(s)).slice(0, 6).map(s => (
            <button key={s} type="button" onClick={() => onAdd(s)}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAFAFA] border border-[#EAEAEA] text-[#6B6B6B] hover:border-[#3D5CFF] hover:text-[#3D5CFF] cursor-pointer transition-colors duration-100">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-white rounded-[28px] border border-[#EAEAEA] shadow-card-hover p-10 flex flex-col items-center gap-4 max-w-sm w-full mx-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
          className="w-16 h-16 rounded-full bg-[#C6FF3D] flex items-center justify-center"
        >
          <Check size={30} className="text-[#0B0B0B]" strokeWidth={3} />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-display font-bold text-[#0A0A0A]">Profile Updated!</h3>
          <p className="text-xs text-[#6B6B6B] mt-1">Your changes have been saved successfully.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="btn-primary text-sm w-full justify-center"
        >
          View Profile <ChevronRight size={14} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    college: user.college,
    department: user.department,
    year: user.year,
    city: user.city ?? '',
    country: user.country ?? '',
    role: (user.role ?? 'Student') as UserRole,
    location: user.location,
    email: user.email,
    github: user.github ?? '',
    linkedin: user.linkedin ?? '',
    portfolio: user.portfolio ?? '',
    instagram: user.instagram ?? '',
    skills: [...user.skills],
    interests: [...user.interests],
    preferredCategories: [...user.preferredCategories],
    privacyProfile: 'Public' as string,
    privacyContributions: 'Public' as string,
    notifCredits: true,
    notifEnrollments: true,
    notifContributions: true,
    notifFollows: false,
  });

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const addTag = (key: 'skills' | 'interests' | 'preferredCategories') => (val: string) =>
    setForm(p => ({ ...p, [key]: p[key].includes(val) ? p[key] : [...p[key], val] }));

  const removeTag = (key: 'skills' | 'interests' | 'preferredCategories') => (val: string) =>
    setForm(p => ({ ...p, [key]: p[key].filter(v => v !== val) }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: form.name,
      username: form.username,
      bio: form.bio,
      college: form.college,
      department: form.department,
      year: form.year,
      city: form.city,
      country: form.country,
      role: form.role,
      location: form.city && form.country ? `${form.city}, ${form.country}` : form.location,
      email: form.email,
      github: form.github || undefined,
      linkedin: form.linkedin || undefined,
      portfolio: form.portfolio || undefined,
      instagram: form.instagram || undefined,
      skills: form.skills,
      interests: form.interests,
      preferredCategories: form.preferredCategories,
    });
    setSaved(true);
  };

  return (
    <>
      <AnimatePresence>
        {saved && <SuccessOverlay onDone={() => navigate('/app/profile')} />}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto pb-28">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-display font-bold text-[#0A0A0A]">Edit Profile</h1>
            <p className="text-xs text-[#6B6B6B] mt-0.5">Update your public profile and account settings.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* ── Avatar & Cover ── */}
          <SectionCard title="Profile Photo & Cover">
            <div className="space-y-4">
              {/* Cover */}
              <div>
                <Label htmlFor="edit-cover">Cover Photo</Label>
                <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-dashed border-[#EAEAEA] group cursor-pointer">
                  <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-2 text-white text-xs font-semibold">
                      <Camera size={14} /> Upload Cover
                    </div>
                  </div>
                </div>
              </div>
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                  <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#EAEAEA]" />
                  <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0A0A0A]">Profile Picture</p>
                  <p className="text-[11px] text-[#6B6B6B] mt-0.5">Click image to upload (JPG, PNG, max 5MB)</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Basic Info ── */}
          <SectionCard title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" value={form.name} onChange={field('name')} placeholder="Alex Chen" />
              </div>
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input id="edit-username" value={form.username} onChange={field('username')} placeholder="@alexchen" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <TextArea id="edit-bio" rows={3} value={form.bio} onChange={field('bio')} placeholder="Tell your story..." />
              </div>
              <div>
                <Label htmlFor="edit-city">City</Label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                  <Input id="edit-city" value={form.city} onChange={field('city')} placeholder="Mumbai" className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-country">Country</Label>
                <select id="edit-country" className="input-field text-sm" value={form.country} onChange={field('country')}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={form.email} onChange={field('email')} placeholder="you@college.edu" />
              </div>
            </div>
          </SectionCard>

          {/* ── Academic ── */}
          <SectionCard title="Academic Details">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-college">College / University</Label>
                <Input id="edit-college" value={form.college} onChange={field('college')} placeholder="IIT Bombay" />
              </div>
              <div>
                <Label htmlFor="edit-dept">Department</Label>
                <Input id="edit-dept" value={form.department} onChange={field('department')} placeholder="Computer Science" />
              </div>
              <div>
                <Label htmlFor="edit-year">Year</Label>
                <select id="edit-year" className="input-field text-sm" value={form.year} onChange={field('year')}>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* ── Role ── */}
          <SectionCard title="I am a">
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, role: r }))}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer text-left ${form.role === r
                      ? 'border-[#3D5CFF] bg-[#3D5CFF]/05'
                      : 'border-[#EAEAEA] bg-[#FAFAFA] hover:border-[#3D5CFF]/40'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${form.role === r ? 'bg-[#3D5CFF] text-white' : 'bg-[#EAEAEA] text-[#6B6B6B]'
                    }`}>
                    {r === 'Company & Freelancer' ? <Briefcase size={17} /> : <GraduationCap size={17} />}
                  </div>
                  <span className={`text-xs font-semibold ${form.role === r ? 'text-[#3D5CFF]' : 'text-[#0A0A0A]'
                    }`}>{r}</span>
                  {form.role === r && <Check size={13} className="text-[#3D5CFF] ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* ── Social Links ── */}
          <SectionCard title="Social Links">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'edit-github', label: 'GitHub', icon: Github, key: 'github', placeholder: 'github.com/username' },
                { id: 'edit-linkedin', label: 'LinkedIn', icon: Linkedin, key: 'linkedin', placeholder: 'linkedin.com/in/username' },
                { id: 'edit-portfolio', label: 'Portfolio', icon: Globe, key: 'portfolio', placeholder: 'yoursite.com' },
                { id: 'edit-instagram', label: 'Instagram', icon: Instagram, key: 'instagram', placeholder: 'instagram.com/username' },
              ].map(({ id, label, icon: Icon, key, placeholder }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                    <input id={id} className="input-field text-sm pl-9" placeholder={placeholder}
                      value={(form as unknown as Record<string, string>)[key]} onChange={field(key as keyof typeof form)} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── Skills & Interests ── */}
          <SectionCard title="Skills & Interests">
            <div className="space-y-5">
              <SkillTagInput
                label="Skills"
                tags={form.skills}
                onAdd={addTag('skills')}
                onRemove={removeTag('skills')}
                suggestions={['React', 'TypeScript', 'Figma', 'Python', 'Node.js', 'ML', 'SQL']}
                placeholder="Add a skill and press Enter"
              />
              <SkillTagInput
                label="Interests"
                tags={form.interests}
                onAdd={addTag('interests')}
                onRemove={removeTag('interests')}
                suggestions={['Frontend Dev', 'AI/ML', 'Open Source', 'EdTech', 'Product Design']}
                placeholder="Add an interest and press Enter"
              />
            </div>
          </SectionCard>

          {/* ── Preferred Categories ── */}
          <SectionCard title="Preferred Learning Categories">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => form.preferredCategories.includes(cat) ? removeTag('preferredCategories')(cat) : addTag('preferredCategories')(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer border ${form.preferredCategories.includes(cat)
                      ? 'bg-[#3D5CFF] text-white border-[#3D5CFF]'
                      : 'bg-[#FAFAFA] text-[#6B6B6B] border-[#EAEAEA] hover:border-[#3D5CFF] hover:text-[#3D5CFF]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* ── Privacy ── */}
          <SectionCard title="Privacy Settings">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="privacy-profile">Profile Visibility</Label>
                <select id="privacy-profile" className="input-field text-sm" value={form.privacyProfile}
                  onChange={e => setForm(p => ({ ...p, privacyProfile: e.target.value }))}>
                  {PRIVACY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="privacy-contributions">Contributions Visibility</Label>
                <select id="privacy-contributions" className="input-field text-sm" value={form.privacyContributions}
                  onChange={e => setForm(p => ({ ...p, privacyContributions: e.target.value }))}>
                  {PRIVACY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* ── Notifications ── */}
          <SectionCard title="Notification Preferences">
            <div className="space-y-3">
              {[
                { key: 'notifCredits', label: 'Credit changes & earnings' },
                { key: 'notifEnrollments', label: 'New course enrollments' },
                { key: 'notifContributions', label: 'Contribution applicants & updates' },
                { key: 'notifFollows', label: 'New followers' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#6B6B6B]">{label}</span>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, [key]: !p[key as keyof typeof form] }))}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${(form as unknown as Record<string, boolean>)[key] ? 'bg-[#C6FF3D]' : 'bg-[#EAEAEA]'}`}
                  >
                    <motion.div
                      animate={{ x: (form as unknown as Record<string, boolean>)[key] ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                    />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

        </form>

        {/* ── Fixed bottom action bar ── */}
        <div className="fixed bottom-0 left-64 right-0 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] px-8 py-4 flex items-center justify-between z-30">
          <p className="text-xs text-[#6B6B6B]">Changes are saved to your profile instantly.</p>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => navigate('/app/profile')}
              className="btn-secondary text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              onClick={handleSave}
              className="btn-primary text-sm"
            >
              <Check size={15} /> Save Changes
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
