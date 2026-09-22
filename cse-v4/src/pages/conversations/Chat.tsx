import React, { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, ArrowLeft, Paperclip } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { conversationsApi, messagesApi } from "../../api/services";

import { socket } from "../../socket/socket";

interface User {
    _id: string;
    name: string;
    email?: string;
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

interface Message {
    _id: string;
    conversation: string;
    sender: User;
    messageType: "text" | "file" | "image" | "system" | "session";
    text?: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
}

export const Chat: React.FC = () => {
    const { user } = useAuthStore();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");

    const [uploadingFile, setUploadingFile] = useState(false);

    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
        });
    };

    // -----------------------------------------
    // Load conversations
    // -----------------------------------------
    const fetchConversations = async () => {
        try {
            setLoadingConversations(true);

            const response = await conversationsApi.getMyConversations();
            setConversations(response.data);

        } catch (error) {
            console.error("Conversation error:", error);
        } finally {
            setLoadingConversations(false);
        }
    };

    // -----------------------------------------
    // Load messages
    // -----------------------------------------
    const fetchMessages = async (conversationId: string) => {
        try {
            setLoadingMessages(true);
            const response = await messagesApi.getMessages(conversationId);
            setMessages(response.data);

            // Wait until messages are rendered
            setTimeout(() => {
                scrollToBottom(false);
            }, 50);
        } catch (error) {
            console.error("Message error:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // -----------------------------------------
    // Load conversations when page opens
    // -----------------------------------------
    useEffect(() => {
        fetchConversations();
    }, []);


    // -----------------------------------------
    // Socket.IO connection
    // -----------------------------------------
    useEffect(() => {
        socket.connect();

        console.log("🔌 Connecting to Socket.IO...");

        return () => {
            socket.disconnect();

            console.log("🔌 Socket disconnected from Chat");
        };
    }, []);

    // -----------------------------------------
    // Join and leave conversation rooms
    // -----------------------------------------
    useEffect(() => {
        if (!selectedConversation?._id) {
            return;
        }
        const conversationId = selectedConversation._id;
        const joinRoom = () => {
            socket.emit(
                "join_conversation",
                conversationId
            );
            console.log(
                "👥 Joined conversation:",
                conversationId
            );
        };

        if (socket.connected) {
            joinRoom();
        } else {
            socket.once("connect", joinRoom);
        }
        return () => {
            socket.off("connect", joinRoom);
            if (socket.connected) {
                socket.emit(
                    "leave_conversation",
                    conversationId
                );
            }

            console.log(
                "👋 Left conversation:",
                conversationId
            );
        };
    }, [selectedConversation?._id]);

    // Listen for new messages
    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            console.log("📨 New real-time message:", message);
            setMessages((prevMessages) => {
                // Prevent duplicate messages
                const alreadyExists = prevMessages.some(
                    (existingMessage) =>
                        existingMessage._id === message._id
                );
                if (alreadyExists) {
                    return prevMessages;
                }

                return [...prevMessages, message];
            });
        };
        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, []);
    // -----------------------------------------
    // Select conversation
    // -----------------------------------------
    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);

        fetchMessages(conversation._id);
    };

    // -----------------------------------------
    // Find other user
    // -----------------------------------------
    const getOtherUser = (conversation: Conversation) => {
        if (!user) return conversation.tutor;

        if (conversation.tutor._id === user._id) {
            return conversation.learner;
        }

        return conversation.tutor;
    };

    // -----------------------------------------
    // Send message
    // -----------------------------------------
    const handleSendMessage = async () => {
        if (!text.trim() || !selectedConversation || sending) {
            return;
        }

        try {
            setSending(true);
            await messagesApi.sendMessage(
                selectedConversation._id,
                text.trim()
            );

            setText("");

            setTimeout(() => {
                scrollToBottom(true);
            }, 50);

            fetchConversations();
        } catch (error) {
            console.error("Send message error:", error);
        } finally {
            setSending(false);
        }
    };

    // -----------------------------------------
    // Upload file
    // -----------------------------------------
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !selectedConversation || uploadingFile) {
            return;
        }

        try {
            setUploadingFile(true);

            const response = await messagesApi.uploadFile(
                selectedConversation._id,
                file
            );

            const newMessage = response.data;

            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);

            console.log("📎 File uploaded:", file.name);

            fetchConversations();

        } catch (error) {
            console.error("❌ File upload failed:", error);
        } finally {
            setUploadingFile(false);

            // Allow selecting the same file again
            event.target.value = "";
        }
    };

    // -----------------------------------------
    // Enter key
    // -----------------------------------------
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-ink-50">

            {/* Header */}
            <div className="bg-white border-b border-ink-100">
                <div className="max-w-6xl mx-auto px-4 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-ink-900 flex items-center justify-center">
                            <MessageCircle
                                size={20}
                                className="text-white"
                            />
                        </div>

                        <div>
                            <h1 className="font-display text-xl font-bold text-ink-900">
                                Messages
                            </h1>
                            <p className="text-sm text-ink-400">
                                Chat with your tutors and learners
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat */}
            <div className="h-[calc(100vh-64px)] overflow-hidden">
                <div className="max-w-6xl mx-auto h-full px-4 py-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-ink-100 overflow-hidden">
                        <div className="grid md:grid-cols-[300px_minmax(0,1fr)] h-full min-h-0 overflow-hidden border border-ink-100 rounded-2xl bg-white">

                            {/* -------------------------------- */}
                            {/* Conversation List */}
                            {/* -------------------------------- */}
                            <div
                                className={`${selectedConversation
                                    ? "hidden md:flex"
                                    : "flex"
                                    } flex-col min-h-0`}
                            >
                                {/* Conversation Header */}
                                <div className="flex-shrink-0 p-4 border-b border-ink-100">
                                    <h2 className="font-display font-semibold text-ink-900">
                                        Conversations
                                    </h2>
                                </div>

                                {/* Conversation List - ONLY THIS SCROLLS */}
                                <div className="flex-1 min-h-0 overflow-y-auto">
                                    {loadingConversations ? (
                                        <div className="p-6 text-center text-sm text-ink-400">
                                            Loading conversations...
                                        </div>
                                    ) : conversations.length === 0 ? (
                                        <div className="p-6 text-center">

                                            <MessageCircle
                                                size={32}
                                                className="mx-auto mb-3 text-ink-300"
                                            />

                                            <p className="text-sm text-ink-500">
                                                No conversations yet.
                                            </p>

                                            <p className="text-xs text-ink-400 mt-1">
                                                Accept a session to start chatting.
                                            </p>

                                        </div>
                                    ) : (
                                        conversations.map((conversation) => {

                                            const otherUser =
                                                getOtherUser(conversation);

                                            return (
                                                <button
                                                    key={conversation._id}
                                                    onClick={() =>
                                                        handleSelectConversation(
                                                            conversation
                                                        )
                                                    }
                                                    className={` w-full text-left p-4 border-b border-ink-50 hover:bg-ink-50 transition-colors ${selectedConversation?._id === conversation._id ? "bg-amber/10" : ""}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-ink-900 text-white flex items-center justify-center font-semibold">
                                                            {otherUser.name
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0 flex-1">

                                                            <p className="font-semibold text-sm text-ink-900 truncate">
                                                                {otherUser.name}
                                                            </p>

                                                            <p className="text-xs text-ink-400 truncate mt-1">
                                                                {conversation.lastMessage ||
                                                                    "No messages yet"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                            {/* Chat Window */}
                            <div
                                className={`${selectedConversation
                                    ? "flex"
                                    : "hidden md:flex"
                                    } flex-col min-w-0 min-h-0 h-full`}
                            >
                                {!selectedConversation ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">

                                        <MessageCircle
                                            size={50}
                                            className="text-ink-200 mb-4"
                                        />

                                        <h2 className="font-display text-lg font-semibold text-ink-900">
                                            Select a conversation
                                        </h2>

                                        <p className="text-sm text-ink-400 mt-2">
                                            Choose a tutor or learner to start chatting.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Chat Header */}
                                        <div className="flex-shrink-0 p-4 border-b border-ink-100 flex items-center gap-3">

                                            {/* Mobile Back Button */}
                                            <button
                                                onClick={() => setSelectedConversation(null)}
                                                className="md:hidden p-2 rounded-lg hover:bg-ink-50 transition-colors"
                                            >
                                                <ArrowLeft size={18} />
                                            </button>

                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-11 h-11 rounded-full bg-ink-900 text-white flex items-center justify-center font-semibold">
                                                    {getOtherUser(selectedConversation)
                                                        .name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                {/* Online indicator */}
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-jade rounded-full border-2 border-white" />
                                            </div>

                                            {/* User information */}
                                            <div className="min-w-0 flex-1">
                                                <h2 className="font-semibold text-sm text-ink-900 truncate">
                                                    {getOtherUser(selectedConversation).name}
                                                </h2>

                                                <div className="flex items-center gap-1.5 mt-1">

                                                    <span className="w-1.5 h-1.5 rounded-full bg-jade" />

                                                    <p className="text-xs text-jade">
                                                        Online
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3">
                                            {loadingMessages ? (
                                                <div className="text-center text-sm text-ink-400">
                                                    Loading messages...
                                                </div>
                                            ) : messages.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center">
                                                    <MessageCircle
                                                        size={40}
                                                        className="text-ink-200 mb-3"
                                                    />

                                                    <p className="text-sm text-ink-500">
                                                        No messages yet.
                                                    </p>

                                                    <p className="text-xs text-ink-400 mt-1">
                                                        Send the first message.
                                                    </p>

                                                </div>
                                            ) : (
                                                messages.map((message) => {
                                                    const isMine = message.sender._id === user?._id;

                                                    const messageTime = new Date(
                                                        message.createdAt
                                                    ).toLocaleTimeString([], {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                    });

                                                    return (
                                                        <div
                                                            key={message._id}
                                                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                                        >
                                                            <div
                                                                className={`max-w-[75%] sm:max-w-[65%] ${isMine
                                                                    ? "items-end"
                                                                    : "items-start"
                                                                    } flex flex-col`}
                                                            >

                                                                {/* Sender name */}
                                                                <p
                                                                    className={`text-[11px] font-medium mb-1 px-2 ${isMine
                                                                        ? "text-ink-400"
                                                                        : "text-ink-500"
                                                                        }`}
                                                                >
                                                                    {isMine
                                                                        ? "You"
                                                                        : message.sender.name}
                                                                </p>

                                                                {/* Message bubble */}
                                                                <div
                                                                    className={`px-4 py-3 rounded-2xl shadow-sm ${isMine
                                                                        ? "bg-ink-900 text-white rounded-br-md"
                                                                        : "bg-ink-100 text-ink-900 rounded-bl-md"
                                                                        }`}
                                                                >

                                                                    {message.messageType === "image" && message.fileUrl ? (
                                                                        <div className="space-y-2">

                                                                            <img
                                                                                src={`http://localhost:5000${message.fileUrl}`}
                                                                                alt={message.fileName || "Shared image"}
                                                                                className="max-w-[280px] max-h-[350px] rounded-xl object-contain cursor-pointer"
                                                                                onClick={() =>
                                                                                    window.open(
                                                                                        `http://localhost:5000${message.fileUrl}`,
                                                                                        "_blank"
                                                                                    )
                                                                                }
                                                                            />

                                                                            {message.fileName && (
                                                                                <p className="text-xs break-words">
                                                                                    {message.fileName}
                                                                                </p>
                                                                            )}
                                                                        </div>

                                                                    ) : message.messageType === "file" && message.fileUrl ? (

                                                                        <a
                                                                            href={`http://localhost:5000${message.fileUrl}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-3 min-w-[180px]"
                                                                        >
                                                                            <div className="text-2xl">
                                                                                📄
                                                                            </div>

                                                                            <div className="min-w-0">

                                                                                <p className="text-sm font-medium break-words">
                                                                                    {message.fileName || "Download file"}
                                                                                </p>

                                                                                <p className="text-xs opacity-60 mt-1">
                                                                                    Open / Download
                                                                                </p>

                                                                            </div>
                                                                        </a>

                                                                    ) : (
                                                                        <p className="text-sm leading-6 break-words">
                                                                            {message.text}
                                                                        </p>
                                                                    )}

                                                                    {/* Time */}
                                                                    <div
                                                                        className={`flex justify-end mt-1.5 ${isMine
                                                                            ? "text-white/60"
                                                                            : "text-ink-400"
                                                                            }`}
                                                                    >
                                                                        <span className="text-[10px]">
                                                                            {messageTime}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Message Input */}
                                        <div className="flex-shrink-0 p-4 border-t border-ink-100 bg-white">

                                            <div className="flex gap-2">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    hidden
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                                                    onChange={handleFileUpload}
                                                />

                                                {uploadingFile ? (
                                                    <span className="text-xs text-ink-400">
                                                        Uploading...
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={sending || uploadingFile}
                                                        className="p-2 rounded-full hover:bg-ink-100 transition-colors disabled:opacity-50"
                                                        title="Attach file"
                                                    >
                                                        <Paperclip size={20} />
                                                    </button>
                                                )}

                                                <input
                                                    type="text"
                                                    value={text}
                                                    onChange={(e) => setText(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    disabled={sending}
                                                    placeholder={
                                                        sending
                                                            ? "Sending message..."
                                                            : "Type a message..."
                                                    }
                                                    className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber/40 disabled:bg-ink-50 disabled:cursor-not-allowed transition"
                                                />

                                                <button
                                                    onClick={handleSendMessage}
                                                    disabled={!text.trim() || sending}
                                                    className="min-w-[76px] px-4 py-3 rounded-xl bg-ink-900 text-white hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {sending ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                            <span className="text-xs font-medium">
                                                                Sending
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send size={18} />
                                                            <span className="hidden sm:inline text-sm">
                                                                Send
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};