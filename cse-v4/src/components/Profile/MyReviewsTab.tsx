import { useEffect, useState } from "react";
import { sessionsApi } from "../../api/services";
import { StarRating } from "../common";
import { UserAvatar } from "../common/UserAvatar";
import { useNavigate } from "react-router-dom";

export const MyReviewsTab = () => {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await sessionsApi.getMyReviews();
            setReviews(res.data.reviews);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="mb-8">

                <h1 className="text-3xl font-display font-bold text-ink-900">
                    My Reviews
                </h1>

                <p className="text-gray-500 mt-2">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>

            </div>
            <div className="grid gap-6">
                {reviews.map((review: any) => (
                    <div
                        key={review._id}
                        className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <UserAvatar
                                        name={review.tutor?.name}
                                        profileImage={review.tutor?.profileImage}
                                        size="lg"
                                    />

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">

                                            <h2 className="text-2xl font-display font-bold text-ink-900">
                                                {review.tutor?.name}
                                            </h2>

                                            {review.skill?.skillName && (
                                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {review.skill.skillName}
                                                </span>
                                            )}

                                        </div>
                                        <div className="mt-1">
                                            <div className="flex items-center gap-2 mt-1">
                                                <StarRating value={review.rating} />
                                                <span className="text-gray-500 font-medium">
                                                    ({review.rating})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t my-6"></div>

                            <div className="mb-6">
                                <p className="text-gray-600 text-base leading-7 italic">
                                    {review.feedback?.trim()
                                        ? `"${review.feedback}"`
                                        : "No written feedback provided."}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(`/tutor/${review.tutor._id}`)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition"
                                >
                                    View Tutor
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
};