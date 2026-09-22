import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen } from 'lucide-react';
import { authApi } from '../api/services';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation();

  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  // const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === "tutor") {
        navigate("/dashboard/tutor");
      } else {
        navigate("/dashboard/learner");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });

      // ✅ ONLY SET AUTH HERE
      setAuth(res.data.token, res.data.user);
      
      console.log("LOGIN RESPONSE:", res.data);


    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // if (user) return null;

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-jade/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-ink-900 rounded-2xl mb-4">
            <BookOpen size={22} className="text-white" />
          </div>

          <h1 className="font-display font-bold text-ink-900 text-3xl">
            Welcome back
          </h1>

          <p className="text-ink-400 font-body text-sm mt-2">
            Log in to your SkillX account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-ink-100 shadow-xl p-8">

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Input
              label="Email"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={15} />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={15} />}
              required
            />

            {/* Error Message */}
            {error && (
              <div className="bg-coral-light text-coral-dark text-sm font-body px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>

          </form>

          {/* Footer */}
          <p className="text-center text-sm text-ink-400 font-body mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-ink-900 font-semibold hover:text-amber transition-colors"
            >
              Sign up free
            </Link>
          </p>

        </div>

        {/* Demo Hint */}
        <div className="mt-4 bg-amber-light border border-amber/20 rounded-2xl p-4 text-center">
          <p className="text-xs text-amber-dark font-body">
            🎓 Campus-only peer learning. 100% free, no payments involved.
          </p>
        </div>

      </div>
    </div>
  );
};