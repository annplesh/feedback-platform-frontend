import StarRating from "./StarRating";

// FeedbackCard — single review card shown on the Feedback Wall.
//
// Props:
//   item   { id, name, message, rating, date }
//   index  {number} used for CSS animation stagger delay

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FeedbackCard({ item, index = 0 }) {
  const colorClass =
    AVATAR_COLORS[item.name.charCodeAt(0) % AVATAR_COLORS.length];
  const initials = getInitials(item.name);

  return (
    <article
      className="feedback-card card-reveal bg-white rounded-xl border border-cream p-4 flex flex-col gap-3"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header: avatar + name/date + rating pill */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${colorClass}`}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-snug">
              {item.name}
            </p>
            <p className="text-[11px] text-muted mt-0.5">{formatDate(item.date)}</p>
          </div>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-cream text-ink">
          {item.rating}/5
        </span>
      </div>

      {/* Stars */}
      <StarRating value={item.rating} size="sm" />

      {/* Review text */}
      <p className="text-sm text-muted leading-relaxed flex-1">
        {item.message}
      </p>
    </article>
  );
}
