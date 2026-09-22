
import type { ActiveTab } from "../../types/profile";

interface ProfileSidebarProps {
    user: { role: string };
    activeTab: ActiveTab;
    setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, activeTab, setActiveTab, }) => {
    return (
        <>
            {/* Mobile / Tablet Profile Navigation */}
            <div className="lg:hidden w-full overflow-x-auto" >
                <div className="flex gap-2 min-w-max bg-ink-900 rounded-2xl p-2">

                    <button onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'dashboard' ? 'bg-amber text-ink-900' : 'text-white hover:bg-white/10'}`}>
                        Dashboard
                    </button>

                    {user.role === 'tutor' && (
                        <button onClick={() => setActiveTab('skills')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'skills' ? 'bg-amber text-ink-900' : 'text-white hover:bg-white/10'}`}>
                            My Skills
                        </button>
                    )}

                    {user.role === 'learner' && (
                        <button onClick={() => setActiveTab('savedSkills')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'savedSkills' ? 'bg-amber text-ink-900' : 'text-white hover:bg-white/10'}`}>
                            Saved Skills
                        </button>
                    )}

                    <button
                        onClick={() => setActiveTab('sessions')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'sessions' ? 'bg-amber text-ink-900' : 'text-white hover:bg-white/10'}`}>
                        Sessions
                    </button>

                    {user.role === 'tutor' && (
                        <button onClick={() => setActiveTab('reviews')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'reviews' ? 'bg-amber text-ink-900' : 'text-white hover:bg-white/10'}`}>
                            Reviews
                        </button>
                    )}

                    {user.role === 'learner' && (
                        <button onClick={() => setActiveTab('reviews')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'reviews' ? 'bg-amber text-ink-900' : 'text-white hover:bg-white/10'}`}>
                            My Reviews
                        </button>
                    )}

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'settings' ? 'bg-amber text-ink-900' : 'text-white hover:bg-white/10'}`}>
                        Settings
                    </button>

                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24" >
                <div className="bg-ink-900 rounded-3xl p-6 shadow-xl">
                    <h2 className="text-white font-display font-bold text-2xl mb-6">
                        My Profile
                    </h2>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard'
                                ? 'bg-amber text-ink-900'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            Dashboard
                        </button>

                        {user.role === 'tutor' && (
                            <button
                                onClick={() => setActiveTab('skills')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'skills'
                                    ? 'bg-amber text-ink-900'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                My Skills
                            </button>
                        )}

                        {user.role === 'learner' && (
                            <button
                                onClick={() => setActiveTab('savedSkills')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'savedSkills'
                                    ? 'bg-amber text-ink-900'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Saved Skills
                            </button>
                        )}


                        <button
                            onClick={() => setActiveTab('sessions')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'sessions'
                                ? 'bg-amber text-ink-900'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            Sessions
                        </button>


                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'reviews'
                                ? 'bg-amber text-ink-900'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {user.role === "tutor" ? "Reviews" : "My Reviews"}
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'settings'
                                ? 'bg-amber text-ink-900'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            Settings
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
}