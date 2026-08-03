import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, LogOut, ChevronRight, BookOpen, Users,
  Coins, Award, Flame, Bell, CheckCircle, Star, ExternalLink,
  GraduationCap, MapPin, Calendar, Shield, Briefcase
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center py-2 px-1">
      <span className="text-sm font-bold text-[#0A0A0A]">{value}</span>
      <span className="text-[10px] text-[#6B6B6B] mt-0.5 text-center leading-tight">{label}</span>
    </div>
  );
}

function MiniCard({ icon, title, sub, accent = false }: { icon: React.ReactNode; title: string; sub: string; accent?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${accent ? 'border-[#C6FF3D]/40 bg-[#C6FF3D]/05' : 'border-[#EAEAEA] bg-[#FAFAFA]'} hover:border-[#C6FF3D] transition-colors duration-150 cursor-default`}>
      <div className="shrink-0 text-base">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-[#0A0A0A] truncate">{title}</p>
        <p className="text-[10px] text-[#6B6B6B] truncate">{sub}</p>
      </div>
    </div>
  );
}

export default function ProfileDropdown({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { user, creditBalance, logout } = useStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = user.notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const levelPct = ((user.level % 10) / 10) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.92, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -8 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="absolute top-full right-0 mt-2 w-[340px] z-50 origin-top-right"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#EAEAEA] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.18)] overflow-hidden">

            {/* ── Header: cover + avatar ── */}
            <div className="relative h-16 bg-gradient-to-r from-[#C6FF3D]/40 to-[#3D5CFF]/20 overflow-hidden">
              <img src={user.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            </div>
            <div className="px-4 pb-0 -mt-7 flex items-end justify-between">
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-xl border-2 border-white shadow-md object-cover"
                />
                {user.isVerifiedCreator && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#3D5CFF] rounded-full flex items-center justify-center border-2 border-white" title="Verified Creator">
                    <Shield size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="mb-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C6FF3D] text-[#0B0B0B]">Lv.{user.level}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0A0A0A] text-white">{user.rank}</span>
              </div>
            </div>

            {/* ── Identity ── */}
            <div className="px-4 pt-2 pb-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#0A0A0A]">{user.name}</h3>
                {user.isVerifiedCreator && (
                  <CheckCircle size={13} className="text-[#3D5CFF] shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-[#6B6B6B]">{user.username}</p>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 line-clamp-2 leading-relaxed">{user.bio}</p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-[#6B6B6B]">
                  <GraduationCap size={10} /> {user.college}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#6B6B6B]">
                  <MapPin size={10} /> {user.city ? `${user.city}, ${user.country}` : user.location}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#6B6B6B]">
                  <Calendar size={10} /> Since {new Date(user.memberSince).getFullYear()}
                </span>
                {user.role && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#C6FF3D]/30 text-[#0A0A0A]">
                    {user.role === 'Company & Freelancer' ? <Briefcase size={9} /> : <GraduationCap size={9} />}
                    {user.role}
                  </span>
                )}
              </div>

              {/* Level progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-[#6B6B6B]">{user.levelTitle}</span>
                  <span className="text-[10px] text-[#6B6B6B]">Lv.{user.level} → {user.level + 1}</span>
                </div>
                <div className="h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#C6FF3D] to-[#3D5CFF] rounded-full"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mt-2">
                {user.skills.slice(0, 4).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#3D5CFF]/10 text-[#3D5CFF]">{s}</span>
                ))}
                {user.skills.length > 4 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#EAEAEA] text-[#6B6B6B]">+{user.skills.length - 4}</span>
                )}
              </div>

              {/* Achievements row */}
              <div className="flex items-center gap-1.5 mt-2">
                {user.achievements.slice(0, 6).map(a => (
                  <span key={a.title} title={a.title} className="text-base cursor-default" role="img" aria-label={a.title}>
                    {a.icon}
                  </span>
                ))}
                {user.isVerifiedCreator && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-[#3D5CFF] font-semibold">
                    <Shield size={10} /> Verified Creator
                  </span>
                )}
              </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="mx-3 mb-3 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] grid grid-cols-4 divide-x divide-[#EAEAEA]">
              <StatCard label="Courses" value={user.coursesCreated} />
              <StatCard label="Enrolled" value={user.coursesEnrolled} />
              <StatCard label="Tasks" value={user.tasksCompleted} />
              <StatCard label="Followers" value={user.followers} />
            </div>

            {/* ── Mini Cards ── */}
            <div className="px-3 mb-3 space-y-1.5">
              {/* Notifications */}
              <div className="flex items-center gap-1.5 px-1 mb-1.5">
                <Bell size={11} className="text-[#6B6B6B]" />
                <span className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wide">Recent</span>
                {unreadCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white">{unreadCount}</span>
                )}
              </div>
              {user.notifications.slice(0, 2).map(n => (
                <MiniCard
                  key={n.id}
                  icon={<span>{n.type === 'credit' ? '💰' : n.type === 'enrollment' ? '📚' : n.type === 'follow' ? '👤' : n.type === 'badge' ? '🏆' : '🤝'}</span>}
                  title={n.message.length > 42 ? n.message.slice(0, 42) + '…' : n.message}
                  sub={n.time}
                  accent={!n.read}
                />
              ))}

              {/* Streak */}
              <MiniCard
                icon={<Flame size={14} className="text-orange-500" />}
                title={`🔥 ${user.learningStreakDays}-Day Streak`}
                sub="Keep it going! You're on fire."
                accent
              />

              {/* Credits */}
              <MiniCard
                icon={<Coins size={14} className="text-[#0A0A0A]" />}
                title={`${creditBalance} Credits Available`}
                sub={`${user.creditsEarned} earned total`}
              />
            </div>

            {/* ── Footer Actions ── */}
            <div className="border-t border-[#EAEAEA] p-2 grid grid-cols-2 gap-1.5">
              <Link
                to="/app/profile"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#0A0A0A] hover:bg-[#C6FF3D]/20 transition-colors duration-150"
              >
                <User size={13} /> View Profile
              </Link>
              <Link
                to="/app/profile/edit"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors duration-150"
              >
                <Settings size={13} /> Edit Profile
              </Link>
              <Link
                to="/app/settings"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors duration-150"
              >
                <Award size={13} /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>

            {/* Full profile link */}
            <div className="px-3 pb-3">
              <Link
                to="/app/profile"
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#0A0A0A] text-white text-[11px] font-semibold hover:bg-[#222] transition-colors duration-150"
              >
                View Full Profile <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
