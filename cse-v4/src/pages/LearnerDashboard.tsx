import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sessionsApi } from '../api/services';
import type { Session } from '../types';
import { useAuthStore } from '../store/authStore';
import { SessionCard } from '../components/session/SessionCard';
import { RatingModal } from '../components/rating/RatingModal';
import { Button } from '../components/common/Button';
import { Spinner, Empty, Toast } from '../components/common';

type Tab = 'pending' | 'accepted' | 'completed' | 'rejected';

export const LearnerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [ratingSession, setRatingSession] = useState<Session | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await sessionsApi.getLearnerSessions();
      setSessions(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs: Tab[] = ['pending', 'accepted', 'completed', 'rejected'];
  const filtered = sessions.filter((s) => s.status === activeTab);
  const tabCount = (tab: Tab) => sessions.filter((s) => s.status === tab).length;

  const requestedCount = sessions.length;

  const activeCount =
    sessions.filter(
      s => s.status === "accepted"
    ).length;

  const completedCount =
    sessions.filter(
      s => s.status === "completed"
    ).length;

  const ratingsGiven =
    sessions.filter(
      s => s.rating
    ).length;

  // Highlight unrated completed sessions
  const unratedCompleted = sessions.filter(
    (s) => s.status === 'completed' && !s.rating
  ).length;

  const handleCancelSession = async (
    sessionId: string
  ) => {
    try {
      await sessionsApi.cancel(sessionId);

      setSessions(prev =>
        prev.filter(s => s._id !== sessionId)
      );

      showToast(
        "Request cancelled successfully",
        "success"
      );
    } catch (error: any) {
      console.log("Cancel Error:", error.response?.data);
      console.log("Status:", error.response?.status);

      showToast(
        error.response?.data?.message || "Failed to cancel request",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {ratingSession && (
        <RatingModal
          session={ratingSession}
          onClose={() => setRatingSession(null)}
          onSuccess={() => {
            showToast('Rating submitted! ⭐', 'success');
            fetch();
          }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard size={18} className="text-amber" />
                <h1 className="font-display font-bold text-ink-900 text-2xl">My Learning</h1>
              </div>
              <p className="font-body text-ink-400 text-sm">
                Welcome back, <span className="font-medium text-ink-700">{user?.name}</span>!
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/search')}>
              <Search size={16} /> Explore Skills
            </Button>
          </div>

          {/* Alert for unrated sessions */}
          {unratedCompleted > 0 && (
            <div
              className="mt-5 bg-amber-light border border-amber/20 rounded-2xl px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-amber/20 transition-colors"
              onClick={() => setActiveTab('completed')}
            >
              <p className="text-sm font-body text-amber-dark">
                ⭐ You have <strong>{unratedCompleted}</strong> completed session
                {unratedCompleted > 1 ? 's' : ''} waiting for your rating!
              </p>
              <span className="text-xs font-medium text-amber-dark">Rate now →</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

            <div className="bg-ink-50 rounded-2xl p-3 text-center border border-ink-100">
              <p className="font-display font-bold text-ink-900 text-2xl">
                {requestedCount}
              </p>
              <p className="text-xs text-ink-400">
                Requested
              </p>
            </div>

            <div className="bg-ink-50 rounded-2xl p-3 text-center border border-ink-100">
              <p className="font-display font-bold text-ink-900 text-2xl">
                {activeCount}
              </p>
              <p className="text-xs text-ink-400">
                Active
              </p>
            </div>

            <div className="bg-ink-50 rounded-2xl p-3 text-center border border-ink-100">
              <p className="font-display font-bold text-ink-900 text-2xl">
                {completedCount}
              </p>
              <p className="text-xs text-ink-400">
                Completed
              </p>
            </div>

            <div className="bg-ink-50 rounded-2xl p-3 text-center border border-ink-100">
              <p className="font-display font-bold text-ink-900 text-2xl">
                {ratingsGiven}
              </p>
              <p className="text-xs text-ink-400">
                Ratings Given
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all cursor-pointer whitespace-nowrap',
                activeTab === tab
                  ? 'bg-ink-900 text-white shadow-sm'
                  : 'bg-white border border-ink-100 text-ink-500 hover:border-ink-300',
              ].join(' ')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tabCount(tab) > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-500'
                    }`}
                >
                  {tabCount(tab)}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <Empty
            icon={<LayoutDashboard size={40} />}
            title={`No ${activeTab} sessions`}
            description={
              activeTab === 'pending'
                ? 'Request a session from any tutor to get started.'
                : `You have no ${activeTab} sessions yet.`
            }
            action={
              activeTab === 'pending' ? (
                <Button variant="secondary" size="sm" onClick={() => navigate('/search')}>
                  Explore Skills
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                viewAs="learner"
                onCancel={handleCancelSession}
                onRate={(s) => setRatingSession(s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
