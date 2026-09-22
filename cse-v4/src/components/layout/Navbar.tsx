import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, Trophy, Search, Menu, X, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../common';
import { NotificationBell } from "../notification/NotificationBell";
import { NotificationDropdown } from "../notification/NotificationDropdown";
import { notificationsApi } from "../../api/services";
import type { Notification } from "../../types";
import { MessageCircle } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    fetchUnreadCount();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await notificationsApi.getNotifications();
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationsApi.getUnreadCount();
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await notificationsApi.markAsRead(notification._id);
      }
      fetchNotifications();
      fetchUnreadCount();
      setShowNotifications(false);
      navigate(notification.link || "/profile");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);



  const isActive = (path: string) =>
    location.pathname === path ? 'text-ink-900 font-semibold' : 'text-ink-400 hover:text-ink-900';

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 bg-ink-900 rounded-xl flex items-center justify-center group-hover:bg-amber transition-colors duration-200">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-ink-900 text-lg tracking-tight">
            Skill<span className="text-amber">X</span>
          </span>
        </Link>

        {/* Desktop Nav — Explore & Top Tutors visible to EVERYONE */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/search" className={`flex items-center gap-1.5 text-sm font-body transition-colors ${isActive('/search')}`}>
            <Search size={15} /> Explore
          </Link>
          <Link to="/top-tutors" className={`flex items-center gap-1.5 text-sm font-body transition-colors ${isActive('/top-tutors')}`}>
            <Trophy size={15} /> Top Tutors
          </Link>
          <Link
            to="/conversations"
            className={`flex items-center gap-1.5 text-sm font-body transition-colors ${location.pathname.startsWith("/conversations") ||
              location.pathname.startsWith("/chat")
              ? "text-ink-900 font-semibold"
              : "text-ink-400 hover:text-ink-900"
              }`}
          >
            <MessageCircle size={15} />
            Chat
          </Link>
          {user && (
            <Link
              to={user.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/learner'}
              className={`flex items-center gap-1.5 text-sm font-body transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-ink-900 font-semibold' : 'text-ink-400 hover:text-ink-900'
                }`}
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div ref={notificationRef}
                className="relative hidden md:block"
              >
                <NotificationBell
                  unreadCount={unreadCount}
                  onClick={() =>
                    setShowNotifications(!showNotifications)
                  }
                />

                {showNotifications && (
                  <NotificationDropdown
                    notifications={notifications}
                    loading={loadingNotifications}
                    onMarkAsRead={handleNotificationClick}
                    onMarkAllAsRead={handleMarkAllAsRead}
                  />
                )}
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="hidden md:flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer group"
                title="My Profile"
              >
                <div className="relative">
                  <Avatar name={user.name} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-jade rounded-full border-2 border-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-display font-semibold text-ink-900 leading-none group-hover:text-amber transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-ink-400 font-body capitalize">{user.role}</span>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 text-sm text-ink-400 hover:text-coral transition-colors cursor-pointer font-body"
              >
                <LogOut size={15} /> Logout
              </button>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 rounded-xl text-ink-500 hover:bg-ink-100 transition-colors cursor-pointer"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-body text-ink-600 hover:text-ink-900 transition-colors px-3 py-2">Login</Link>
                <Link to="/register" className="text-sm font-body font-medium bg-ink-900 text-white px-4 py-2 rounded-xl hover:bg-ink-700 transition-colors">Sign Up</Link>
              </div>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 rounded-xl text-ink-500 hover:bg-ink-100 transition-colors cursor-pointer"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-ink-100 px-4 py-4 flex flex-col gap-1 animate-fade-up">
          <Link to="/search" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-sm font-body text-ink-700 hover:bg-ink-50 rounded-xl px-3 py-2.5 transition-colors">
            <Search size={15} /> Explore Skills
          </Link>
          <Link to="/top-tutors" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-sm font-body text-ink-700 hover:bg-ink-50 rounded-xl px-3 py-2.5 transition-colors">
            <Trophy size={15} /> Top Tutors
          </Link>
          {user ? (
            <>
              {/* <Link
                to="/chat"
                className={`flex items-center gap-2 text-sm font-body text-ink-700 hover:bg-ink-50 rounded-xl px-3 py-2.5 transition-colors ${isActive("/chat")}`}
              >
                <MessageCircle size={15} />
                Chat
              </Link> */}

              <Link
                to="/conversations"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 text-sm font-body text-ink-700 hover:bg-ink-50 rounded-xl px-3 py-2.5 transition-colors ${location.pathname.startsWith("/conversations") ||
                    location.pathname.startsWith("/chat")
                    ? "text-ink-900 font-semibold"
                    : "text-ink-400 hover:text-ink-900"
                  }`}
              >
                <MessageCircle size={15} />
                Chat
              </Link>
              <Link to={user.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/learner'} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-body text-ink-700 hover:bg-ink-50 rounded-xl px-3 py-2.5 transition-colors">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-body text-ink-700 hover:bg-ink-50 rounded-xl px-3 py-2.5 transition-colors">
                <User size={15} /> My Profile
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-body text-coral hover:bg-coral-light rounded-xl px-3 py-2.5 cursor-pointer w-full text-left mt-1 transition-colors">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-body text-ink-700 border border-ink-200 rounded-xl py-2.5 hover:bg-ink-50 transition-colors">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-body font-medium bg-ink-900 text-white rounded-xl py-2.5 hover:bg-ink-700 transition-colors">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
