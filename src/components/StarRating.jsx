import { useState } from "react";

const SIZE_MAP = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-3xl",
};

export default function StarRating({ value, onChange, size = "md" }) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;
  const displayValue = onChange ? hovered || value : value;

  return (
    <span
      className="flex gap-0.5"
      role={onChange ? "group" : "img"}
      aria-label={onChange ? "Select rating" : `Rating: ${value} out of 5`}
      onMouseLeave={onChange ? () => setHovered(0) : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={[
            sizeClass,
            star <= displayValue ? "text-accent" : "text-cream",
            onChange
              ? "cursor-pointer select-none [touch-action:manipulation] focus:outline-none focus:ring-0"
              : "",
          ].join(" ")}
          onClick={onChange ? () => onChange(star) : undefined}
          onMouseEnter={onChange ? () => setHovered(star) : undefined}
          role={onChange ? "button" : undefined}
          tabIndex={onChange ? 0 : undefined}
          aria-label={onChange ? `${star} star` : undefined}
          data-testid={onChange ? `star-${star}` : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}
