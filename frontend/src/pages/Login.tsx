import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

/* ── helpers ─────────────────────────────────────── */
const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

interface FieldState {
  value: string;
  touched: boolean;
  error: string;
}

const init = (): FieldState => ({ value: '', touched: false, error: '' });

/* ── component ───────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const isProfileComplete = useStore((s) => s.isProfileComplete);

  const postLoginDest = () => isProfileComplete ? '/app/courses' : '/profile-setup';

  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState<FieldState>(init());
  const [password, setPassword] = useState<FieldState>(init());

  /* ── validation ──────────────────────────────────── */
  const validateEmail = useCallback((val: string): string => {
    const v = val.trim();
    if (!v) return 'Email is required.';
    if (!isValidEmail(v)) return 'Enter a valid email address.';
    return '';
  }, []);

  const validatePassword = useCallback((val: string): string => {
    const v = val.trim();
    if (!v) return 'Password is required.';
    return '';
  }, []);

  const isFormValid =
    !validateEmail(email.value) && !validatePassword(password.value);

  /* ── change handlers ─────────────────────────────── */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail({ value: val, touched: true, error: validateEmail(val) });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword({ value: val, touched: true, error: validatePassword(val) });
  };

  /* ── submit ──────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Touch both fields to surface errors
    const emailErr = validateEmail(email.value);
    const passErr = validatePassword(password.value);
    setEmail(p => ({ ...p, touched: true, error: emailErr }));
    setPassword(p => ({ ...p, touched: true, error: passErr }));

    if (emailErr || passErr) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login();
      navigate(postLoginDest());
    }, 1200);
  };

  /* ── field border helper ─────────────────────────── */
  const fieldClass = (field: FieldState, extra = '') => {
    const base = `input-field transition-all duration-200 ${extra}`;
    if (!field.touched || !field.value.trim()) return base;
    if (field.error) return `${base} !border-red-400 !ring-red-200 !ring-2`;
    return `${base} !border-green-400 !ring-green-100 !ring-2`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C6FF3D]/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#3D5CFF]/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-display font-bold text-2xl text-[#0A0A0A]">
            Skill<span className="text-[#C6FF3D] bg-[#0A0A0A] px-1.5 py-0.5 rounded-md">Sphere</span>
          </Link>
          <h1 className="text-xl font-display font-semibold text-[#0A0A0A] mt-4">Welcome back</h1>
          <p className="text-xs text-[#6B6B6B] mt-1">Sign in to continue learning and earning</p>
        </div>

        <div className="bg-white rounded-card border border-[#EAEAEA] shadow-card p-8">
          {/* Demo shortcut */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => { login(); navigate(postLoginDest()); }}
            className="w-full flex items-center justify-center gap-2 bg-[#C6FF3D] text-[#0B0B0B] font-semibold py-3 rounded-btn hover:bg-[#B8F020] transition-all duration-150 cursor-pointer mb-3"
          >
            <span className="text-sm">⚡ Try Demo — One Click</span>
          </motion.button>
          <p className="text-center text-2xs text-[#6B6B6B] mb-5">No account needed · All data is mock</p>

          {/* Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-[#EAEAEA] rounded-btn py-3 text-sm font-medium text-[#0A0A0A] hover:bg-[#FAFAFA] hover:border-[#C6FF3D] transition-all duration-150 cursor-pointer mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center my-5">
            <div className="flex-1 border-t border-[#EAEAEA]" />
            <span className="px-3 text-2xs text-[#6B6B6B]">or sign in with email</span>
            <div className="flex-1 border-t border-[#EAEAEA]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="login-email">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  id="login-email"
                  type="email"
                  className={fieldClass(email, 'pl-10')}
                  placeholder="you@college.edu"
                  value={email.value}
                  onChange={handleEmailChange}
                  onBlur={() => setEmail(p => ({ ...p, touched: true, error: validateEmail(p.value) }))}
                  aria-invalid={email.touched && !!email.error}
                  aria-describedby="login-email-error"
                />
              </div>
              <AnimatePresence>
                {email.touched && email.error && (
                  <motion.p
                    id="login-email-error"
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-2xs text-red-500 mt-1 font-medium"
                  >
                    {email.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#0A0A0A]" htmlFor="login-password">Password</label>
                <button type="button" className="text-2xs text-[#3D5CFF] hover:underline cursor-pointer">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className={fieldClass(password, 'pl-10 pr-10')}
                  placeholder="••••••••"
                  value={password.value}
                  onChange={handlePasswordChange}
                  onBlur={() => setPassword(p => ({ ...p, touched: true, error: validatePassword(p.value) }))}
                  aria-invalid={password.touched && !!password.error}
                  aria-describedby="login-password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#0A0A0A] cursor-pointer"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {password.touched && password.error && (
                  <motion.p
                    id="login-password-error"
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-2xs text-red-500 mt-1 font-medium"
                  >
                    {password.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={isFormValid && !isLoading ? { scale: 0.97 } : {}}
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`btn-primary w-full justify-center mt-2 transition-opacity duration-200 ${
                !isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-[#6B6B6B] mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#3D5CFF] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
