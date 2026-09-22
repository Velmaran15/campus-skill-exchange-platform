import React from "react";
import { AlertTriangle, Mail, Shield, Trash2, User } from "lucide-react";
import { EditField } from "./EditField";
import { ChangePassword } from "./ChangePassword";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { Badge } from "../common";
import { Button } from "../common/Button";

interface SettingsTabProps {
    user: any;

    handleNameUpdate: (name: string) => Promise<void>;
    handleEmailUpdate: (email: string) => Promise<void>;

    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteAccount: () => Promise<void>;

    show: (msg: string, type?: "success" | "error") => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ user, handleNameUpdate, handleEmailUpdate, showDelete, setShowDelete, handleDeleteAccount, show, }) => {
    return (
        <div className="max-w-4xl space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-ink-900">
                    Settings
                </h2>
                <p className="text-sm text-ink-500 mt-1">
                    Manage your account information and security.
                </p>
            </div>

            {/* Profile Settings */}
            <div className="bg-white rounded-3xl border border-ink-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <User size={18} className="text-amber" />
                    <h3 className="font-display font-semibold text-lg text-ink-900">
                        Profile Information
                    </h3>
                </div>

                <div className="space-y-5">
                    <EditField
                        label="Full Name"
                        value={user.name}
                        onSave={handleNameUpdate}
                        icon={<User size={15} />}
                    />

                    <EditField
                        label="Email Address"
                        value={user.email}
                        onSave={handleEmailUpdate}
                        icon={<Mail size={15} />}
                        type="email"
                    />

                    <div className="bg-ink-50 rounded-2xl px-5 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-ink-400 uppercase tracking-wide">
                                Account Role
                            </p>
                            <p className="font-medium text-ink-900 capitalize mt-1">
                                {user.role}
                            </p>
                        </div>

                        <Badge className="bg-amber/10 text-amber border border-amber/20 capitalize">
                            {user.role}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-3xl border border-ink-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Shield size={18} className="text-amber" />
                    <h3 className="font-display font-semibold text-lg text-ink-900">
                        Security
                    </h3>
                </div>

                <ChangePassword
                    onSuccess={() => show("Password changed successfully 🔐")}
                />
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} className="text-red-600" />
                    <h3 className="font-display font-semibold text-red-700">
                        Danger Zone
                    </h3>
                </div>

                <p className="text-sm text-red-600 leading-6 mb-5">
                    Deleting your account is permanent. All your sessions, reviews,
                    skills, and profile data will be removed forever.
                </p>

                <Button
                    variant="danger"
                    onClick={() => setShowDelete(true)}
                >
                    <Trash2 size={16} />
                    Delete My Account
                </Button>

                {showDelete && (
                    <DeleteAccountModal
                        onClose={() => setShowDelete(false)}
                        onConfirm={handleDeleteAccount}
                    />
                )}
            </div>

        </div>

    );
};