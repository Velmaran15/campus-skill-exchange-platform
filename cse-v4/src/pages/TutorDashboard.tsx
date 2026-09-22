import React, { useEffect, useState } from 'react';
import { Plus, LayoutDashboard } from 'lucide-react';
import { sessionsApi } from '../api/services';
import type { Session } from '../types';
import { useAuthStore } from '../store/authStore';
import { SessionCard } from '../components/session/SessionCard';
import { AddSkillModal } from '../components/tutor/AddSkillModal';
import { Button } from '../components/common/Button';
import { Spinner, Empty, Toast } from '../components/common';

type Tab = 'pending' | 'accepted' | 'completed' | 'rejected';

export const TutorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await sessionsApi.getTutorSessions();
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

  const handleAction = async (action: 'accept' | 'reject' | 'complete', id: string) => {
    setActionLoading(id);
    try {
      if (action === 'accept') await sessionsApi.accept(id);
      else if (action === 'reject') await sessionsApi.reject(id);
      else await sessionsApi.complete(id);
      showToast(`Session ${action}ed successfully!`, 'success');
      fetch();
    } catch {
      showToast('Action failed. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs: Tab[] = ['pending', 'accepted', 'completed', 'rejected'];
  const filtered = sessions.filter((s) => s.status === activeTab);

  const tabCount = (tab: Tab) => sessions.filter((s) => s.status === tab).length;

  const pendingCount = sessions.filter(
    s => s.status === "pending"
  ).length;

  const acceptedCount = sessions.filter(
    s => s.status === "accepted"
  ).length;

  const completedCount = sessions.filter(
    s => s.status === "completed"
  ).length;

  const averageRating =
    sessions
      .filter(s => s.rating)
      .reduce(
        (sum, s) => sum + (s.rating || 0),
        0
      ) /
    (sessions.filter(s => s.rating).length || 1);

  return (
    <div className="min-h-screen bg-ink-50">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {showAddSkill && (
        <AddSkillModal
          onClose={() => setShowAddSkill(false)}
          onSuccess={async () => {
            showToast('Skill added successfully! 🎉', 'success');
            // await fetch();
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
                <h1 className="font-display font-bold text-ink-900 text-2xl">Tutor Dashboard</h1>
              </div>
              <p className="font-body text-ink-400 text-sm">
                Welcome back, <span className="font-medium text-ink-700">{user?.name}</span>!
              </p>
            </div>
            <Button variant="secondary" onClick={() => setShowAddSkill(true)}>
              <Plus size={16} /> Add Skill
            </Button>
          </div>

          {/* Stats row */}
          {/* Analytics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

            <div className="bg-ink-50 rounded-2xl p-3 text-center border border-ink-100">
              <p className="font-display font-bold text-ink-900 text-2xl">
                {pendingCount}
              </p>
              <p className="text-xs text-ink-400">
                Pending
              </p>
            </div>

            <div className="bg-ink-50 rounded-2xl p-3 text-center border border-ink-100">
              <p className="font-display font-bold text-ink-900 text-2xl">
                {acceptedCount}
              </p>
              <p className="text-xs text-ink-400">
                Accepted
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
                ⭐ {averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-ink-400">
                Average Rating
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs */}
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
                ? 'New session requests will appear here.'
                : `You have no ${activeTab} sessions yet.`
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                viewAs="tutor"
                onAccept={(id) => handleAction('accept', id)}
                onReject={(id) => handleAction('reject', id)}
                onComplete={(id) => handleAction('complete', id)}
                loading={actionLoading === session._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
