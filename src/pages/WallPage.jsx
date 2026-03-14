import { useState } from "react";
import FeedbackCard from "../components/FeedbackCard";
import StarRating from "../components/StarRating";

// WallPage — public grid of all approved feedback.
// Includes sort controls and a summary stats bar.
//
// Props:
//   items {Array}  approved feedback entries from useFeedback hook

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

export default function WallPage({ items, onLeaveReview }) {
  const [sort, setSort] = useState("newest");

  const sorted = sortItems(items, sort);
  const average = calcAverage(items);
  const roundedAvg = Math.round(average);

  return (
    <main className="page-enter max-w-5xl mx-auto px-3 py-8">
      {/* Page header + summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1.5">
            Community voices
          </p>
          <h1 className="font-display text-4xl text-ink">All Reviews</h1>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3 text-center pb-1">
            <div>
              <p className="text-2xl font-semibold text-ink">{items.length}</p>
              <p className="text-xs text-muted mt-0.5">reviews</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">{average}</p>
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
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="w-full text-[11px] text-muted font-medium">
            Sort by:
          </span>

          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={[
                "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                "whitespace-normal inline-block max-w-[45%] leading-tight",
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
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-medium text-ink">No reviews yet</p>
          <p className="text-sm mt-1">Be the first to share your experience.</p>
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
        <div className="grid grid-cols-1 gap-3">
          {sorted.map((item, index) => (
            <FeedbackCard key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}
