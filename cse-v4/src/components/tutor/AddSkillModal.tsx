import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input, Select, Textarea } from '../common/Input';
import { skillsApi } from '../../api/services';
import type { SkillLevel } from '../../types';

interface AddSkillModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<SkillLevel>('Beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required.');
      return;
    }
    setLoading(true);
    try {
      await skillsApi.addSkill({ name, description, level });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to add skill.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-ink-900 text-xl">Add a Skill</h2>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-700 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Skill Name"
            placeholder="e.g. Machine Learning, Guitar, React"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Describe what you'll teach and what learners will gain..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value as SkillLevel)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        </div>

        {error && <p className="text-xs text-coral font-body mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} fullWidth>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading} fullWidth>
            Add Skill
          </Button>
        </div>
      </div>
    </div>
  );
};
