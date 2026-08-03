import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, Camera, Github, Linkedin, Globe,
  User, Mail, MapPin, BookOpen, ChevronRight, Loader2,
  Briefcase, GraduationCap,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { UserRole } from '../types';

/* ── constants ───────────────────────────────────── */
const SKILL_SUGGESTIONS = [
  'React', 'TypeScript', 'Python', 'Figma', 'Node.js', 'SQL',
  'Machine Learning', 'UI Design', 'Marketing', 'Finance',
  'Data Science', 'After Effects', 'SEO', 'Java', 'Swift',
];

const INTEREST_SUGGESTIONS = [
  'Frontend Development', 'AI/ML', 'Open Source', 'Product Design',
  'EdTech', 'Entrepreneurship', 'Data Science', 'UX Research',
  'Mobile Dev', 'Blockchain',
];

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'Singapore', 'UAE', 'France', 'Japan', 'Brazil', 'Other',
];

const ROLES: { value: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'Student', label: 'Student', icon: GraduationCap, desc: 'Learning & earning credits' },
  { value: 'Company & Freelancer', label: 'Company & Freelancer', icon: Briefcase, desc: 'Posting tasks & hiring talent' },
];

const MAX_BIO = 250;

/* ── helpers ─────────────────────────────────────── */
interface FieldState { value: string; touched: boolean; error: string }
const initField = (v = ''): FieldState => ({ value: v, touched: false, error: '' });

const isValidUsername = (v: string) => /^[a-zA-Z0-9_.]+$/.test(v);

/* ── sub-components ──────────────────────────────── */
function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
          className="text-[11px] text-red-500 mt-1 font-medium"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function fieldBorder(f: FieldState, extra = '') {
  const base = `input-field transition-all duration-200 ${extra}`;
  if (!f.touched || !f.value.trim()) return base;
  if (f.error) return `${base} !border-red-400 !ring-red-200 !ring-2`;
  return `${base} !border-green-400 !ring-green-100 !ring-2`;
}

function PhotoUpload({
  id, label, preview, aspect, onFile,
}: {
  id: string; label: string; preview: string | null;
  aspect: 'square' | 'wide'; onFile: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const isWide = aspect === 'wide';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) onFile(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div
        onClick={() => ref.current?.click()}
        className={`relative overflow-hidden border-2 border-dashed border-[#EAEAEA] rounded-xl cursor-pointer group hover:border-[#3D5CFF] transition-colors duration-200 ${isWide ? 'w-full h-32' : 'w-20 h-20 rounded-2xl'}`}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#FAFAFA]">
            <Camera size={isWide ? 20 : 16} className="text-[#6B6B6B]" />
            {isWide && <span className="text-[11px] text-[#6B6B6B] font-medium">Upload cover photo</span>}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera size={isWide ? 18 : 14} className="text-white" />
        </div>
      </div>
      <input ref={ref} id={id} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}

function ChipSelector({
  id, tags, suggestions, placeholder, onAdd, onRemove,
}: {
  id: string; tags: string[]; suggestions: string[];
  placeholder: string; onAdd: (s: string) => void; onRemove: (s: string) => void;
}) {
  const [input, setInput] = useState('');
  return (
    <div>
      <div className="input-field flex flex-wrap gap-1.5 min-h-[44px] p-2 cursor-text">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3D5CFF]/10 text-[#3D5CFF] text-xs font-medium shrink-0">
            {t}
            <button type="button" onClick={() => onRemove(t)} className="hover:text-red-500 cursor-pointer" aria-label={`Remove ${t}`}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="flex-1 min-w-[100px] outline-none text-xs bg-transparent"
          placeholder={tags.length === 0 ? placeholder : ''}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); const v = input.trim(); if (v) { onAdd(v); setInput(''); } }
          }}
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {suggestions.filter(s => !tags.includes(s)).slice(0, 6).map(s => (
          <button key={s} type="button" onClick={() => onAdd(s)}
            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAFAFA] border border-[#EAEAEA] text-[#6B6B6B] hover:border-[#3D5CFF] hover:text-[#3D5CFF] cursor-pointer transition-colors duration-100">
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 24 }}
        className="bg-white rounded-[28px] border border-[#EAEAEA] shadow-card-hover p-10 flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
          className="w-16 h-16 rounded-full bg-[#C6FF3D] flex items-center justify-center"
        >
          <Check size={30} className="text-[#0B0B0B]" strokeWidth={3} />
        </motion.div>
        <div>
          <h3 className="text-lg font-display font-bold text-[#0A0A0A]">Profile Complete! 🎉</h3>
          <p className="text-xs text-[#6B6B6B] mt-1">Taking you to your dashboard…</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="btn-primary text-sm w-full justify-center"
        >
          Go to Dashboard <ChevronRight size={14} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ── main component ──────────────────────────────── */
export default function ProfileSetup() {
  const navigate = useNavigate();
  const { completeProfile } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Photos
  const [avatar, setAvatar] = useState<string | null>(null);
  const [cover, setCover]   = useState<string | null>(null);

  // Required fields
  const [fullName,  setFullName]  = useState(initField());
  const [username,  setUsername]  = useState(initField());
  const [bio,       setBio]       = useState(initField());
  const [college,   setCollege]   = useState(initField());
  const [city,      setCity]      = useState(initField());
  const [country,   setCountry]   = useState(initField());
  const [role,      setRole]      = useState<UserRole>('Student');
  const [skills,    setSkills]    = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // Optional fields
  const [linkedin,  setLinkedin]  = useState('');
  const [github,    setGithub]    = useState('');
  const [portfolio, setPortfolio] = useState('');

  /* ── validators ──────────────────────────────────── */
  const vName = useCallback((v: string) => {
    const t = v.trim();
    if (!t) return 'Full name is required.';
    if (t.length < 3) return 'Must be at least 3 characters.';
    if (!/^[A-Za-z\s]+$/.test(t)) return 'Only letters and spaces allowed.';
    return '';
  }, []);

  const vUsername = useCallback((v: string) => {
    const t = v.trim();
    if (!t) return 'Username is required.';
    if (!isValidUsername(t)) return 'Only letters, numbers, underscores, and periods.';
    return '';
  }, []);

  const vBio = useCallback((v: string) => {
    if (!v.trim()) return 'Bio is required.';
    if (v.length > MAX_BIO) return `Max ${MAX_BIO} characters.`;
    return '';
  }, []);

  const vRequired = (label: string) => (v: string) => !v.trim() ? `${label} is required.` : '';
  const vCollege = useCallback(vRequired('College / University'), []);
  const vCity    = useCallback(vRequired('City'), []);
  const vCountry = useCallback((v: string) => !v || v === '' ? 'Country is required.' : '', []);

  /* ── derived ─────────────────────────────────────── */
  const bioLen = bio.value.length;

  const isFormValid =
    !vName(fullName.value) &&
    !vUsername(username.value) &&
    !vBio(bio.value) &&
    !vCollege(college.value) &&
    !vCity(city.value) &&
    !vCountry(country.value) &&
    skills.length > 0 &&
    interests.length > 0;

  /* ── change helpers ──────────────────────────────── */
  const mkHandler = (
    setter: React.Dispatch<React.SetStateAction<FieldState>>,
    validator: (v: string) => string,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setter({ value: val, touched: true, error: validator(val) });
  };

  const mkBlur = (
    setter: React.Dispatch<React.SetStateAction<FieldState>>,
    validator: (v: string) => string,
  ) => () => setter(p => ({ ...p, touched: true, error: validator(p.value) }));

  /* ── submit ──────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all required fields
    setFullName(p => ({ ...p, touched: true, error: vName(p.value) }));
    setUsername(p => ({ ...p, touched: true, error: vUsername(p.value) }));
    setBio(p      => ({ ...p, touched: true, error: vBio(p.value) }));
    setCollege(p  => ({ ...p, touched: true, error: vCollege(p.value) }));
    setCity(p     => ({ ...p, touched: true, error: vCity(p.value) }));
    setCountry(p  => ({ ...p, touched: true, error: vCountry(p.value) }));

    if (!isFormValid) return;

    setIsLoading(true);
    setTimeout(() => {
      completeProfile({
        name:      fullName.value.trim(),
        username:  username.value.trim(),
        bio:       bio.value.trim(),
        college:   college.value.trim(),
        city:      city.value.trim(),
        country:   country.value,
        location:  `${city.value.trim()}, ${country.value}`,
        role,
        skills,
        interests,
        linkedin:  linkedin.trim() || undefined,
        github:    github.trim() || undefined,
        portfolio: portfolio.trim() || undefined,
        ...(avatar ? { avatarUrl: avatar } : {}),
        ...(cover  ? { coverUrl:  cover  } : {}),
      });
      setIsLoading(false);
      setIsSuccess(true);
    }, 1400);
  };

  if (isSuccess) return <SuccessOverlay onDone={() => navigate('/app/courses')} />;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#C6FF3D]/15 blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full bg-[#3D5CFF]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-2xl py-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#C6FF3D]/20 text-[#0A0A0A] px-4 py-2 rounded-pill text-xs font-semibold mb-4">
            ✨ Complete Your Profile
          </div>
          <h1 className="text-xl font-display font-semibold text-[#0A0A0A]">Let's set up your profile</h1>
          <p className="text-xs text-[#6B6B6B] mt-1">This takes about a minute and helps others discover you.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── Photos ── */}
          <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-6 space-y-4">
            <h2 className="text-sm font-display font-bold text-[#0A0A0A]">Photos</h2>
            <PhotoUpload id="setup-cover" label="Cover Photo" preview={cover} aspect="wide" onFile={setCover} />
            <div className="flex items-end gap-4">
              <PhotoUpload id="setup-avatar" label="Profile Photo" preview={avatar} aspect="square" onFile={setAvatar} />
              <p className="text-[11px] text-[#6B6B6B] pb-1">Click the box to upload. JPG or PNG, max 5 MB.</p>
            </div>
          </div>

          {/* ── Role ── */}
          <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-6">
            <h2 className="text-sm font-display font-bold text-[#0A0A0A] mb-4">I am a <span className="text-red-400">*</span></h2>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer text-left ${
                    role === value
                      ? 'border-[#3D5CFF] bg-[#3D5CFF]/05'
                      : 'border-[#EAEAEA] bg-[#FAFAFA] hover:border-[#3D5CFF]/40'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${role === value ? 'bg-[#3D5CFF] text-white' : 'bg-[#EAEAEA] text-[#6B6B6B]'}`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${role === value ? 'text-[#3D5CFF]' : 'text-[#0A0A0A]'}`}>{label}</p>
                    <p className="text-[10px] text-[#6B6B6B] mt-0.5">{desc}</p>
                  </div>
                  {role === value && (
                    <Check size={14} className="text-[#3D5CFF] ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Basic Info ── */}
          <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-6">
            <h2 className="text-sm font-display font-bold text-[#0A0A0A] mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">

              {/* Full Name */}
              <div>
                <Label htmlFor="setup-name" required>Full Name</Label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                  <input
                    id="setup-name"
                    type="text"
                    placeholder="Alex Chen"
                    value={fullName.value}
                    onChange={mkHandler(setFullName, vName)}
                    onBlur={mkBlur(setFullName, vName)}
                    className={fieldBorder(fullName, 'pl-9')}
                  />
                </div>
                <FieldError msg={fullName.touched ? fullName.error : ''} />
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="setup-username" required>Username</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] text-xs font-medium">@</span>
                  <input
                    id="setup-username"
                    type="text"
                    placeholder="alexchen"
                    value={username.value}
                    onChange={mkHandler(setUsername, vUsername)}
                    onBlur={mkBlur(setUsername, vUsername)}
                    className={fieldBorder(username, 'pl-7')}
                  />
                </div>
                <FieldError msg={username.touched ? username.error : ''} />
              </div>

              {/* Bio */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="setup-bio" required>Bio</Label>
                  <span className={`text-[10px] font-medium ${bioLen > MAX_BIO ? 'text-red-400' : bioLen > MAX_BIO * 0.8 ? 'text-yellow-500' : 'text-[#6B6B6B]'}`}>
                    {bioLen} / {MAX_BIO}
                  </span>
                </div>
                <textarea
                  id="setup-bio"
                  rows={3}
                  placeholder="Tell the community about yourself, your interests, and what you'd like to learn or teach…"
                  value={bio.value}
                  onChange={mkHandler(setBio, vBio)}
                  onBlur={mkBlur(setBio, vBio)}
                  className={fieldBorder(bio, 'resize-none') + ' w-full'}
                  maxLength={MAX_BIO + 10}
                />
                <FieldError msg={bio.touched ? bio.error : ''} />
              </div>
            </div>
          </div>

          {/* ── Location & College ── */}
          <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-6">
            <h2 className="text-sm font-display font-bold text-[#0A0A0A] mb-4">Location & Education</h2>
            <div className="grid grid-cols-2 gap-4">

              {/* College */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="setup-college" required>College / University</Label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                  <input
                    id="setup-college"
                    type="text"
                    placeholder="IIT Bombay"
                    value={college.value}
                    onChange={mkHandler(setCollege, vCollege)}
                    onBlur={mkBlur(setCollege, vCollege)}
                    className={fieldBorder(college, 'pl-9')}
                  />
                </div>
                <FieldError msg={college.touched ? college.error : ''} />
              </div>

              {/* City */}
              <div>
                <Label htmlFor="setup-city" required>City</Label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                  <input
                    id="setup-city"
                    type="text"
                    placeholder="Mumbai"
                    value={city.value}
                    onChange={mkHandler(setCity, vCity)}
                    onBlur={mkBlur(setCity, vCity)}
                    className={fieldBorder(city, 'pl-9')}
                  />
                </div>
                <FieldError msg={city.touched ? city.error : ''} />
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="setup-country" required>Country</Label>
                <select
                  id="setup-country"
                  value={country.value}
                  onChange={e => setCountry({ value: e.target.value, touched: true, error: vCountry(e.target.value) })}
                  onBlur={mkBlur(setCountry, vCountry)}
                  className={fieldBorder(country)}
                >
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <FieldError msg={country.touched ? country.error : ''} />
              </div>
            </div>
          </div>

          {/* ── Skills & Interests ── */}
          <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-6 space-y-5">
            <h2 className="text-sm font-display font-bold text-[#0A0A0A]">Skills & Interests</h2>

            <div>
              <Label htmlFor="setup-skills" required>Skills</Label>
              <ChipSelector
                id="setup-skills"
                tags={skills}
                suggestions={SKILL_SUGGESTIONS}
                placeholder="Type a skill and press Enter"
                onAdd={s => setSkills(p => p.includes(s) ? p : [...p, s])}
                onRemove={s => setSkills(p => p.filter(x => x !== s))}
              />
              <AnimatePresence>
                {skills.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="text-[11px] text-[#6B6B6B] mt-1"
                  >
                    Add at least one skill.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <Label htmlFor="setup-interests" required>Interests</Label>
              <ChipSelector
                id="setup-interests"
                tags={interests}
                suggestions={INTEREST_SUGGESTIONS}
                placeholder="Type an interest and press Enter"
                onAdd={s => setInterests(p => p.includes(s) ? p : [...p, s])}
                onRemove={s => setInterests(p => p.filter(x => x !== s))}
              />
              <AnimatePresence>
                {interests.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="text-[11px] text-[#6B6B6B] mt-1"
                  >
                    Add at least one interest.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Optional Links ── */}
          <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-6">
            <h2 className="text-sm font-display font-bold text-[#0A0A0A] mb-1">Social Links <span className="text-[#6B6B6B] font-normal text-xs">(optional)</span></h2>
            <p className="text-[11px] text-[#6B6B6B] mb-4">Help others find and connect with you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'setup-linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/you', value: linkedin, set: setLinkedin },
                { id: 'setup-github', label: 'GitHub', icon: Github, placeholder: 'github.com/you', value: github, set: setGithub },
                { id: 'setup-portfolio', label: 'Portfolio', icon: Globe, placeholder: 'yoursite.com', value: portfolio, set: setPortfolio },
              ].map(({ id, label, icon: Icon, placeholder, value, set }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                    <input
                      id={id}
                      type="text"
                      placeholder={placeholder}
                      value={value}
                      onChange={e => set(e.target.value)}
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <motion.button
            whileTap={isFormValid && !isLoading ? { scale: 0.97 } : {}}
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`btn-primary w-full justify-center transition-opacity duration-200 ${!isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <><Loader2 size={15} className="animate-spin" /> Saving profile…</>
            ) : (
              <>Save & Continue <ChevronRight size={15} /></>
            )}
          </motion.button>

          {!isFormValid && (
            <p className="text-center text-[11px] text-[#6B6B6B]">
              Fill all required <span className="text-red-400 font-semibold">*</span> fields and add at least one skill and interest to continue.
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
