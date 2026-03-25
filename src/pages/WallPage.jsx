import { useState } from "react";
import FeedbackCard from "../components/FeedbackCard";
import StarRating from "../components/StarRating";

// WallPage — public grid of all approved feedback.
// Includes sort controls and a summary stats bar.
//
// Props:
//   items         {Array}    approved feedback entries from useFeedback hook
//   loading       {boolean}  whether feedback is loading
//   user          {object}   current user or null
//   isAdmin       {boolean}  whether current user is admin
//   onDelete      {function} delete feedback handler
//   onLeaveReview {function} navigate to submit page

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

function sortItems(items, mode) {
  const copy = [...items];
  switch (mode) {
    case "newest":
      return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "oldest":
      return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "highest":
      return copy.sort((a, b) => b.rating - a.rating);
    case "lowest":
      return copy.sort((a, b) => a.rating - b.rating);
    default:
      return copy;
  }
}

function calcAverage(items) {
  if (!items.length) return 0;
  return (items.reduce((acc, i) => acc + i.rating, 0) / items.length).toFixed(
    1,
  );
}

export default function WallPage({
  items,
  loading,
  onLeaveReview,
  user,
  isAdmin,
  onDelete,
}) {
  const [sort, setSort] = useState("newest");

  // Loading skeleton
  if (loading) {
    return (
      <main className="page-enter max-w-5xl mx-auto px-3 xs:px-2 py-8 xs:py-6">
        <div className="mb-8">
          <div className="h-3 w-24 bg-cream rounded animate-pulse mb-3" />
          <div className="h-10 w-48 bg-cream rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-cream p-3 h-40 animate-pulse"
            />
          ))}
        </div>
      </main>
    );
  }

  const sorted = sortItems(items, sort);
  const average = calcAverage(items);
  const roundedAvg = Math.round(average);

  return (
    <main className="page-enter max-w-5xl mx-auto px-3 xs:px-2 py-8 xs:py-6">
      {/* Page header + summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1.5 xs:text-[10px]">
            Community voices
          </p>
          <h1 className="font-display text-4xl xs:text-3xl text-ink">
            All Reviews
          </h1>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3 text-center pb-1">
            <div>
              <p className="text-2xl xs:text-xl font-semibold text-ink">
                {items.length}
              </p>
              <p className="text-xs text-muted mt-0.5">reviews</p>
            </div>
            <div>
              <p className="text-2xl xs:text-xl font-semibold text-ink">
                {average}
              </p>
              <p className="text-xs text-muted mt-0.5">average</p>
            </div>
            <div>
              <StarRating value={roundedAvg} size="sm" />
              <p className="text-xs text-muted mt-1">overall</p>
            </div>
          </div>
        )}
      </div>

      {/* Sort controls */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 xs:gap-1 mb-6">
          <span className="w-full text-[11px] xs:text-[10px] text-muted font-medium">
            Sort by:
          </span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={[
                "px-2.5 py-1 xs:px-2 xs:py-0.5 rounded-full text-[11px] xs:text-[10px] font-medium border transition-colors",
                "whitespace-normal inline-block max-w-[45%] xs:max-w-[42%] leading-tight",
                "focus:outline-none focus:ring-0",
                sort === opt.value
                  ? "bg-cream text-ink border-cream"
                  : "bg-white text-muted border-cream hover:border-ink hover:text-ink",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid or empty state */}
      {sorted.length === 0 ? (
        <div className="text-center py-14 xs:py-10 text-muted">
          <p className="text-4xl xs:text-3xl mb-3">💬</p>
          <p className="font-medium text-ink">No reviews yet</p>
          <p className="text-sm xs:text-xs mt-1">
            Be the first to share your experience.
          </p>
          {onLeaveReview && (
            <button
              onClick={onLeaveReview}
              className="mt-3 px-4 py-2 rounded-full bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors focus:outline-none focus:ring-0"
            >
              Leave a Review
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((item, index) => (
            <FeedbackCard
              key={item.id}
              item={item}
              index={index}
              user={user}
              isAdmin={isAdmin}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
