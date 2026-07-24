import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, Coins, User, Settings, ChevronLeft
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const NAV = [
  { to: '/app/courses', icon: BookOpen, label: 'Courses' },
  { to: '/app/contributions', icon: Users, label: 'Contributions' },
  { to: '/app/credits', icon: Coins, label: 'Credits' },
  { to: '/app/profile', icon: User, label: 'Profile' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, creditBalance } = useStore();

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 bottom-0 z-30 bg-white border-r border-[#EAEAEA] flex flex-col overflow-hidden"
        aria-label="Main navigation"
      >
        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`
              }
              aria-label={label}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap text-sm"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Credit balance */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-3 mb-4 p-3 bg-[#C6FF3D]/10 rounded-card border border-[#C6FF3D]/30"
            >
              <p className="text-2xs text-[#6B6B6B] font-medium mb-1">Credit Balance</p>
              <p className="text-base font-display font-bold text-[#0A0A0A]">
                {creditBalance} <span className="text-2xs font-normal text-[#6B6B6B]">credits</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <div className="border-t border-[#EAEAEA] p-2">
          <button
            onClick={toggleSidebar}
            className="sidebar-item w-full justify-center"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.2 }}>
              <ChevronLeft size={18} />
            </motion.div>
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
