import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import {
  useGetReviewsQuery,
  useGetReviewEligibilityQuery,
  useCreateReviewMutation,
} from "./reviewApi";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`text-lg ${
            star <= value ? "text-accent" : "text-neutral-200"
          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ productId, averageRating, reviewCount }) {
  const { accessToken } = useSelector((state) => state.auth);
  const { data: reviewsData, isLoading } = useGetReviewsQuery(productId);
  const { data: eligibilityData } = useGetReviewEligibilityQuery(productId, {
    skip: !accessToken,
  });
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const [showForm, setShowForm] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");
  const reviews = reviewsData?.reviews || [];
  const canReview = eligibilityData?.canReview;

  // Computed live from the actual reviews list (not the separately-
  // fetched product.averageRating/reviewCount props), so the summary
  // never goes stale relative to the list below it after a new review
  // is submitted.
  const liveReviewCount = reviews.length;
  const liveAverageRating = liveReviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / liveReviewCount
    : 0;
  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await createReview({ productId, ...data }).unwrap();
      setSubmitted(true);
      setShowForm(false);
    } catch (err) {
      setServerError(err?.data?.message || "Could not submit your review.");
    }
  };

  return (
    <section className="py-10 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black">Reviews</h2>
          {liveReviewCount > 0 ? (
            <p className="text-sm text-neutral-500">
              <StarRating value={Math.round(liveAverageRating)} readOnly />
              <span className="ml-1">
                {liveAverageRating.toFixed(1)} out of 5 ({liveReviewCount}{" "}
                {liveReviewCount === 1 ? "review" : "reviews"})
              </span>
            </p>
          ) : (
            <p className="text-sm text-neutral-500">No reviews yet.</p>
          )}
        </div>

        {accessToken && canReview && !showForm && !submitted && (
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {!accessToken && (
        <p className="text-sm text-neutral-500 mb-4">
          <Link to="/login" className="underline">
            Log in
          </Link>{" "}
          to write a review.
        </p>
      )}

      {accessToken && eligibilityData && !canReview && (
        <p className="text-sm text-neutral-500 mb-4">
          You can review this product after purchasing it.
        </p>
      )}

      {submitted && (
        <p className="text-sm text-success mb-4">Thanks for your review!</p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-neutral-200 rounded-md p-4 mb-6 flex flex-col gap-3 max-w-md"
        >
          <div>
            <p className="text-sm font-medium text-black mb-1">Your rating</p>
            <StarRating
              value={rating}
              onChange={(v) => setValue("rating", v)}
            />
            {errors.rating && (
              <p className="text-sm text-error mt-1">Select a rating</p>
            )}
          </div>
          <textarea
            {...register("comment")}
            placeholder="Share your thoughts (optional)"
            rows={3}
            className="px-3 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
          />
          {serverError && <p className="text-sm text-error">{serverError}</p>}
          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-neutral-500">Loading reviews...</p>}

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <StarRating value={review.rating} readOnly />
              <span className="text-sm font-medium text-black">
                {review.userName}
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-neutral-800">{review.comment}</p>
            )}
            <p className="text-xs text-neutral-500 mt-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReviewsSection;
