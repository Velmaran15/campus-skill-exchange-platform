import { authApi } from '../../api/services';
import { Edit3, EyeOff, Eye, Lock } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '../common/Button';

export const ChangePassword: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    const handleSave = async () => {
        if (!current || !next) { setErr('All fields are required.'); return; }
        if (next.length < 6) { setErr('New password must be at least 6 characters.'); return; }
        if (next !== confirm) { setErr('Passwords do not match.'); return; }
        setSaving(true); setErr('');
        try {
            await authApi.updateProfile({ currentPassword: current, newPassword: next });
            setCurrent(''); setNext(''); setConfirm(''); setErr('');
            setOpen(false);
            onSuccess();
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setErr(msg ?? 'Failed to change password.');
        } finally { setSaving(false); }
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-sm font-body text-ink-600 hover:text-ink-900 border border-ink-200 hover:border-ink-400 rounded-xl px-4 py-2.5 transition-all cursor-pointer w-full"
            >
                <Lock size={14} className="text-ink-400" />
                Change Password
                <Edit3 size={12} className="ml-auto text-ink-300" />
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-3 bg-ink-50 rounded-2xl p-4 border border-ink-200">
            <p className="text-sm font-display font-semibold text-ink-900">Change Password</p>
            <div className="relative">
                <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Current password"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full bg-white border border-ink-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-body text-ink-900 focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all"
                />
                <button onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600 cursor-pointer">
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            <div className="relative">
                <input
                    type={showNext ? 'text' : 'password'}
                    placeholder="New password (min. 6 chars)"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    className="w-full bg-white border border-ink-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-body text-ink-900 focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all"
                />
                <button onClick={() => setShowNext(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600 cursor-pointer">
                    {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full bg-white border border-ink-200 rounded-xl px-4 py-2.5 text-sm font-body text-ink-900 focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all"
            />
            {err && <p className="text-xs text-coral font-body">{err}</p>}
            <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setOpen(false); setErr(''); setCurrent(''); setNext(''); setConfirm(''); setErr(''); }} fullWidth>
                    Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave} loading={saving} fullWidth>Update Password</Button>
            </div>
        </div>
    );
};
