import React, { useState } from "react";
import { Check, Edit3, X } from "lucide-react";


// ─── Small inline edit field ──────────────────────────────────────────────────
interface EditFieldProps {
    label: string;
    value: string;
    onSave: (val: string) => Promise<void>;
    icon: React.ReactNode;
    type?: string;
}
export const EditField: React.FC<EditFieldProps> = ({ label, value, onSave, icon, type = 'text' }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    const handleSave = async () => {
        if (!draft.trim() || draft === value) { setEditing(false); return; }
        setSaving(true); setErr('');
        try {
            await onSave(draft.trim());
            setEditing(false);
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setErr(msg ?? 'Failed to save.');
        } finally { setSaving(false); }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink-400 font-body">{label}</label>
            {editing ? (
                <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                        <input
                            type={type}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            autoFocus
                            className="flex-1 bg-white border border-ink-300 rounded-xl px-4 py-2.5 text-sm font-body text-ink-900 focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition-all"
                        />
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-9 h-9 flex items-center justify-center bg-jade text-white rounded-xl hover:bg-jade-dark transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
                        >
                            {saving ? <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
                        </button>
                        <button
                            onClick={() => { setEditing(false); setDraft(value); setErr(''); }}
                            className="w-9 h-9 flex items-center justify-center bg-ink-100 text-ink-500 rounded-xl hover:bg-ink-200 transition-colors cursor-pointer flex-shrink-0"
                        >
                            <X size={15} />
                        </button>
                    </div>
                    {err && <p className="text-xs text-coral font-body">{err}</p>}
                </div>
            ) : (
                <div
                    onClick={() => { setEditing(true); setDraft(value); }}
                    className="group flex items-center gap-2 bg-ink-50 border border-transparent hover:border-ink-200 rounded-xl px-4 py-2.5 cursor-pointer transition-all"
                    title={`Click to edit ${label}`}
                >
                    <span className="text-ink-300">{icon}</span>
                    <span className="flex-1 text-sm font-body text-ink-700">{value}</span>
                    <Edit3 size={13} className="text-ink-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
    );
};