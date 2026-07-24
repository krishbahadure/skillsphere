import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight, BookOpen, Users, Coins, Star, Check,
  Zap, Target, Globe, ChevronRight
} from 'lucide-react';

// Animated counter
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const spring = useSpring(count, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView) count.set(to);
  }, [isInView, to, count]);

  useEffect(() => {
    return spring.on('change', (v) => setDisplay(Math.round(v).toLocaleString()));
  }, [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// Mock hero UI cards
function HeroUICards() {
  return (
    <div className="relative w-full max-w-sm ml-auto">
      {/* Course card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-white rounded-card border border-[#EAEAEA] shadow-card-hover p-4 mb-4 relative z-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-btn bg-gradient-to-br from-[#C6FF3D]/60 to-[#3D5CFF]/40 overflow-hidden shrink-0">
            <img src="https://picsum.photos/seed/hero-course/48/48" alt="Course" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0A0A0A]">Figma Masterclass</p>
            <p className="text-2xs text-[#6B6B6B]">by Priya Nair</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-yellow-400" />)}
            <span className="text-2xs text-[#6B6B6B] ml-1">4.9</span>
          </div>
          <span className="badge bg-[#C6FF3D] text-[#0B0B0B] text-xs font-bold">15 credits</span>
        </div>
      </motion.div>

      {/* Credit badge */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -left-8 top-8 bg-white rounded-card border border-[#EAEAEA] shadow-card px-4 py-3 z-20"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C6FF3D]/30 flex items-center justify-center">
            <Coins size={14} className="text-[#0A0A0A]" />
          </div>
          <div>
            <p className="text-2xs text-[#6B6B6B]">Credits Earned</p>
            <p className="text-xs font-bold text-[#22C55E]">+40 credits</p>
          </div>
        </div>
      </motion.div>

      {/* Avatar cluster */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-3 flex items-center gap-2"
      >
        <div className="flex -space-x-2">
          {[15, 16, 17, 18].map((n) => (
            <img key={n} src={`https://i.pravatar.cc/32?img=${n}`} alt="Student" className="w-8 h-8 rounded-full border-2 border-white" />
          ))}
        </div>
        <p className="text-2xs text-[#6B6B6B]"><span className="font-semibold text-[#0A0A0A]">2,400+</span> students learning now</p>
      </motion.div>
    </div>
  );
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Learn from Peers',
    desc: "Access courses created by students who've mastered the skills you want — real knowledge, no filler.",
    color: 'bg-[#3D5CFF]/10 text-[#3D5CFF]',
  },
  {
    icon: Target,
    title: 'Earn by Contributing',
    desc: 'Post or complete tasks — UI designs, code, translations, research. Every contribution earns credits.',
    color: 'bg-[#C6FF3D]/30 text-[#0A0A0A]',
  },
  {
    icon: Zap,
    title: 'Credit Economy',
    desc: 'A student-powered economy where learning, teaching, and helping are all rewarded fairly.',
    color: 'bg-[#22C55E]/10 text-[#22C55E]',
  },
  {
    icon: Globe,
    title: 'Build Your Portfolio',
    desc: 'Your contributions and published courses become a live portfolio that speaks louder than a resume.',
    color: 'bg-purple-100 text-purple-600',
  },
];

const STEPS = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up, list your skills, and tell the community what you can teach and what you want to learn.' },
  { num: '02', title: 'Learn or Contribute', desc: 'Browse courses with credits, or take on contribution tasks posted by other students to earn credits fast.' },
  { num: '03', title: 'Grow Your Stack', desc: 'Spend credits to unlock new courses, build your rank, and showcase your growing portfolio.' },
];

const TESTIMONIALS = [
  {
    quote: 'I published my Figma course during semester break. Within a week, I had 80 students and enough credits to take 5 more courses. This platform just works.',
    name: 'Priya Nair',
    role: 'Design, IIT Bombay',
    avatar: 'https://i.pravatar.cc/48?img=1',
  },
  {
    quote: 'The contributions board is gold. I built a REST API for someone, earned 60 credits, and used them to take a machine learning course. Zero cost.',
    name: 'Arjun Sharma',
    role: 'Computer Science, NIT Trichy',
    avatar: 'https://i.pravatar.cc/48?img=2',
  },
  {
    quote: 'As a non-CS student, I was intimidated. But I translated subtitles, wrote blog posts, and built a real portfolio. Now I\'m a Gold Creator.',
    name: 'Meera Joshi',
    role: 'English Literature, DU',
    avatar: 'https://i.pravatar.cc/48?img=10',
  },
];

export default function Landing() {
  const featuresRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display font-bold text-lg">
            Skill<span className="text-[#C6FF3D] bg-[#0A0A0A] px-1.5 py-0.5 rounded">Sphere</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })} className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors cursor-pointer">Features</button>
            <a href="#how" className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">How it works</a>
            <a href="#community" className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">Community</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-xs px-4 py-2">
              Get Started <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-radial from-[#C6FF3D]/15 via-[#3D5CFF]/05 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#C6FF3D]/20 text-[#0A0A0A] px-4 py-2 rounded-pill text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              2,400+ students active this week
            </div>
            <h1 className="text-[64px] leading-[1.05] font-display font-bold tracking-tight mb-6">
              Learn.<br />
              Build.<br />
              <span className="relative inline-block">
                Earn.
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#C6FF3D]/60 -z-10 rounded" />
              </span>
            </h1>
            <p className="text-sm text-[#6B6B6B] max-w-content leading-body mb-8">
              SkillSphere is the student-powered platform where you learn from peer-made courses, publish your own, and earn credits by helping others. No tuition. No instructors. Just students building together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary text-sm">
                Get Started Free <ArrowRight size={15} />
              </Link>
              <Link to="/login" className="btn-secondary text-sm">
                Explore Courses
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-xs text-[#6B6B6B]">
              {['No credit card needed', 'Free to join', '500+ courses'].map(f => (
                <div key={f} className="flex items-center gap-1.5">
                  <Check size={12} className="text-[#22C55E]" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <HeroUICards />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} id="features" className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-display font-bold text-[#0A0A0A]">Why SkillSphere?</h2>
            <p className="text-xs text-[#6B6B6B] mt-2 max-w-content mx-auto">Built for students who want to learn faster, teach smarter, and grow their careers in college — not after.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-card border border-[#EAEAEA] p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-default"
              >
                <div className={`w-10 h-10 rounded-btn ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon size={18} />
                </div>
                <h3 className="text-sm font-display font-semibold text-[#0A0A0A] mb-2">{f.title}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-display font-bold text-[#0A0A0A]">How It Works</h2>
            <p className="text-xs text-[#6B6B6B] mt-2">Three simple steps to start learning, contributing, and growing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#C6FF3D] text-[#0B0B0B] font-display font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-sm font-display font-semibold text-[#0A0A0A] mb-2">{step.title}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-content mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="community" className="py-20 px-6 bg-[#0A0A0A] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-center mb-12 text-white">Community by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 2400, suffix: '+', label: 'Active Students' },
              { value: 500, suffix: '+', label: 'Courses Published' },
              { value: 12000, suffix: '+', label: 'Credits Exchanged' },
              { value: 300, suffix: '+', label: 'Tasks Completed' },
            ].map(({ value, suffix, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl font-display font-bold text-[#C6FF3D] mb-1">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-xs text-white/60">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-center text-[#0A0A0A] mb-12">What Students Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-card border border-[#EAEAEA] shadow-card hover:shadow-card-hover p-6 transition-all duration-200"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#EAEAEA]">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full" />
                  <div>
                    <p className="text-xs font-semibold text-[#0A0A0A]">{t.name}</p>
                    <p className="text-2xs text-[#6B6B6B]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0A] rounded-[32px] p-12"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Ready to start learning<br />
              <span className="text-[#C6FF3D]">for free?</span>
            </h2>
            <p className="text-xs text-white/60 mb-8 max-w-content mx-auto">Join 2,400+ students already on SkillSphere. No tuition. No paywalls. Just peers helping peers.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register" className="btn-primary text-sm">
                Get Started Free <ChevronRight size={15} />
              </Link>
              <Link to="/login" className="flex items-center gap-2 px-6 py-3 rounded-btn border border-white/20 text-sm font-semibold text-white hover:border-white/50 transition-colors duration-150 cursor-pointer">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display font-bold text-base">
            Skill<span className="text-[#C6FF3D] bg-[#0A0A0A] px-1.5 py-0.5 rounded text-sm">Sphere</span>
          </div>
          <p className="text-2xs text-[#6B6B6B]">© 2026 SkillSphere. Student-powered learning platform.</p>
          <div className="flex gap-5 text-2xs text-[#6B6B6B]">
            <a href="#" className="hover:text-[#0A0A0A] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#0A0A0A] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#0A0A0A] transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
