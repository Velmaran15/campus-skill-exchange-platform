import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, BookOpen } from 'lucide-react';
import { authApi } from '../api/services';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(form);
      setAuth(res.data.token, res.data.user);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      {/* Decorative bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-jade/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-ink-900 rounded-2xl mb-4">
            <BookOpen size={22} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-ink-900 text-3xl">Join SkillX</h1>
          <p className="text-ink-400 font-body text-sm mt-2">Start sharing or learning skills today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-ink-100 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              icon={<User size={15} />}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              icon={<Mail size={15} />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              icon={<Lock size={15} />}
              required
            />

            {/* Role selector */}
            <div>
              <label className="text-sm font-medium text-ink-700 font-body block mb-2">I want to…</label>
              <div className="grid grid-cols-2 gap-3">
                {(['learner', 'tutor'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => set('role', r)}
                    className={[
                      'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer',
                      form.role === r
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-100 bg-ink-50 text-ink-500 hover:border-ink-300',
                    ].join(' ')}
                  >
                    <span className="text-xl">{r === 'learner' ? '🎓' : '🧑‍🏫'}</span>
                    <span className="text-sm font-display font-semibold capitalize">{r}</span>
                    <span className="text-[10px] font-body opacity-70">
                      {r === 'learner' ? 'Discover & request sessions' : 'Teach your expertise'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-coral-light text-coral-dark text-sm font-body px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-ink-400 font-body mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ink-900 font-semibold hover:text-amber transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
