import { useStore } from '../../store/useStore';
import { User, Bell, Shield, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useStore();

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-display font-bold text-[#0A0A0A] mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Profile section */}
        <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
          <div className="flex items-center gap-3 mb-4">
            <User size={16} className="text-[#3D5CFF]" />
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A]">Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5" htmlFor="settings-name">Full Name</label>
              <input id="settings-name" className="input-field" defaultValue={user.name} readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5" htmlFor="settings-bio">Bio</label>
              <textarea id="settings-bio" rows={3} className="input-field resize-none" defaultValue={user.bio} readOnly />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={16} className="text-[#3D5CFF]" />
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A]">Notifications</h2>
          </div>
          <div className="space-y-3">
            {['Course updates', 'Contribution deadlines', 'Credit changes', 'New messages'].map(item => (
              <div key={item} className="flex items-center justify-between py-1">
                <span className="text-xs text-[#6B6B6B]">{item}</span>
                <div className="w-10 h-5 bg-[#C6FF3D] rounded-pill relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-card border border-[#EAEAEA] p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={16} className="text-[#3D5CFF]" />
            <h2 className="text-sm font-display font-semibold text-[#0A0A0A]">Privacy</h2>
          </div>
          <p className="text-xs text-[#6B6B6B]">Your profile is currently <strong>public</strong>. All courses and contributions are visible to other students.</p>
        </div>
      </div>
    </div>
  );
}
