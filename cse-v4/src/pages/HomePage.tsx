import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Star, Users, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';

const stats = [
  { label: 'Active Tutors', value: '200+', icon: <Users size={18} /> },
  { label: 'Skills Offered', value: '500+', icon: <BookOpen size={18} /> },
  { label: 'Sessions Done', value: '1k+', icon: <Zap size={18} /> },
  { label: 'Avg Rating', value: '4.8★', icon: <Star size={18} /> },
];

const features = [
  {
    emoji: '🔍',
    title: 'Discover Skills',
    desc: 'Browse skills taught by your peers — filter by level, rating, or topic.',
  },
  {
    emoji: '📅',
    title: 'Book Sessions',
    desc: 'Request a session with any tutor in one click. They accept or decline.',
  },
  {
    emoji: '⭐',
    title: 'Build Reputation',
    desc: 'Rate sessions, earn reviews, and build a portfolio for future jobs.',
  },
];

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs font-body text-white/70 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 bg-jade rounded-full animate-pulse" />
            Peer-to-peer learning for campus students
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Learn from your <br />
            <span className="text-amber">fellow students</span>
          </h1>
          <p className="font-body text-white/60 text-lg max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Share what you know. Learn what you don't. Build skills, reputation, and connections — all for free.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {user ? (
              <>
                <Button variant="secondary" size="lg" onClick={() => navigate('/search')}>
                  Explore Skills <ArrowRight size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="!border-white/20 !text-white hover:!bg-white/10"
                  onClick={() =>
                    navigate(user.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/learner')
                  }
                >
                  My Dashboard
                </Button>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Get Started Free <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="ghost" size="lg" className="!border-white/20 !text-white hover:!bg-white/10">
                    Browse Skills
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-ink-50 border-b border-ink-100">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 text-center">
              <div className="text-amber">{s.icon}</div>
              <p className="font-display font-bold text-ink-900 text-2xl">{s.value}</p>
              <p className="font-body text-xs text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-ink-900 text-3xl mb-3">How it works</h2>
          <p className="font-body text-ink-400 max-w-md mx-auto">
            A simple three-step loop that powers a growing learning community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-ink-50 rounded-3xl p-7 border border-ink-100 hover:border-ink-300 hover:shadow-lg transition-all duration-200 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="font-display font-bold text-ink-900 text-lg mb-2">{f.title}</h3>
              <p className="font-body text-ink-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-ink-900 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #F5A623 0%, transparent 70%)` }} />
          <h2 className="font-display font-bold text-white text-3xl mb-3 relative">
            Ready to start learning?
          </h2>
          <p className="font-body text-white/50 text-sm mb-6 relative">
            Join hundreds of students already growing together.
          </p>
          <div className="relative flex justify-center gap-3 flex-wrap">
            <Link to={user ? '/search' : '/register'}>
              <Button variant="secondary" size="lg">
                {user ? 'Explore Skills' : 'Sign Up Free'} <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/top-tutors">
              <Button variant="ghost" size="lg" className="!border-white/20 !text-white hover:!bg-white/10">
                View Top Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
