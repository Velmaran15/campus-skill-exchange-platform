import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { conversationsApi } from "../../api/services";

interface User {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
}

interface Conversation {
    _id: string;
    tutor: User;
    learner: User;
    lastMessage?: string;
    lastMessageAt?: string;
    session?: {
        status: string;
        skill?: string;
    };
}

export const Conversations: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await conversationsApi.getMyConversations();
                setConversations(response.data);
            } catch (error) {
                console.error("Failed to load conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchConversations();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <p className="text-ink-400">Loading conversations...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-ink-900">
                    Messages
                </h1>
                <p className="text-sm text-ink-400 mt-1">
                    Chat with your tutors and learners
                </p>
            </div>

            {conversations.length === 0 ? (
                <div className="border border-ink-100 rounded-2xl p-12 text-center">
                    <MessageCircle
                        size={40}
                        className="mx-auto text-ink-300 mb-4"
                    />
                    <h2 className="font-semibold text-ink-900">
                        No conversations yet
                    </h2>
                    <p className="text-sm text-ink-400 mt-2">
                        Conversations will appear here after a session is accepted.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {conversations.map((conversation) => {
                        const otherUser =
                            user?.role === "tutor"
                                ? conversation.learner
                                : conversation.tutor;

                        return (
                            <button
                                key={conversation._id}
                                onClick={() => navigate(`/chat/${conversation._id}`)}
                                className="w-full flex items-center gap-4 p-4 bg-white border border-ink-100 rounded-2xl hover:border-ink-300 hover:shadow-sm transition-all text-left">

                                <div className="w-12 h-12 rounded-full bg-ink-900 text-white flex items-center justify-center font-semibold">
                                    {otherUser?.name?.charAt(0)?.toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">

                                        <h3 className="font-semibold text-ink-900">
                                            {otherUser?.name}
                                        </h3>
                                        {conversation.lastMessageAt && (
                                            <span className="text-xs text-ink-400">
                                                {new Date(
                                                    conversation.lastMessageAt
                                                ).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-ink-400 truncate mt-1">
                                        {conversation.lastMessage ||
                                            "Start a conversation"}
                                    </p>
                                </div>
                                <MessageCircle
                                    size={20}
                                    className="text-ink-400"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};