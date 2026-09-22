import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "../common/Button";


// ─── Delete Account modal ─────────────────────────────────────────────────────
export const DeleteAccountModal: React.FC<{ onClose: () => void; onConfirm: () => Promise<void> }> = ({ onClose, onConfirm }) => {
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const handle = async () => {
        if (confirm !== 'DELETE') { setErr('Type DELETE to confirm.'); return; }
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setErr(msg ?? 'Failed to delete account.'); setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-coral-light flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={18} className="text-coral" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-ink-900 text-lg">Delete Account</h2>
                        <p className="text-xs text-ink-400 font-body">This cannot be undone.</p>
                    </div>
                </div>
                <p className="text-sm text-ink-500 font-body mb-4 leading-relaxed">
                    All your data — skills, sessions, and reviews — will be permanently deleted.
                    Type <strong className="text-coral font-mono">DELETE</strong> to confirm.
                </p>
                <input
                    type="text"
                    disabled={loading}
                    placeholder="Type DELETE"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-sm font-mono text-ink-900 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-all mb-3"
                />
                {err && <p className="text-xs text-coral font-body mb-3">{err}</p>}
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onClose} disabled={loading} fullWidth>Cancel</Button>
                    <Button variant="danger" onClick={handle} loading={loading} fullWidth>Delete Forever</Button>
                </div>
            </div>
        </div>
    );
};
