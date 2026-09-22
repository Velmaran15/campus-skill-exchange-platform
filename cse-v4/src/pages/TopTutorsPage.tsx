import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, ArrowRight } from 'lucide-react';
import { tutorsApi } from '../api/services';
import type { User } from '../types';
import { StarRating, Spinner, Empty } from '../components/common';
import { Button } from '../components/common/Button';
import { UserAvatar } from '../components/common/UserAvatar';

interface TopTutor extends User {
  averageRating: number;
  totalSessions: number;
}

const medalEmojis = ['🥇', '🥈', '🥉'];

export const TopTutorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<TopTutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tutorsApi.getTopTutors()
      .then((res) => setTutors(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Hero */}
      <div className="bg-ink-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #F5A623 0%, transparent 60%)` }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber rounded-2xl mb-4">
            <Trophy size={26} className="text-ink-900" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">
            Top Tutors
          </h1>
          <p className="font-body text-white/50 text-sm">
            Ranked by rating and sessions completed
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <Spinner />
        ) : tutors.length === 0 ? (
          <Empty
            icon={<Trophy size={40} />}
            title="No tutors yet"
            description="Be the first tutor on the platform!"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {tutors.map((tutor, index) => (
              <div
                key={tutor._id}
                onClick={() => navigate(`/tutor/${tutor._id}`)}
                className={[
                  'bg-white border rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-up group',
                  index === 0 ? 'border-yellow-200 shadow-yellow-50 shadow-md' : 'border-ink-100',
                ].join(' ')}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 sm:w-10 text-center">
                  {index < 3 ? (
                    <span className="text-xl sm:text-2xl">{medalEmojis[index]}</span>
                  ) : (
                    <span className={`font-display font-bold text-xl text-ink-300`}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <UserAvatar
                  name={tutor.name}
                  profileImage={tutor.profileImage}
                  size="lg"
                  className={index === 0 ? "!border-amber" : ""}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-ink-900 text-base truncate">{tutor.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <div className="flex items-center gap-1">
                      <StarRating
                        value={tutor.averageRating ?? 0}
                        size={13}
                      />
                      <span className="text-sm font-semibold text-gray-600">
                        ({(tutor.averageRating ?? 0).toFixed(1)})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink-400 font-body">
                      <Users size={11} />
                      {tutor.totalSessions} sessions
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="hidden sm:block flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs font-medium text-ink-400 group-hover:text-ink-900 transition-colors">
                    View
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discover more */}
        {tutors.length > 0 && (
          <div className="text-center mt-10">
            <p className="text-ink-400 font-body text-sm mb-3">
              Discover all tutors and their skills
            </p>
            <Button variant="primary" onClick={() => navigate('/search')} className="w-full sm:w-auto">
              Explore All Skills
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
