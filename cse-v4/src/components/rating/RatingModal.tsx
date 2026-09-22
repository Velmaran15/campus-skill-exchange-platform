import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Session } from '../../types';
import { StarRating } from '../common';
import { Button } from '../common/Button';
import { Textarea } from '../common/Input';
import { sessionsApi } from '../../api/services';

interface RatingModalProps {
  session: Session;
  onClose: () => void;
  onSuccess: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ session, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating.'); return; }
    setLoading(true);
    try {
      await sessionsApi.rate(session._id, { rating, feedback });
      onSuccess();
      onClose();
    } catch {
      setError('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 animate-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-ink-900 text-xl">Rate Your Session</h2>
            <p className="text-sm text-ink-400 font-body mt-1">
              with <span className="font-medium text-ink-700">{session.tutor?.name}</span> on{' '}
              <span className="font-medium text-ink-700">{session.skill?.skillName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-300 hover:text-ink-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stars */}
        <div className="flex flex-col items-center gap-3 py-6 bg-ink-50 rounded-2xl mb-5">
          <p className="text-sm text-ink-500 font-body">How would you rate this session?</p>
          <StarRating value={rating} size={36} interactive onChange={setRating} />
          <p className="text-sm font-display font-semibold text-ink-900">
            {rating === 0 && '—'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent!'}
          </p>
        </div>

        {/* Feedback */}
        <Textarea
          label="Feedback (optional)"
          placeholder="What did you enjoy? What could be improved?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {error && <p className="text-xs text-coral font-body mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} fullWidth>Cancel</Button>
          <Button variant="secondary" onClick={handleSubmit} loading={loading} fullWidth>
            Submit Rating
          </Button>
        </div>
      </div>
    </div>
  );
};
