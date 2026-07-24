import { motion } from 'framer-motion';
import { BookOpen, Users, Coins, Award, MapPin, GraduationCap } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ProfilePage() {
  const { user, courses, contributions } = useStore();

  const myCourses = courses.filter(c => c.instructor.name === user.name);

  return (
    <div>
      {/* Cover + Avatar */}
      <div className="relative mb-16">
        <div className="w-full h-48 rounded-card overflow-hidden bg-gradient-to-r from-[#C6FF3D]/30 to-[#3D5CFF]/20">
          <img
            src={user.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-card object-cover"
          />
          <div className="mb-3">
            <h1 className="text-lg font-display font-bold text-[#0A0A0A]">{user.name}</h1>
            <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
              <GraduationCap size={13} />
              <span>{user.college}</span>
              <span>·</span>
              <span>{user.department}</span>
              <span>·</span>
              <span>{user.year}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className="badge bg-[#C6FF3D] text-[#0B0B0B] font-bold">
            <Award size={12} /> {user.rank}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bio + Skills */}
        <div className="lg:col-span-1 space-y-5">
          {/* Bio */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A] mb-3">About</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-content">{user.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A] mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span key={skill} className="badge bg-[#3D5CFF]/10 text-[#3D5CFF] text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A] mb-4">Stats</h2>
            <div className="space-y-3">
              {[
                { label: 'Courses Created', value: user.coursesCreated, icon: BookOpen, color: 'text-[#3D5CFF]' },
                { label: 'Contributions Posted', value: user.contributionsPosted, icon: Users, color: 'text-[#22C55E]' },
                { label: 'Credits Earned', value: user.creditsEarned, icon: Coins, color: 'text-[#0A0A0A]' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                    <Icon size={14} className={color} />
                    {label}
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Achievements + Courses */}
        <div className="lg:col-span-2 space-y-5">
          {/* Achievements */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A] mb-4">Achievements</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {user.achievements.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col items-center gap-2 p-3 bg-[#FAFAFA] rounded-card border border-[#EAEAEA] hover:border-[#C6FF3D] transition-colors duration-150"
                  title={a.title}
                >
                  <span className="text-2xl" role="img" aria-label={a.title}>{a.icon}</span>
                  <span className="text-2xs text-[#6B6B6B] text-center leading-tight">{a.title}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certificates / Courses created */}
          <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A] mb-4">My Courses</h2>
            {myCourses.length === 0 ? (
              <p className="text-xs text-[#6B6B6B]">No courses published yet. Use the + button to publish one!</p>
            ) : (
              <div className="space-y-3">
                {myCourses.slice(0, 4).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-btn border border-[#EAEAEA] hover:border-[#C6FF3D] transition-colors duration-150 cursor-pointer">
                    <img src={c.thumbnailUrl} alt={c.title} className="w-12 h-9 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0A0A0A] truncate">{c.title}</p>
                      <p className="text-2xs text-[#6B6B6B]">{c.category} · {c.studentsCount} students</p>
                    </div>
                    <span className="badge bg-[#C6FF3D] text-[#0B0B0B] text-xs shrink-0">{c.creditCost} cr</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
