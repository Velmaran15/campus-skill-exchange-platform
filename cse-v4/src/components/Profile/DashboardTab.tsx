import { Edit3 } from "lucide-react";
import { Button } from "../common/Button";
import type { ActiveTab } from "../../types/profile";

interface DashboardTabProps {
    user: any;
    skills: any[];
    bio: string;
    editingBio: boolean;
    savingBio: boolean;
    setBio: (value: string) => void;
    setEditingBio: (value: boolean) => void;
    handleSaveBio: () => void;
    navigate: (path: string) => void;
    setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
    setShowAddSkill: (show: boolean) => void;
    sessions: any[];
    pendingSessions: number;
    acceptedSessions: number;
    completedSessions: number;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ user, skills, bio, editingBio, savingBio, setBio, setEditingBio, handleSaveBio, navigate, setActiveTab, setShowAddSkill, sessions, pendingSessions, acceptedSessions, completedSessions }) => {
    return (
        <>
            {/* dashboard Content */}


            <div className="space-y-6">

                {/* Dashboard Banner */}
                <div className="bg-gradient-to-r from-amber to-orange-400 rounded-3xl p-6 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-5">
                    <div>
                        <h2 className="text-white text-2xl font-bold">
                            Welcome back 👋
                        </h2>
                        <p className="text-white/90 mt-2">
                            {user.role === "learner"
                                ? "Continue learning and complete your pending sessions."
                                : "Manage your skills and help more learners today."}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {user.role === "learner" ? (
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/search")}
                            >
                                🔍 Explore Skills
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => setActiveTab("skills")}
                                >
                                    📚 My Skills
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowAddSkill(true)}
                                >
                                    + Add Skill
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Dashboard Statistics */}
                {user.role === "learner" ? (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                📨 Requested
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {sessions.length}
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                🟢 Active
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {acceptedSessions}
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                ✅ Completed
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {completedSessions}
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                ⭐ Ratings Given
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {sessions.filter(s => s.rating).length}
                            </h2>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                📚 Skills
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {skills.length}
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                ⏳ Pending
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {pendingSessions}
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                🤝 Accepted
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {acceptedSessions}
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <p className="text-sm text-ink-400">
                                ⭐ Rating
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                {user.averageRating?.toFixed(1) || 0}
                            </h2>
                        </div>

                    </div>
                )}

                {/* About Me */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 xl:col-span-4">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-xl text-ink-900">
                            About Me
                        </h2>

                        {!editingBio ? (
                            <button
                                onClick={() => setEditingBio(true)}
                                className="text-amber hover:text-amber-dark"
                            >
                                <Edit3 size={18} />
                            </button>
                        ) : null}
                    </div>

                    {editingBio ? (
                        <div className="space-y-4">

                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={5}
                                placeholder="Tell learners about yourself..."
                                className="w-full border border-ink-200 rounded-xl p-4 resize-none"
                            />

                            <div className="flex gap-2">

                                <Button
                                    variant="secondary"
                                    onClick={handleSaveBio}
                                    loading={savingBio}
                                >
                                    Save Bio
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingBio(false);
                                        setBio(user?.bio || '');
                                    }}
                                >
                                    Cancel
                                </Button>

                            </div>

                        </div>
                    ) : (
                        <p className="text-ink-500 leading-relaxed">
                            {bio || 'No bio added yet.'}
                        </p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-6">
                    <h2 className="font-display font-bold text-xl text-ink-900 mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {user.role === "learner" && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate("/search")}
                                    className="justify-center">
                                    🔍 Explore Skills
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setActiveTab("sessions")}
                                    className="justify-center"
                                >
                                    📅 My Sessions
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setActiveTab("settings")}
                                    className="justify-center"
                                >
                                    ⚙ Settings
                                </Button>
                            </>
                        )}
                        {user.role === "tutor" && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowAddSkill(true)}
                                    className="justify-center"
                                >
                                    ➕ Add Skill
                                </Button>

                                <Button
                                    variant="secondary"
                                    onClick={() => setActiveTab("skills")}
                                    className="justify-center"
                                >
                                    📚 Manage Skills
                                </Button>

                                <Button
                                    variant="secondary"
                                    onClick={() => setActiveTab("sessions")} className="justify-center">
                                    📅 Sessions
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}