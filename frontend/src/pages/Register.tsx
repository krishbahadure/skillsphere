import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

/* ── helpers ─────────────────────────────────────── */
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Each word: one uppercase then only lowercase letters. At least 3 chars total. */
const isValidFullName = (v: string) =>
  v.trim().length >= 3 &&
  /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(v.trim());

interface FieldState {
  value: string;
  touched: boolean;
  error: string;
}
const init = (): FieldState => ({ value: '', touched: false, error: '' });

/* ── password strength ──────────────────────────── */
type Strength = 'weak' | 'medium' | 'strong';

function calcStrength(pass: string): Strength {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 2) return 'weak';
  if (score === 3 || score === 4) return 'medium';
  return 'strong';
}

const strengthMeta: Record<Strength, { label: string; color: string; width: string }> = {
  weak:   { label: 'Weak',   color: 'bg-red-400',    width: 'w-1/3' },
  medium: { label: 'Medium', color: 'bg-yellow-400', width: 'w-2/3' },
  strong: { label: 'Strong', color: 'bg-green-400',  width: 'w-full' },
};

/* ── component ───────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);

  const [showPass, setShowPass]        = useState(false);
  const [showConfirm, setShowConfirm]  = useState(false);
  const [isLoading, setIsLoading]      = useState(false);
  const [isSuccess, setIsSuccess]      = useState(false);

  const [name,     setName]     = useState<FieldState>(init());
  const [email,    setEmail]    = useState<FieldState>(init());
  const [password, setPassword] = useState<FieldState>(init());
  const [confirm,  setConfirm]  = useState<FieldState>(init());

  /* ── validators ──────────────────────────────────── */
  const validateName = useCallback((val: string): string => {
    const v = val.trim();
    if (!v) return 'Full name is required.';
    if (v.length < 3) return 'Name must be at least 3 characters.';
    if (/[^A-Za-z\s]/.test(v)) return 'Only alphabets and spaces are allowed.';
    if (!isValidFullName(v))
      return 'Each word must start with an uppercase letter followed by lowercase letters (e.g. John David).';
    return '';
  }, []);

  const validateEmail = useCallback((val: string): string => {
    const v = val.trim();
    if (!v) return 'Email is required.';
    if (!isValidEmail(v)) return 'Enter a valid email address.';
    return '';
  }, []);

  const validatePassword = useCallback((val: string): string => {
    const v = val;
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(v)) return 'Must include at least one uppercase letter.';
    if (!/[a-z]/.test(v)) return 'Must include at least one lowercase letter.';
    if (!/[0-9]/.test(v)) return 'Must include at least one number.';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Must include at least one special character.';
    return '';
  }, []);

  const validateConfirm = useCallback(
    (val: string, passVal: string): string => {
      if (!val) return 'Please confirm your password.';
      if (val !== passVal) return 'Passwords do not match.';
      return '';
    },
    []
  );

  /* ── derived ─────────────────────────────────────── */
  const strength = password.value ? calcStrength(password.value) : null;

  const isFormValid =
    !validateName(name.value) &&
    !validateEmail(email.value) &&
    !validatePassword(password.value) &&
    !validateConfirm(confirm.value, password.value);

  /* ── change handlers ─────────────────────────────── */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName({ value: val, touched: true, error: validateName(val) });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail({ value: val, touched: true, error: validateEmail(val) });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword({ value: val, touched: true, error: validatePassword(val) });
    // Re-validate confirm in real time when password changes
    if (confirm.touched) {
      setConfirm(p => ({ ...p, error: validateConfirm(p.value, val) }));
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirm({ value: val, touched: true, error: validateConfirm(val, password.value) });
  };

  /* ── submit ──────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields
    const nameErr    = validateName(name.value);
    const emailErr   = validateEmail(email.value);
    const passErr    = validatePassword(password.value);
    const confirmErr = validateConfirm(confirm.value, password.value);

    setName(p     => ({ ...p, touched: true, error: nameErr }));
    setEmail(p    => ({ ...p, touched: true, error: emailErr }));
    setPassword(p => ({ ...p, touched: true, error: passErr }));
    setConfirm(p  => ({ ...p, touched: true, error: confirmErr }));

    if (nameErr || emailErr || passErr || confirmErr) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login();
      setIsSuccess(true);
      setTimeout(() => navigate('/profile-setup'), 2000);
    }, 1400);
  };

  /* ── border helper ───────────────────────────────── */
  const fieldClass = (field: FieldState, extra = '') => {
    const base = `input-field transition-all duration-200 ${extra}`;
    if (!field.touched || !field.value.trim()) return base;
    if (field.error) return `${base} !border-red-400 !ring-red-200 !ring-2`;
    return `${base} !border-green-400 !ring-green-100 !ring-2`;
  };

  /* ── success overlay ─────────────────────────────── */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C6FF3D]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#3D5CFF]/15 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 flex flex-col items-center gap-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          >
            <CheckCircle2 size={64} className="text-green-500" />
          </motion.div>
          <h2 className="text-xl font-display font-semibold text-[#0A0A0A]">Account created!</h2>
          <p className="text-xs text-[#6B6B6B]">Redirecting you to login…</p>
        </motion.div>
      </div>
    );
  }

  /* ── render ──────────────────────────────────────── */
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
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  id="reg-name"
                  type="text"
                  className={fieldClass(name, 'pl-10')}
                  placeholder="Alex Chen"
                  value={name.value}
                  onChange={handleNameChange}
                  onBlur={() => setName(p => ({ ...p, touched: true, error: validateName(p.value) }))}
                  aria-invalid={name.touched && !!name.error}
                  aria-describedby="reg-name-error"
                />
              </div>
              <AnimatePresence>
                {name.touched && name.error && (
                  <motion.p
                    id="reg-name-error"
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-2xs text-red-500 mt-1 font-medium"
                  >
                    {name.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-email">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  id="reg-email"
                  type="email"
                  className={fieldClass(email, 'pl-10')}
                  placeholder="you@college.edu"
                  value={email.value}
                  onChange={handleEmailChange}
                  onBlur={() => setEmail(p => ({ ...p, touched: true, error: validateEmail(p.value) }))}
                  aria-invalid={email.touched && !!email.error}
                  aria-describedby="reg-email-error"
                />
              </div>
              <AnimatePresence>
                {email.touched && email.error && (
                  <motion.p
                    id="reg-email-error"
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
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  className={fieldClass(password, 'pl-10 pr-10')}
                  placeholder="Min. 8 characters"
                  value={password.value}
                  onChange={handlePasswordChange}
                  onBlur={() => setPassword(p => ({ ...p, touched: true, error: validatePassword(p.value) }))}
                  aria-invalid={password.touched && !!password.error}
                  aria-describedby="reg-password-error"
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

              {/* Strength indicator */}
              <AnimatePresence>
                {password.value && strength && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="mt-2"
                  >
                    <div className="h-1.5 w-full bg-[#EAEAEA] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${strengthMeta[strength].color}`}
                        initial={{ width: 0 }}
                        animate={{ width: strengthMeta[strength].width.replace('w-', '').replace('1/3', '33%').replace('2/3', '66%').replace('full', '100%') }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        style={{
                          width:
                            strength === 'weak' ? '33%' :
                            strength === 'medium' ? '66%' : '100%',
                        }}
                      />
                    </div>
                    <p className={`text-2xs mt-1 font-medium ${
                      strength === 'weak' ? 'text-red-400' :
                      strength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {strengthMeta[strength].label} password
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {password.touched && password.error && (
                  <motion.p
                    id="reg-password-error"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5" htmlFor="reg-confirm">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className={fieldClass(confirm, 'pl-10 pr-10')}
                  placeholder="••••••••"
                  value={confirm.value}
                  onChange={handleConfirmChange}
                  onBlur={() =>
                    setConfirm(p => ({
                      ...p,
                      touched: true,
                      error: validateConfirm(p.value, password.value),
                    }))
                  }
                  aria-invalid={confirm.touched && !!confirm.error}
                  aria-describedby="reg-confirm-error"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#0A0A0A] cursor-pointer"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {confirm.touched && confirm.error && (
                  <motion.p
                    id="reg-confirm-error"
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-2xs text-red-500 mt-1 font-medium"
                  >
                    {confirm.error}
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
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
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
