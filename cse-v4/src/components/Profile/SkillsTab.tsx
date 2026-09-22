import { BookOpen, Edit3, Plus, Trash2 } from "lucide-react";
import { Empty, Spinner, StarRating } from "../common";
import { Button } from "../common/Button";
import { levelColor } from "../../utils/helpers";


interface SkillsTabProps {
    skills: any[];
    loadingData: boolean;

    deletingSkill: string | null;

    setShowAddSkill: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingSkill: React.Dispatch<React.SetStateAction<any>>;

    handleDeleteSkill: (id: string) => void;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({ skills, loadingData, deletingSkill, setShowAddSkill, setEditingSkill, handleDeleteSkill }) => {
    return (
        <>
            {
                loadingData ? (
                    <Spinner />
                ) : skills.length === 0 ? (
                    <Empty
                        icon={<BookOpen size={40} />}
                        title="No Skills Added Yet"
                        description="Share your expertise by adding your first skill."
                        action={
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowAddSkill(true)}
                            >
                                <Plus size={15} />
                                Add Skill
                            </Button>
                        }
                    />
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-ink-900">
                                    My Skills
                                </h2>
                                <p className="text-sm text-ink-500">
                                    Manage the skills you teach.
                                </p>
                            </div>

                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowAddSkill(true)}
                            >
                                <Plus size={15} />
                                Add Skill
                            </Button>
                        </div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {skills.map((skill) => (
                                <div
                                    key={skill._id}
                                    className="bg-white border border-ink-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-amber/40 transition-all duration-300 flex flex-col"
                                >
                                    {/* Top */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div>
                                            <h3 className="text-lg font-display font-bold text-ink-900">
                                                {skill.skillName}
                                            </h3>

                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${levelColor(skill.level)}`}>
                                                {skill.level}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingSkill(skill)}
                                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-ink-50 hover:bg-amber/10 hover:text-amber transition-all"
                                            >
                                                <Edit3 size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteSkill(skill._id)}
                                                disabled={deletingSkill === skill._id}
                                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-ink-50 hover:bg-coral-light hover:text-coral transition-all"
                                            >
                                                {deletingSkill === skill._id ? (
                                                    <div className="w-4 h-4 border-2 border-coral border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-ink-500 leading-6 line-clamp-4 flex-grow">
                                        {skill.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StarRating
                                                value={skill.averageRating ?? 0}
                                                size={14}
                                            />

                                            <span className="text-xs text-ink-500">
                                                {(skill.averageRating ?? 0).toFixed(1)}
                                            </span>
                                        </div>

                                        <span className="text-xs text-ink-400">
                                            {skill.totalSessions ?? 0} Sessions
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>

                )
            }
        </>
    );
};