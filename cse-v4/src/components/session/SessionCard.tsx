import React from 'react';
import { BookOpen } from 'lucide-react';
import type { Session } from '../../types';
import { Badge } from '../common';
import { statusColor, formatDate } from '../../utils/helpers';
import { Button } from '../common/Button';
import { UserAvatar } from '../common/UserAvatar';

interface SessionCardProps {
  session: Session;
  viewAs: 'tutor' | 'learner';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRate?: (session: Session) => void;
  loading?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  viewAs,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  onRate,
  loading,
}) => {
  const otherPerson = viewAs === 'tutor' ? session.learner : session.tutor;
  const skill = session.skill;

  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5 flex flex-col gap-4 animate-fade-up hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={session.tutor.name}
            profileImage={session.tutor.profileImage}
          />
          <div>
            <p className="font-display font-semibold text-ink-900 text-sm">
              {otherPerson?.name ?? 'Unknown'}
            </p>
            <p className="text-xs text-ink-400 font-body capitalize">
              {viewAs === 'tutor' ? 'Learner' : 'Tutor'}
            </p>
          </div>
        </div>
        <Badge className={statusColor(session.status)}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </Badge>
      </div>

      {/* Skill */}
      <div className="flex items-center gap-2 bg-ink-50 rounded-xl p-3">
        <BookOpen size={14} className="text-amber flex-shrink-0" />
        <div>
          <p className="text-sm font-display font-semibold text-ink-900">{skill?.skillName}</p>
          <p className="text-xs text-ink-400 font-body">{skill?.level}</p>
        </div>
      </div>

      {/* Session Timeline */}
      <div className="bg-ink-50 rounded-xl p-3">
        <div className="flex flex-col gap-2">

          {/* Requested */}
          <div className="flex items-center gap-2 text-xs font-body">
            <div className="w-2 h-2 rounded-full bg-amber flex-shrink-0" />

            <span className="text-ink-500">
              Requested
            </span>

            <span className="text-ink-400 ml-auto">
              {formatDate(session.requestedAt || session.createdAt)}
            </span>
          </div>

          {/* Accepted */}
          {session.acceptedAt && (
            <div className="flex items-center gap-2 text-xs font-body">
              <div className="w-2 h-2 rounded-full bg-jade flex-shrink-0" />

              <span className="text-ink-500">
                Accepted
              </span>

              <span className="text-ink-400 ml-auto">
                {formatDate(session.acceptedAt)}
              </span>
            </div>
          )}

          {/* Rejected */}
          {session.rejectedAt && (
            <div className="flex items-center gap-2 text-xs font-body">
              <div className="w-2 h-2 rounded-full bg-coral flex-shrink-0" />

              <span className="text-ink-500">
                Rejected
              </span>

              <span className="text-ink-400 ml-auto">
                {formatDate(session.rejectedAt)}
              </span>
            </div>
          )}

          {/* Completed */}
          {session.completedAt && (
            <div className="flex items-center gap-2 text-xs font-body">
              <div className="w-2 h-2 rounded-full bg-jade flex-shrink-0" />

              <span className="text-ink-500">
                Completed
              </span>

              <span className="text-ink-400 ml-auto">
                {formatDate(session.completedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rating display if completed */}
      {session.status === 'completed' && session.rating && (
        <div className="bg-amber-light rounded-xl p-3">
          <p className="text-xs font-medium text-amber-dark font-body">
            ⭐ Rated {session.rating}/5
          </p>
          {session.feedback && (
            <p className="text-xs text-ink-600 font-body mt-1 italic">"{session.feedback}"</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {viewAs === 'tutor' && session.status === 'pending' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAccept?.(session._id)}
              loading={loading}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject?.(session._id)}
              loading={loading}
              className="flex-1"
            >
              Reject
            </Button>
          </>
        )}

        {viewAs === 'tutor' && session.status === 'accepted' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onComplete?.(session._id)}
            loading={loading}
            fullWidth
          >
            Mark as Completed
          </Button>
        )}


        {viewAs === 'learner' && session.status === 'accepted' && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancel?.(session._id)}
            loading={loading}
            fullWidth
          >
            Cancel Session
          </Button>
        )}

        {
          viewAs === 'learner' && session.status === 'pending' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel?.(session._id)}
              loading={loading}
              fullWidth
            >
              Cancel Request
            </Button>
          )
        }

        {viewAs === 'learner' && session.status === 'completed' && !session.rating && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRate?.(session)}
            fullWidth
          >
            ⭐ Rate This Session
          </Button>
        )}
      </div>
    </div>
  );
};
