import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { skillsApi } from '../api/services';
import type { Skill, SearchFilters } from '../types';
import { TutorCard } from '../components/tutor/TutorCard';
import { Input, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Spinner, Empty } from '../components/common';

export const SearchPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ name: '', level: '', minRating: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (filters.name) params.name = filters.name;
      if (filters.level) params.level = filters.level;
      if (filters.minRating && filters.minRating > 0) params.minRating = filters.minRating;
      const res = await skillsApi.search(params);
      setSkills(res.data);
    } catch {
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchSkills, 350);
    return () => clearTimeout(timer);
  }, [fetchSkills]);

  const clearFilters = () => setFilters({ name: '', level: '', minRating: 0 });
  const hasFilters = filters.level || (filters.minRating && filters.minRating > 0);

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="font-display font-bold text-ink-900 text-2xl sm:text-3xl mb-1">Explore Skills</h1>
          <p className="font-body text-ink-400 text-sm mb-6">
            Search {skills.length > 0 ? `${skills.length} skills` : 'skills'} taught by your fellow students
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                className="w-full bg-ink-50 border border-ink-100 rounded-xl pl-11 pr-4 py-3 text-ink-900 font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all"
                placeholder="Search skills..."
                value={filters.name}
                onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <Button variant={showFilters ? 'primary' : 'ghost'}
              onClick={() => setShowFilters((v) => !v)} className="w-full sm:w-auto">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {hasFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
              )}
            </Button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 p-4 sm:p-5 bg-ink-50 rounded-2xl border border-ink-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up">
              <Select
                label="Level"
                value={filters.level ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value as SearchFilters['level'] }))}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </Select>
              <Input
                label="Min Rating"
                type="number"
                min={0}
                max={5}
                step={0.5}
                placeholder="e.g. 4"
                value={filters.minRating ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, minRating: parseFloat(e.target.value) || 0 }))}
              />
              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                  <X size={14} /> Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <Spinner />
        ) : skills.length === 0 ? (
          <Empty
            icon={<Search size={40} />}
            title="No skills found"
            description="Try adjusting your search or filters"
            action={
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {skills.map((skill) => (
              <TutorCard key={skill._id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
