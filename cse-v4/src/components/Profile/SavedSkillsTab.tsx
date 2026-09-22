import { useEffect, useState } from "react";
import { usersApi } from "../../api/services";
import { useNavigate } from "react-router-dom";
import { StarRating } from "../common";
import { UserAvatar } from "../common/UserAvatar";


interface SavedSkill {
    _id: string;
    skillName: string;
    description?: string;
    level: "Beginner" | "Intermediate" | "Advanced";

    tutor: {
        _id: string;
        name: string;
        profileImage?: string;
        rating?: number;
    };
}

export const SavedSkillsTab = () => {
    const [savedSkills, setSavedSkills] = useState<SavedSkill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedSkills();
    }, []);

    const fetchSavedSkills = async () => {
        try {
            const res = await usersApi.getSavedSkills();
            setSavedSkills(res.data.savedSkills);
        } catch (error) {
            console.error("Failed to fetch saved skills", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (skillId: string) => {
        try {
            await usersApi.unSaveSkill(skillId);

            setSavedSkills(prev =>
                prev.filter(skill => skill._id !== skillId)
            );
        } catch (err) {
            console.error(err);
        }
    };

    const navigate = useNavigate();

    const handleViewTutor = (tutorId: string) => {
        navigate(`/tutor/${tutorId}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (savedSkills.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-md p-12 text-center">

                <div className="text-6xl mb-4">
                    ❤️
                </div>

                <h2 className="text-2xl font-bold text-ink-900">
                    No Saved Skills
                </h2>

                <p className="text-gray-500 mt-2">
                    Save interesting skills from the Explore page and they'll appear here.
                </p>

                <button
                    onClick={() => navigate("/explore")}
                    className="mt-6 bg-amber hover:bg-yellow-500 text-ink-900 font-semibold px-6 py-3 rounded-xl transition"
                >
                    Explore Skills
                </button>

            </div>
        );
    }

    return (
        <>

            <div className="mb-8">

                <h1 className="text-3xl font-display font-bold text-ink-900">
                    Saved Skills
                </h1>

                <p className="text-gray-500 mt-2">
                    {savedSkills.length} saved skill{savedSkills.length !== 1 ? "s" : ""}
                </p>

            </div>
            <div className="grid gap-6">
                {savedSkills.map((skill) => (
                    <div
                        key={skill._id}
                        onClick={() => handleViewTutor(skill.tutor._id)}
                        className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <UserAvatar
                                        name={skill.tutor.name}
                                        profileImage={skill.tutor.profileImage}
                                        size="lg"
                                    />

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">

                                            <h2 className="text-2xl font-display font-bold text-ink-900">
                                                {skill.skillName}
                                            </h2>

                                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                ❤️ Saved
                                            </span>

                                        </div>

                                        <p className="text-gray-500 mt-2">
                                            {skill.description || "No description provided."}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`px-4 py-1 rounded-full text-sm font-semibold
                    ${skill.level === "Beginner"
                                            ? "bg-green-100 text-green-700"
                                            : skill.level === "Intermediate"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-purple-100 text-purple-700"
                                        }`}
                                >
                                    {skill.level}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="border-t my-6"></div>

                            {/* Footer */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-lg text-gray-800">
                                        👤 {skill.tutor.name}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1">
                                        <StarRating
                                            value={skill.tutor.rating ?? 0}
                                            size={14}
                                        />

                                        <span className="text-sm font-semibold text-gray-600">
                                            ({(skill.tutor.rating ?? 0).toFixed(1)})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => handleViewTutor(skill.tutor._id)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition"
                                    >
                                        View Tutor
                                    </button>

                                    <button
                                        onClick={() => handleRemove(skill._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};