import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
    danger = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl animate-fade-up">

                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-ink-100">

                    <div
                        className={` w-12 h-12 rounded-2xl flex items-center justify-center ${danger ? 'bg-coral-light text-coral' : 'bg-amber/20 text-amber'}`}
                    >
                        <AlertTriangle size={22} />
                    </div>

                    <div>
                        <h2 className="font-display font-bold text-xl text-ink-900">
                            {title}
                        </h2>

                        <p className="text-sm text-ink-500 mt-1">
                            Please confirm your action.
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5">

                    <p className="text-sm text-ink-600 leading-relaxed">
                        {message}
                    </p>

                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end px-6 pb-6">

                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        fullWidth
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant={danger ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        loading={loading}
                        fullWidth
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};