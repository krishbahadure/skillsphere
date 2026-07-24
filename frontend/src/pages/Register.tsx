import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    navigate('/profile-setup');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C6FF3D]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#3D5CFF]/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-display font-bold text-2xl text-[#0A0A0A]">
            Skill<span className="text-[#C6FF3D] bg-[#0A0A0A] px-1.5 py-0.5 rounded-md">Sphere</span>
          </Link>
          <h1 className="text-xl font-display font-semibold text-[#0A0A0A] mt-4">Create your account</h1>
          <p className="text-xs text-[#6B6B6B] mt-1">Join thousands of students learning and earning</p>
        </div>

        <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input id="reg-name" required type="text" className="input-field pl-10" placeholder="Alex Chen" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-email">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input id="reg-email" required type="email" className="input-field pl-10" placeholder="you@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input id="reg-password" required type={showPass ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#0A0A0A] cursor-pointer" aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-confirm">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input id="reg-confirm" required type={showPass ? 'text' : 'password'} className="input-field pl-10" placeholder="••••••••" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} />
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary w-full justify-center mt-2">
              Create Account
            </motion.button>
          </form>

          <p className="text-center text-xs text-[#6B6B6B] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#3D5CFF] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
