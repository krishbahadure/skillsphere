import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, GraduationCap, Link as LinkIcon, Github, Linkedin,
  Users, BookOpen, Coins, Award, CheckCircle, Edit2,
  Flame, Shield, Star, ExternalLink, Briefcase
} from 'lucide-react';
import { useStore } from '../../store/useStore';

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-display font-bold text-[#0A0A0A] mb-3">{title}</h2>
  );
}

function StatBadge({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-card border border-[#EAEAEA] p-4 flex flex-col items-center gap-1.5 hover:border-[#C6FF3D] hover:shadow-card transition-all duration-150">
      <Icon size={18} className={color} />
      <span className="text-lg font-display font-bold text-[#0A0A0A]">{value}</span>
      <span className="text-[11px] text-[#6B6B6B] text-center">{label}</span>
    </div>
  );
}

function ActivityItem({ item, index }: { item: { icon: string; title: string; description: string; date: string }; index: number }) {
  const d = new Date(item.date);
  const relTime = (() => {
    const diff = Date.now() - d.getTime();
    if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
    return `${Math.round(diff / 86400000)}d ago`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3 py-3 border-b border-[#EAEAEA] last:border-0"
    >
      <div className="w-8 h-8 rounded-xl bg-[#FAFAFA] border border-[#EAEAEA] flex items-center justify-center text-base shrink-0">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#0A0A0A]">{item.title}</p>
        <p className="text-[11px] text-[#6B6B6B] truncate">{item.description}</p>
      </div>
      <span className="text-[10px] text-[#6B6B6B] shrink-0">{relTime}</span>
    </motion.div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, courses, creditBalance } = useStore();
  const myCourses = courses.filter(c => c.instructor.name === user.name);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover + Avatar */}
      <div className="relative mb-16 rounded-[24px] overflow-visible">
        <div className="w-full h-48 rounded-[24px] overflow-hidden">
          <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
        {/* Avatar overlay */}
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-card-hover object-cover"
            />
            {user.isVerifiedCreator && (
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#3D5CFF] rounded-full p-1 border-2 border-white" title="Verified Creator">
                <Shield size={12} className="text-white" />
              </div>
            )}
          </motion.div>
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold text-[#0A0A0A]">{user.name}</h1>
              {user.isVerifiedCreator && <CheckCircle size={16} className="text-[#3D5CFF]" />}
            </div>
            <p className="text-xs text-[#6B6B6B]">{user.username}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-0 right-0 flex gap-2 mb-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app/profile/edit')}
            className="flex items-center gap-2 px-4 py-2 rounded-btn bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-[#222] transition-colors duration-150 cursor-pointer"
          >
            <Edit2 size={13} /> Edit Profile
          </motion.button>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="px-3 py-1 rounded-full bg-[#C6FF3D] text-[#0B0B0B] text-xs font-bold">{user.rank}</span>
        <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-white text-xs font-semibold">Lv.{user.level} {user.levelTitle}</span>
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
          <Flame size={12} /> {user.learningStreakDays}-Day Streak
        </span>
        {user.isVerifiedCreator && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#3D5CFF]/10 text-[#3D5CFF] text-xs font-semibold">
            <Shield size={12} /> Verified Creator
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Bio */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="About" />
            <p className="text-xs text-[#6B6B6B] leading-relaxed">{user.bio}</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                <GraduationCap size={13} /> {user.college} · {user.department} · {user.year}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                <MapPin size={13} /> {user.city ? `${user.city}, ${user.country}` : user.location}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                <Users size={13} /> {user.followers} followers · {user.following} following
              </div>
              {user.role && (
                <div className="flex items-center gap-2 text-xs">
                  {user.role === 'Company & Freelancer' ? <Briefcase size={13} className="text-[#6B6B6B]" /> : <GraduationCap size={13} className="text-[#6B6B6B]" />}
                  <span className="px-2 py-0.5 rounded-full bg-[#C6FF3D]/30 text-[#0A0A0A] font-semibold text-xs">{user.role}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="Links" />
            <div className="space-y-2">
              {user.github && (
                <a href={`https://${user.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-150">
                  <Github size={13} /> {user.github}
                </a>
              )}
              {user.linkedin && (
                <a href={`https://${user.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#3D5CFF] transition-colors duration-150">
                  <Linkedin size={13} /> {user.linkedin}
                </a>
              )}
              {user.portfolio && (
                <a href={`https://${user.portfolio}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-150">
                  <LinkIcon size={13} /> {user.portfolio}
                </a>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="Skills" />
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-[#3D5CFF]/10 text-[#3D5CFF] text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="Interests" />
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map(i => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-[#FAFAFA] border border-[#EAEAEA] text-[#6B6B6B] text-xs">{i}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <StatBadge label="Published" value={user.coursesCreated} icon={BookOpen} color="text-[#3D5CFF]" />
            <StatBadge label="Enrolled" value={user.coursesEnrolled} icon={GraduationCap} color="text-[#22C55E]" />
            <StatBadge label="Credits" value={creditBalance} icon={Coins} color="text-[#0A0A0A]" />
            <StatBadge label="Tasks Done" value={user.tasksCompleted} icon={Award} color="text-orange-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatBadge label="Contributions" value={user.contributionsPosted} icon={Users} color="text-purple-500" />
            <StatBadge label="Followers" value={user.followers} icon={Star} color="text-yellow-500" />
            <StatBadge label="Certificates" value={user.certificates.length} icon={CheckCircle} color="text-[#22C55E]" />
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="Achievements" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {user.achievements.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  title={a.description}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] hover:border-[#C6FF3D] hover:-translate-y-0.5 transition-all duration-150 cursor-default"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-[9px] text-[#6B6B6B] text-center leading-tight">{a.title}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="Certificates" />
            <div className="space-y-2">
              {user.certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#EAEAEA] hover:border-[#C6FF3D] transition-colors duration-150"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#C6FF3D]/20 flex items-center justify-center shrink-0">
                    <Award size={16} className="text-[#0A0A0A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0A0A0A]">{cert.title}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{cert.issuer} · {new Date(cert.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} className="text-[#3D5CFF] hover:text-[#2a3dcc] transition-colors duration-150" aria-label="View credential">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* My Courses */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="My Courses" />
            {myCourses.length === 0 ? (
              <p className="text-xs text-[#6B6B6B]">No courses published yet.</p>
            ) : (
              <div className="space-y-2">
                {myCourses.slice(0, 4).map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#EAEAEA] hover:border-[#C6FF3D] transition-colors duration-150">
                    <img src={c.thumbnailUrl} alt={c.title} className="w-14 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0A0A0A] truncate">{c.title}</p>
                      <p className="text-[11px] text-[#6B6B6B]">{c.category} · {c.studentsCount.toLocaleString()} students</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#C6FF3D] text-[#0B0B0B] text-xs font-bold shrink-0">{c.creditCost}cr</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <SectionTitle title="Recent Activity" />
            <div>
              {user.recentActivity.map((item, i) => (
                <ActivityItem key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
