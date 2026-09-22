import React from "react"
import { Empty, Spinner } from "../common";
import { Clock } from "lucide-react";
import { Button } from "../common/Button";
import { SessionCard } from "../session/SessionCard";

type SessionFilter =
  | "all"
  | "pending"
  | "accepted"
  | "completed"
  | "rejected";

interface SessionsTabProps {
    user: any;
    sessions: any[];
    filteredSessions: any[];
    sessionFilter: SessionFilter;
    setSessionFilter: React.Dispatch<React.SetStateAction<SessionFilter>>;
    loadingData: boolean;
    navigate: (path: string) => void;

    handleAcceptSession: (id: string) => void;
    handleRejectSession: (id: string) => void;
    handleCompleteSession: (id: string) => void;
    handleCancelSession: (id: string) => void;

    sessionActionLoading: string | null;
    setRatingSession: React.Dispatch<React.SetStateAction<any>>;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({ user, sessions, filteredSessions, sessionFilter, setSessionFilter, loadingData, navigate, handleAcceptSession, handleCancelSession, handleCompleteSession, handleRejectSession, sessionActionLoading, setRatingSession }) => {
    return (
        <>
            {/* Session Status Filters */}
            <div className="mb-5 overflow-x-auto">
                <div className="flex gap-2 min-w-max sm:min-w-0">

                    {[
                        { label: "All", value: "all" },
                        { label: "Pending", value: "pending" },
                        { label: "Accepted", value: "accepted" },
                        { label: "Completed", value: "completed" },
                        { label: "Rejected", value: "rejected" },
                    ].map((filter) => {

                        const count =
                            filter.value === "all"
                                ? sessions.length
                                : sessions.filter(s => s.status === filter.value).length;

                        return (
                            <button
                                key={filter.value}
                                onClick={() =>
                                    setSessionFilter(
                                        filter.value as
                                        | "all"
                                        | "pending"
                                        | "accepted"
                                        | "completed"
                                        | "rejected"
                                    )
                                }
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${sessionFilter === filter.value
                                    ? "bg-ink-900 text-white"
                                    : "bg-white border border-ink-100 hover:border-ink-300 text-ink-500"}`}>
                                {filter.label}
                                <span
                                    className={`text-[11px] px-2 py-0.5 rounded-full ${sessionFilter === filter.value
                                        ? "bg-white/20"
                                        : "bg-ink-100 text-ink-600"
                                        }`
                                    }>
                                    {count}
                                </span>
                            </button>
                        );
                    })}

                </div>
            </div>

            {/* Session List */}
            {loadingData ? (
                <Spinner />
            ) : sessions.length === 0 ? (
                <Empty
                    icon={<Clock size={40} />}
                    title="No sessions yet"
                    description={
                        user.role === 'learner'
                            ? 'Request a session from any tutor to get started'
                            : 'Sessions requested by learners will appear here'
                    }
                    action={
                        user.role === 'learner' ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate('/search')}
                            >
                                Explore Skills
                            </Button>
                        ) : undefined
                    }
                />
            ) : filteredSessions.length === 0 ? (
                <Empty
                    icon={<Clock size={40} />}
                    title={`No ${sessionFilter} sessions`}
                    description={`You currently have no ${sessionFilter} sessions.`}
                />
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSessions.map((session) => (
                            <SessionCard
                                key={session._id}
                                session={session}
                                viewAs={user.role}
                                onAccept={handleAcceptSession}
                                onReject={handleRejectSession}
                                onComplete={handleCompleteSession}
                                onCancel={handleCancelSession}
                                onRate={(session) => setRatingSession(session)}
                                loading={sessionActionLoading === session._id}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
