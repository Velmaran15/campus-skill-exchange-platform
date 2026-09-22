// import React, { useCallback, useState } from 'react';

import { Mail, Star, BookOpen, Plus } from 'lucide-react';

import { Button } from '../../components/common/Button';
import { UserAvatar } from '../common/UserAvatar';


interface ProfileHeroProps {
    [key: string]: any;
}


export const ProfileHero: React.FC<ProfileHeroProps> = ({ user, skills, setShowAddSkill, completedSessions, pendingSessions, acceptedSessions, unratedCompleted, setActiveTab, setSessionFilter, handleProfileUpload }) => {

    return (
        <div className="bg-ink-900 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative flex-shrink-0">
                        <label
                            htmlFor="profile-upload"
                            className="block cursor-pointer"
                            title="Click to change profile photo"
                        >
                            <UserAvatar
                                name={user.name}
                                profileImage={user.profileImage}
                                size="xl"
                            />

                            <input
                                id="profile-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleProfileUpload}
                            />
                        </label>

                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-jade rounded-full border-2 border-ink-900 pointer-events-none" />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                            <h1 className="font-display font-bold text-2xl sm:text-3xl break-words">
                                {user.name}
                            </h1>
                            <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full capitalize ${user.role === 'tutor' ? 'bg-amber text-ink-900' : 'bg-jade/20 text-jade border border-jade/30'
                                }`}>
                                {user.role}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-sm font-body mb-4">
                            <Mail size={13} /> {user.email}
                        </div>
                        <div className="flex items-center gap-5 flex-wrap">
                            {user.role === 'tutor' && user.averageRating ? (
                                <div className="flex items-center gap-1.5">
                                    <Star size={14} className="text-amber fill-amber" />
                                    <span className="text-sm font-body text-white/80">{user.averageRating.toFixed(1)} rating</span>
                                </div>
                            ) : null}

                            {user.role === 'tutor' && (
                                <div className="flex items-center gap-1.5">
                                    <BookOpen size={14} className="text-amber" />
                                    <span className="text-sm font-body text-white/80">{skills.length} skill{skills.length !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                        </div>



                        {user.role === "learner" && unratedCompleted > 0 && (
                            <div
                                onClick={() => {
                                    setActiveTab("sessions");
                                    setSessionFilter("completed");
                                }}
                                className="mt-3 inline-flex items-center gap-3 bg-amber/10 border border-amber/30 rounded-full px-4 py-2 cursor-pointer hover:bg-amber/20 transition-all">
                                <span className="text-sm">
                                    ⭐
                                </span>
                                <span className="text-xs text-white/80">
                                    <span className="font-semibold text-white">
                                        {unratedCompleted}
                                    </span>{" "}
                                    session{unratedCompleted > 1 ? "s" : ""} waiting for review
                                </span>
                                <span className="text-xs font-semibold text-amber">
                                    Rate →
                                </span>
                            </div>
                        )}

                    </div>
                    {user.role === 'tutor' && (
                        <Button
                            variant="secondary" onClick={() => setShowAddSkill(true)} className="w-full sm:w-auto flex-shrink-0">
                            <Plus size={15} /> Add Skill
                        </Button>
                    )}

                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-8">
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center border border-white/10">
                        <p className="font-display font-bold text-xl sm:text-2xl text-white">{completedSessions}</p>
                        <p className="text-xs font-body text-white/50 mt-0.5">Completed</p>
                    </div>
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center border border-white/10">
                        <p className="font-display font-bold text-xl sm:text-2xl text-amber">{pendingSessions}</p>
                        <p className="text-xs font-body text-white/50 mt-0.5">Pending</p>
                    </div>
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center border border-white/10">
                        <p className="font-display font-bold text-xl sm:text-2xl text-jade">{acceptedSessions}</p>
                        <p className="text-xs font-body text-white/50 mt-0.5">Accepted</p>
                    </div>
                </div>
            </div>
        </div>
    );
}