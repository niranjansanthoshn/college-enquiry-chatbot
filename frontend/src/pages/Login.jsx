import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/' ? '/dashboard' : from);
        }
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand header */}
        <div className="text-center">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-500/25 mb-4">
            <GraduationCap className="h-7 w-7" />
          </Link>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome to Apex Portal
          </h1>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Sign in to track your enquiry sessions, save chat history, and manage applications.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Card */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-4 text-xs dark:border-brand-900/60 dark:bg-brand-950/30">
          <div className="flex items-center gap-1.5 font-bold text-brand-900 dark:text-brand-300 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Quick Demo Credentials:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              id="student-demo-btn"
              type="button"
              onClick={() => handleFillDemo('student@apex.edu', 'Student@12345')}
              className="flex-1 rounded-lg bg-white px-3 py-1.5 text-left font-medium text-slate-700 shadow-sm border border-brand-200 hover:bg-brand-100/50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              🎓 <strong>Student:</strong> student@apex.edu
            </button>
            <button
              id="admin-demo-btn"
              type="button"
              onClick={() => handleFillDemo('admin@apex.edu', 'Admin@12345')}
              className="flex-1 rounded-lg bg-white px-3 py-1.5 text-left font-medium text-slate-700 shadow-sm border border-brand-200 hover:bg-brand-100/50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              🛡️ <strong>Admin:</strong> admin@apex.edu
            </button>
          </div>
        </div>

        {/* Form container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          
          {error && (
            <div id="login-error-alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@apex.edu"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In to Portal'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
