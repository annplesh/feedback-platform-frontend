import { useState, useRef, useEffect } from "react";

// CategorySelect — custom dropdown for category selection.
//
// Props:
//   categories  {Array}   list of { id, name }
//   value       {string}  selected category id
//   onChange    {function} called with selected id

export default function CategorySelect({ categories, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = categories.find((c) => c.id === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 rounded-lg border border-cream text-sm xs:text-xs bg-paper transition-colors focus:outline-none focus:ring-0 flex items-center justify-between"
      >
        <span className={selected ? "text-ink" : "text-muted"}>
          {selected ? selected.name : "Select a category…"}
        </span>
        <span
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ‹
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-cream rounded-lg shadow-sm overflow-hidden">
          <li>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm xs:text-xs text-muted hover:bg-cream transition-colors focus:outline-none focus:ring-0"
            >
              Select a category…
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(cat.id);
                  setOpen(false);
                }}
                className={[
                  "w-full text-left px-3 py-2 text-sm xs:text-xs transition-colors focus:outline-none focus:ring-0",
                  value === cat.id
                    ? "bg-cream text-ink font-medium"
                    : "text-ink hover:bg-cream",
                ].join(" ")}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
