import { Star } from "lucide-react";
import { Badge, Empty, Spinner, StarRating } from "../common";
import { formatDate } from "../../utils/helpers";
import { UserAvatar } from "../common/UserAvatar";


interface ReviewsTabProps {
    user: any;
    reviews: any[];
    loadingData: boolean;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews, loadingData }) => {
    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-ink-900">
                        Reviews
                    </h2>
                    <p className="text-sm text-ink-500 mt-1">
                        Feedback from learners after completed sessions.
                    </p>
                </div>

                {reviews.length > 0 && (
                    <Badge className="bg-amber/10 text-amber border border-amber/20">
                        {reviews.length} Review{reviews.length > 1 ? "s" : ""}
                    </Badge>
                )}
            </div>

            {loadingData ? (
                <Spinner />
            ) : reviews.length === 0 ? (
                <Empty
                    icon={<Star size={40} />}
                    title="No Reviews Yet"
                    description="Complete more sessions to start receiving reviews from learners."
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white rounded-3xl border border-ink-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                        >
                            {/* Top */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <UserAvatar
                                        name={review.learner?.name || "Learner"}
                                        profileImage={review.learner?.profileImage}
                                    />

                                    <div>
                                        <h3 className="font-display font-semibold text-ink-900">
                                            {review.learner?.name || "Learner"}
                                        </h3>

                                        <p className="text-xs text-ink-400">
                                            {formatDate(review.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-amber/10 px-3 py-1 rounded-full">
                                    <Star
                                        size={14}
                                        className="text-amber fill-amber"
                                    />
                                    <span className="text-sm font-semibold text-amber">
                                        {review.rating}/5
                                    </span>
                                </div>
                            </div>

                            {/* Review */}
                            <div className="mt-5 flex-grow">
                                <p className="text-sm text-ink-600 leading-7 italic">
                                    {review.feedback || "No written feedback provided."}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between">
                                <StarRating value={review.rating} size={15} />

                                <span className="text-xs text-ink-400">
                                    Verified Session
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};