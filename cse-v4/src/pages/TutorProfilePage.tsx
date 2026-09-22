import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowLeft, MessageSquare } from 'lucide-react';
import { tutorsApi, sessionsApi } from '../api/services';
import type { TutorProfile, Skill } from '../types';
import { useAuthStore } from '../store/authStore';
import { Avatar, Badge, StarRating, Spinner, Card, Toast } from '../components/common';
import { Button } from '../components/common/Button';
import { levelColor, formatDate } from '../utils/helpers';
import type { Session } from '../types';

export const TutorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [profile, setProfile] = useState<TutorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        const fetchSessions = async () => {
            const res = await sessionsApi.getLearnerSessions();
            setSessions(res.data);
        };
        fetchSessions();
    }, []);

    const getSessionForSkill = (skillId: string) => {
        return sessions.find((session) => {
            if (!session.skill) return false;

            const sessionSkillId =
                typeof session.skill === 'string'
                    ? session.skill
                    : session.skill._id;

            return sessionSkillId === skillId;
        });
    };

    useEffect(() => {
        if (!id) return;
        tutorsApi.getProfile(id)
            .then((res) => setProfile(res.data))
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRequest = async (skillId: string) => {
        if (!user) { navigate('/login'); return; }
        if (user.role !== 'learner') { showToast('Only learners can request sessions.', 'error'); return; }
        setRequesting(skillId);
        try {
            await sessionsApi.request(skillId);
            showToast('Session requested successfully! 🎉', 'success');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            showToast(msg ?? 'Failed to request session.', 'error');
        } finally {
            setRequesting(null);
        }
    };

    const handleCancelRequest = async (sessionId: string) => {
        try {
            await sessionsApi.cancel(sessionId);

            setSessions(prev =>
                prev.filter(s => s._id !== sessionId)
            );

            showToast(
                "Request cancelled successfully",
                "success"
            );

        } catch {
            showToast(
                "Failed to cancel request",
                "error"
            );
        }
    };

    if (loading) return <Spinner />;
    if (!profile) return null;



    return (
        <div className="min-h-screen bg-ink-50">
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Hero */}
            <div className="bg-ink-900 text-white">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm font-body transition-colors mb-6 cursor-pointer"
                    >
                        <ArrowLeft size={15} /> Back
                    </button>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <Avatar name={profile.name || "User"} size="xl" className="!bg-amber !text-ink-900" />
                        <div className="flex-1">
                            <h1 className="font-display font-bold text-3xl">{profile.name || "User"}</h1>
                            <p className="text-white/50 font-body text-sm mt-1">{profile.email}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5">
                                    <StarRating value={profile.averageRating} size={14} />
                                    <span className="text-sm font-body text-white/80">
                                        {profile.averageRating?.toFixed(1) ?? '—'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/60 text-sm font-body">
                                    <Users size={14} />
                                    {profile.totalSessions ?? 0} sessions
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
                {/* Skills */}
                <div className="md:col-span-2 flex flex-col gap-5">
                    <h2 className="font-display font-bold text-ink-900 text-xl flex items-center gap-2">
                        <BookOpen size={18} className="text-amber" /> Skills Offered
                    </h2>
                    {profile.skills.length === 0 ? (
                        <Card>
                            <p className="text-ink-400 font-body text-sm text-center py-4">No skills added yet.</p>
                        </Card>
                    ) : (
                        profile.skills.map((skill: Skill) => {
                            const session = getSessionForSkill(skill._id);
                            return (
                                <Card key={skill._id} className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-display font-bold text-ink-900 text-lg">{skill.skillName}</h3>
                                            <p className="text-sm text-ink-500 font-body mt-1 leading-relaxed">{skill.description}</p>
                                        </div>
                                        <Badge className={levelColor(skill.level)}>{skill.level}</Badge>
                                    </div>

                                    {user?.role === 'learner' && user._id !== profile._id && (
                                        <>
                                            {session ? (
                                                <>
                                                    <Button
                                                        disabled
                                                        variant="primary"
                                                        size="sm"
                                                    >
                                                        {session.status.toUpperCase()}
                                                    </Button>

                                                    {session.status === "pending" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleCancelRequest(session._id)}
                                                        >
                                                            Cancel Request
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleRequest(skill._id)}
                                                    loading={requesting === skill._id}
                                                >
                                                    Request Session
                                                </Button>
                                            )}

                                            {session && (
                                                <div className="text-xs text-gray-500 mt-2">
                                                    <p>Requested: {formatDate(session.requestedAt || session.createdAt)}</p>

                                                    {session.status === "accepted" && session.acceptedAt && (
                                                        <p>Accepted: {formatDate(session.acceptedAt)}</p>
                                                    )}

                                                    {session.status === "rejected" && session.rejectedAt && (
                                                        <p>Rejected: {formatDate(session.rejectedAt)}</p>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Reviews */}
                <div className="flex flex-col gap-4">
                    <h2 className="font-display font-bold text-ink-900 text-xl flex items-center gap-2">
                        <MessageSquare size={18} className="text-amber" /> Reviews
                        <span className="text-sm font-body font-normal text-ink-400">({profile.reviews.length})</span>
                    </h2>

                    {profile.reviews.length === 0 ? (
                        <Card>
                            <p className="text-ink-400 font-body text-sm text-center py-4">No reviews yet.</p>
                        </Card>
                    ) : (
                        profile.reviews.map((review) => (
                            <Card key={review._id} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar name={review.learner?.name || "User"} size="sm" />
                                        <p className="text-sm font-display font-semibold text-ink-900">{review.learner?.name || "User"}</p>
                                    </div>
                                    <StarRating value={review.rating} size={12} />
                                </div>
                                {review.feedback && (
                                    <p className="text-xs text-ink-500 font-body italic leading-relaxed">
                                        "{review.feedback}"
                                    </p>
                                )}
                                <p className="text-[10px] text-ink-300 font-body">{formatDate(review.createdAt)}</p>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
