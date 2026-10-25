import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { skillsApi, sessionsApi, authApi, usersApi, tutorsApi } from '../api/services';
import type { Skill, Session, Review } from '../types';
import { Spinner } from '../components/common';
import { Button } from '../components/common/Button';
import { AddSkillModal } from '../components/tutor/AddSkillModal';
import { EditSkillModal } from '../components/tutor/EditSkillModal';
import { ConfirmModal } from '../components/common/ConfirmModal';

import { ProfileHero } from '../components/Profile/ProfileHero';
import { ProfileSidebar } from "../components/Profile/ProfileSidebar";
import { DashboardTab } from '../components/Profile/DashboardTab';
import { SessionsTab } from '../components/Profile/SessionsTab';
import { SkillsTab } from '../components/Profile/SkillsTab';
import { ReviewsTab } from '../components/Profile/ReviewsTab';
import { SettingsTab } from '../components/Profile/SettingsTab';
import { SavedSkillsTab } from "../components/Profile/SavedSkillsTab";
import { MyReviewsTab } from "../components/Profile/MyReviewsTab";

import type { ActiveTab } from "../types/profile";
import { Star, User, Calendar, X } from "lucide-react";







// ─── Toast helper ─────────────────────────────────────────────────────────────
const useToast = () => {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const show = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const UserProfilePage: React.FC = () => {
  const { user, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast, show } = useToast();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<string | null>(null);

  const [sessionActionLoading, setSessionActionLoading] = useState<string | null>(null);

  const [sessionFilter, setSessionFilter] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'rejected'>('all');

  const [bio, setBio] = useState(user?.bio || '');
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  const [ratingSession, setRatingSession] = useState<Session | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  const [_selectedTags, setSelectedTags] = useState<string[]>([]);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    danger: boolean;
    onConfirm: (() => void) | null;
  }>({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    danger: false,
    onConfirm: null,
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const promises: Promise<void>[] = [];

      if (user.role === 'tutor') {
        promises.push(

          // Fetch tutor skills
          skillsApi.getMySkills()
            .then(r => {
              console.log("SKILLS:", r.data);
              setSkills(r.data);
            })
            .catch(() => setSkills([])),

          // Fetch tutor sessions
          sessionsApi.getTutorSessions()
            .then(r => {
              console.log("SESSIONS:", r.data);
              setSessions(r.data);
            })
            .catch(() => setSessions([])),

          // Fetch tutor profile and reviews
          tutorsApi.getProfile(user._id)
            .then(r => {
              console.log("TUTOR PROFILE:", r.data);
              console.log("REVIEWS:", r.data.reviews);

              setReviews(r.data.reviews || []);
            })
            .catch(error => {
              console.error("Failed to fetch reviews:", error);
              setReviews([]);
            })

        );
      } else {
        promises.push(
          sessionsApi.getLearnerSessions().then(r => { console.log("API RESPONSE:", r.data); setSessions(r.data) }).catch(() => setSessions([]))
        );
      }
      await Promise.all(promises);
    } finally {
      setLoadingData(false);
    }
  };

  // Update name
  const handleNameUpdate = async (name: string) => {
    const res = await authApi.updateProfile({ name });
    // Update the user in Zustand store
    const token = localStorage.getItem('cse_token')!;
    setAuth(token, { ...user!, name: res.data.user?.name ?? name });
    show('Name updated successfully! ✅');
  };

  // Update email
  const handleEmailUpdate = async (email: string) => {
    const res = await authApi.updateProfile({ email });
    const token = localStorage.getItem('cse_token')!;
    setAuth(token, { ...user!, email: res.data.user?.email ?? email });
    show('Email updated successfully! ✅');
  };

  // Delete skill
  const handleDeleteSkill = async (skillId: string) => {
    setDeletingSkill(skillId);
    try {
      await skillsApi.deleteSkill(skillId);
      setSkills(prev => prev.filter(s => s._id !== skillId));
      show('Skill deleted successfully! ✅');
    } catch {
      show('Failed to delete skill.', 'error');
    } finally {
      setDeletingSkill(null);
    }
  };

  // Accept session - Tutor only
  const handleAcceptSession = async (sessionId: string) => {
    try {
      setSessionActionLoading(sessionId);

      await sessionsApi.accept(sessionId);

      setSessions(prev =>
        prev.map(session =>
          session._id === sessionId
            ? { ...session, status: 'accepted' }
            : session
        )
      );

      show('Session accepted successfully! ✅');

    } catch (error) {
      console.error('Accept session error:', error);
      show('Failed to accept session.', 'error');

    } finally {
      setSessionActionLoading(null);
    }
  };

  // Reject session - Tutor only
  const handleRejectSession = async (sessionId: string) => {
    try {
      setSessionActionLoading(sessionId);

      await sessionsApi.reject(sessionId);

      setSessions(prev =>
        prev.map(session =>
          session._id === sessionId
            ? { ...session, status: 'rejected' }
            : session
        )
      );

      show('Session rejected.');

    } catch (error) {
      console.error('Reject session error:', error);
      show('Failed to reject session.', 'error');

    } finally {
      setSessionActionLoading(null);
    }
  };

  // Complete session - Tutor only
  const handleCompleteSession = async (sessionId: string) => {
    try {
      setSessionActionLoading(sessionId);

      await sessionsApi.complete(sessionId);

      setSessions(prev =>
        prev.map(session =>
          session._id === sessionId
            ? { ...session, status: 'completed' }
            : session
        )
      );

      show('Session marked as completed! 🎉');

    } catch (error) {
      console.error('Complete session error:', error);
      show('Failed to complete session.', 'error');

    } finally {
      setSessionActionLoading(null);
    }
  };

  // Cancel session - Learner only
  const handleCancelSession = async (id: string) => {
    setConfirmModal({
      open: true,
      title: 'Cancel Session',
      message: 'Are you sure you want to cancel this session?',
      confirmText: 'Cancel Session',
      danger: true,
      onConfirm: async () => {

        setSessionActionLoading(id);

        try {
          await sessionsApi.cancel(id);
          setSessions((prev) => {
            const updated = prev.filter(session => session._id !== id);
            return updated;
          });

          show("Session cancelled successfully!");

        } catch (err) {
          console.error("Cancel Error:", err);
          show("Failed to cancel session.", "error");
        } finally {
          setSessionActionLoading(null);
        }
      }
    });
  }

  // Update bio
  const handleSaveBio = async () => {
    try {
      setSavingBio(true);
      await usersApi.updateBio(bio);
      const token = localStorage.getItem('cse_token')!;
      setAuth(token, {
        ...user!,
        bio
      });
      show('Bio updated successfully! ✨');
      setEditingBio(false);
    } catch {
      show('Failed to update bio', 'error');
    } finally {
      setSavingBio(false);
    }
  };

  // Upload profile photo
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await usersApi.uploadProfileImage(formData);
      const updatedUser = res.data?.user ?? res.data;
      const token = localStorage.getItem('cse_token');

      if (token && user) {
        setAuth(token, {
          ...user,
          profileImage: updatedUser.profileImage
        });
      }
      show('Profile photo updated! 📸');

    } catch (error) {
      console.error('Profile upload error:', error);
      show('Failed to upload profile photo', 'error');
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    await authApi.deleteAccount();
    logout();
    navigate('/');
  };

  if (!user) return <Spinner />;

  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const pendingSessions = sessions.filter(s => s.status === 'pending').length;
  const acceptedSessions = sessions.filter(s => s.status === 'accepted').length;

  const unratedCompleted = sessions.filter(
    s => s.status === "completed" && !s.rating
  ).length;

  const filteredSessions = sessionFilter === 'all' ? sessions : sessions.filter(session => session.status === sessionFilter);

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleRateSession = async () => {
    if (!ratingSession) return;

    setRatingLoading(true);

    try {
      const res = await sessionsApi.rate(
        ratingSession._id,
        {
          rating: ratingValue,
          feedback: ratingFeedback
        }
      );

      setSessions((prev) =>
        prev.map((session) =>
          session._id === ratingSession._id
            ? {
              ...session,
              rating: res.data.rating,
              feedback: res.data.feedback
            }
            : session
        )
      );

      show('Rating submitted successfully');

      setRatingSession(null);
      setRatingValue(5);
      setRatingFeedback('');

    } catch (err: any) {

      show(
        err.response?.data?.message ||
        'Failed to submit rating',
        'error'
      );
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">

      {/* Modals */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        danger={confirmModal.danger}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false, }))}
        onConfirm={async () => {
          await confirmModal.onConfirm?.();

          setConfirmModal(prev => ({
            ...prev,
            open: false,
          }));
        }}
      />

      {showAddSkill && (
        <AddSkillModal
          onClose={() => setShowAddSkill(false)}
          onSuccess={() => { show('Skill added! 🎉'); fetchData(); }}
        />
      )}
      {editingSkill && (
        <EditSkillModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSuccess={() => {
            setEditingSkill(null);
            fetchData();
            show('Skill updated successfully!', 'success');
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-body text-sm animate-fade-up ${toast.type === 'success' ? 'bg-jade text-white' : 'bg-coral text-white'
          }`}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <ProfileHero
        user={user}
        skills={skills}
        completedSessions={completedSessions}
        pendingSessions={pendingSessions}
        acceptedSessions={acceptedSessions}
        unratedCompleted={unratedCompleted}
        setActiveTab={setActiveTab}
        setSessionFilter={setSessionFilter}
        setShowAddSkill={setShowAddSkill}
        handleProfileUpload={handleProfileUpload}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12">

          {/* Mobile / Tablet Profile Navigation and  Desktop Sidebar */}
          <ProfileSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* dashboard Content */}
          <div className="w-full min-w-0 flex-1">

            {/* dashboard */}
            {activeTab === "dashboard" && (
              <DashboardTab
                user={user}
                sessions={sessions}
                skills={skills}
                bio={bio}
                editingBio={editingBio}
                savingBio={savingBio}
                setBio={setBio}
                setEditingBio={setEditingBio}
                handleSaveBio={handleSaveBio}
                navigate={navigate}
                setActiveTab={setActiveTab}
                setShowAddSkill={setShowAddSkill}
                pendingSessions={pendingSessions}
                acceptedSessions={acceptedSessions}
                completedSessions={completedSessions}
              />
            )}

            {/* MyReview Tab */}
            {activeTab === "reviews" &&
              user.role === "learner" && (
                <MyReviewsTab />
              )}

            {/* Sessions Content */}
            {activeTab === "sessions" && (
              <SessionsTab
                user={user}
                sessions={sessions}
                filteredSessions={filteredSessions}
                sessionFilter={sessionFilter}
                setSessionFilter={setSessionFilter}
                loadingData={loadingData}
                navigate={navigate}
                handleAcceptSession={handleAcceptSession}
                handleRejectSession={handleRejectSession}
                handleCompleteSession={handleCompleteSession}
                handleCancelSession={handleCancelSession}
                sessionActionLoading={sessionActionLoading}
                setRatingSession={setRatingSession}
              />
            )}

            {activeTab === "savedSkills" && user.role === "learner" && (
              <SavedSkillsTab />
            )}

            {/* Skills Content */}
            {activeTab === "skills" && user.role === "tutor" && (
              <SkillsTab
                skills={skills}
                loadingData={loadingData}
                deletingSkill={deletingSkill}
                setShowAddSkill={setShowAddSkill}
                setEditingSkill={setEditingSkill}
                handleDeleteSkill={handleDeleteSkill}
              />
            )}

            {/* Reviews Content */}
            {activeTab === "reviews" &&
              user.role === "tutor" && (
                <ReviewsTab
                  user={user}
                  reviews={reviews}
                  loadingData={loadingData}
                />
              )}


            {/* Settings Content */}
            {activeTab === "settings" && (
              <SettingsTab
                user={user}
                handleNameUpdate={handleNameUpdate}
                handleEmailUpdate={handleEmailUpdate}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                handleDeleteAccount={handleDeleteAccount}
                show={show}
              />
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {ratingSession && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className=" bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-ink-900">
                  ⭐ Rate Your Experience
                </h2>

                <p className="text-sm text-ink-500 mt-1">
                  Your feedback helps tutors improve and helps other learners.
                </p>
              </div>

              <button
                onClick={() => {
                  setRatingSession(null);
                  setRatingValue(5);
                  setRatingFeedback("");
                  setSelectedTags([]);
                }}
                className="p-2 rounded-xl hover:bg-ink-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Session Card */}
            <div className="bg-ink-50 rounded-2xl p-4 border border-ink-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber text-white flex items-center justify-center">
                  <User size={22} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-ink-900">
                    {ratingSession.tutor?.name || "Tutor"}
                  </h3>

                  <p className="text-sm text-ink-500">
                    {ratingSession.skill?.name}
                  </p>

                  <div className="flex gap-4 mt-2 text-xs text-ink-400">

                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(ratingSession.completedAt ?? ratingSession.createdAt).toLocaleDateString()}
                    </span>

                    {/* <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {ratingSession.duration} mins
                    </span> */}

                  </div>
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-ink-700 mb-3">
                How was your session?
              </p>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="transition-transform hover:scale-125">

                    <Star
                      size={34}
                      className={`transition-all ${star <= ratingValue
                        ? "fill-amber text-amber"
                        : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-3 text-lg font-semibold text-amber">
                {ratingLabels[ratingValue as keyof typeof ratingLabels]}
              </p>
            </div>


            {/* Feedback */}
            <label className="block text-sm font-medium text-ink-700 mb-2">
              Feedback
            </label>


            <textarea
              value={ratingFeedback}
              onChange={(e) =>
                setRatingFeedback(e.target.value)
              }
              placeholder="Share your experience..."
              className="w-full border border-ink-100 rounded-xl p-3 min-h-[100px] resize-none focus:outline-none focus:border-ink-900"
            />


            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-5">

              <Button
                variant="ghost"
                onClick={() => {
                  setRatingSession(null);
                  setRatingValue(5);
                  setRatingFeedback('');
                }}
              >
                Cancel
              </Button>


              <Button
                variant="primary"
                onClick={handleRateSession}
                loading={ratingLoading}
              >
                Submit Rating
              </Button>

            </div>
          </div>
        </div>
      )}
    </div >
  );
};
