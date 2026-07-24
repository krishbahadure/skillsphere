import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, Coins } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCourses, CATEGORIES } from '../../data/mockData';
import ProfileDropdown from '../ui/ProfileDropdown';

const POPULAR = ['React Hooks', 'Figma UI', 'Python Basics', 'Data Science'];
const RECENT = ['TypeScript', 'Machine Learning', 'Motion Design'];

export function Topbar() {
  const { user, creditBalance, toggleSidebar, searchQuery, setSearchQuery } = useStore();
  const [focused, setFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLDivElement>(null);

  const unreadCount = user.notifications.filter(n => !n.read).length;

  const filteredCourses = searchQuery.length > 1
    ? mockCourses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] h-16">
      <div className="flex items-center h-full px-4 gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-btn hover:bg-[#FAFAFA] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-150 cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <a href="/app/courses" className="font-display font-bold text-base text-[#0A0A0A] shrink-0">
          Skill<span className="text-[#C6FF3D] bg-[#0A0A0A] px-1 rounded">Sphere</span>
        </a>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto relative" ref={dropdownRef}>
          <div className={`flex items-center gap-2 bg-[#FAFAFA] border rounded-btn px-4 py-2.5 transition-all duration-150 ${focused ? 'border-[#3D5CFF] ring-2 ring-[#3D5CFF]/20' : 'border-[#EAEAEA]'}`}>
            <Search size={16} className="text-[#6B6B6B] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search courses, topics, skills..."
              className="flex-1 bg-transparent text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B] outline-none"
              aria-label="Search courses"
              id="topbar-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#6B6B6B] hover:text-[#0A0A0A] cursor-pointer"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Search dropdown */}
          <AnimatePresence>
            {focused && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 right-0 bg-white rounded-card border border-[#EAEAEA] shadow-card-hover z-50 overflow-hidden"
              >
                {filteredCourses.length > 0 && (
                  <div className="p-3">
                    <p className="text-2xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Matching Courses</p>
                    {filteredCourses.map(c => (
                      <div key={c.id} className="flex items-center gap-3 px-2 py-2 rounded-btn hover:bg-[#FAFAFA] cursor-pointer transition-colors duration-100">
                        <img src={c.thumbnailUrl} alt={c.title} className="w-8 h-8 rounded object-cover" />
                        <div>
                          <p className="text-xs font-medium text-[#0A0A0A]">{c.title}</p>
                          <p className="text-2xs text-[#6B6B6B]">{c.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-3 border-t border-[#EAEAEA]">
                  <p className="text-2xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map(q => (
                      <button key={q} onClick={() => setSearchQuery(q)} className="badge bg-[#FAFAFA] text-[#6B6B6B] border border-[#EAEAEA] hover:border-[#3D5CFF] hover:text-[#3D5CFF] transition-colors duration-100 cursor-pointer text-xs">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 border-t border-[#EAEAEA]">
                  <p className="text-2xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {RECENT.map(q => (
                      <button key={q} onClick={() => setSearchQuery(q)} className="badge bg-[#FAFAFA] text-[#6B6B6B] border border-[#EAEAEA] hover:border-[#3D5CFF] hover:text-[#3D5CFF] transition-colors duration-100 cursor-pointer text-xs">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 border-t border-[#EAEAEA]">
                  <p className="text-2xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Suggested Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <button key={cat} onClick={() => setSearchQuery(cat)} className="badge bg-[#3D5CFF]/10 text-[#3D5CFF] hover:bg-[#3D5CFF] hover:text-white transition-colors duration-100 cursor-pointer text-xs">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Bell */}
          <button className="p-2 rounded-btn hover:bg-[#FAFAFA] text-[#6B6B6B] hover:text-[#0A0A0A] relative transition-colors duration-150 cursor-pointer" aria-label="Notifications">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
            )}
          </button>

          {/* Credit Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-[#C6FF3D]/15 border border-[#C6FF3D]/40 hover:bg-[#C6FF3D]/25 transition-colors duration-150 cursor-default">
            <Coins size={13} className="text-[#0A0A0A]" />
            <span className="text-xs font-bold text-[#0A0A0A]">{creditBalance}</span>
            <span className="text-[10px] text-[#6B6B6B]">Credits</span>
          </div>

          {/* Profile button + dropdown */}
          <div className="relative" ref={profileBtnRef}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-[#FAFAFA] transition-colors duration-150 cursor-pointer"
              aria-label="User menu"
              aria-expanded={profileOpen}
            >
              <div className="relative">
                <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-[#C6FF3D]/50" />
                {user.isVerifiedCreator && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3D5CFF] rounded-full border border-white" />
                )}
              </div>
              <span className="text-xs font-medium text-[#0A0A0A] hidden sm:block">{user.name.split(' ')[0]}</span>
              <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-[#6B6B6B] hidden sm:block" />
              </motion.div>
            </motion.button>

            <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
