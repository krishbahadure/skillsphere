import { Outlet } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Sidebar } from '../../components/layout/Sidebar';
import { FAB } from '../../components/layout/FAB';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Topbar />
      <Sidebar />
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 220 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </motion.main>
      <FAB />
    </div>
  );
}
