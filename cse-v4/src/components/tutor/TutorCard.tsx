import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { usersApi } from "../../api/services";
import { Star, BookOpen, ArrowRight, Heart } from 'lucide-react';
import type { Skill } from '../../types';
import { Badge } from '../common';
import { levelColor } from '../../utils/helpers';
import { UserAvatar } from '../common/UserAvatar';

interface TutorCardProps {
  skill: Skill;
}

export const TutorCard: React.FC<TutorCardProps> = ({ skill }) => {
  const navigate = useNavigate();
  const tutor = skill.tutor;
  
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(skill.isSaved ?? false);
  }, [skill.isSaved]);

  const handleSaveSkill = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (saving) return;
    try {
      setSaving(true);
      if (isSaved) {
        await usersApi.unSaveSkill(skill._id);
        setIsSaved(false);
      } else {
        await usersApi.saveSkill(skill._id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/tutor/${tutor._id}`)}
      className="group bg-white border border-ink-100 rounded-2xl p-5 hover:border-ink-300 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col gap-4 animate-fade-up"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={tutor.name}
            profileImage={tutor.profileImage}
            size="md"
          />
          <div>
            <p className="font-display font-semibold text-ink-900 text-sm leading-tight">{tutor.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={12} className="text-amber fill-amber" />
              <span className="text-xs text-ink-500 font-body">
                {tutor.averageRating ? tutor.averageRating.toFixed(1) : 'New'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveSkill}
            disabled={saving}
            className="p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <Heart
              size={18}
              className={isSaved ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>

          <Badge className={levelColor(skill.level)}>
            {skill.level}
          </Badge>
        </div>
      </div>

      {/* Skill info */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <BookOpen size={13} className="text-amber" />
          <p className="font-display font-bold text-ink-900">{skill.skillName}</p>
        </div>
        <p className="text-xs text-ink-400 font-body line-clamp-2 leading-relaxed">
          {skill.description}
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink-50">
        <span className="text-xs text-ink-300 font-mono">FREE • PEER LEARNING</span>
        <div className="flex items-center gap-1 text-xs font-medium text-ink-900 group-hover:text-amber transition-colors">
          View Profile <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
