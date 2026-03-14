import { useState } from "react";
import StarRating from "../components/StarRating";

// SubmitPage — public feedback submission form.
//
// Form states: idle → submitting → success
// Success shows a thank-you screen with a reset option.
//
// Props:
//   onSubmit {function}  receives { name, message, rating }

const MAX_MESSAGE = 300;

function hasMeaningfulText(value) {
  const trimmed = value.trim();
  return trimmed.length >= 2 && /[a-zA-Z]/.test(trimmed);
}

function hasMeaningfulMessage(value) {
  const trimmed = value.trim();
  return trimmed.length >= 10 && /[a-zA-Z]/.test(trimmed);
}

export default function SubmitPage({ onSubmit }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success'

  function validateAll() {
    const e = {};
    if (!name.trim()) e.name = "Please enter your name.";
    else if (!hasMeaningfulText(name))
      e.name = "Please enter a real name with at least 2 letters.";

    if (!message.trim()) e.message = "Please write your message.";
    else if (!hasMeaningfulMessage(message))
      e.message = "Message must be at least 10 meaningful characters.";

    if (rating === 0) e.rating = "Please select a star rating.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateField(field) {
    const nextErrors = { ...errors };
    if (field === "name") {
      if (!name.trim()) nextErrors.name = "Please enter your name.";
      else if (!hasMeaningfulText(name))
        nextErrors.name = "Please enter a real name with at least 2 letters.";
      else nextErrors.name = "";
    }
    if (field === "message") {
      if (!message.trim()) nextErrors.message = "Please write your message.";
      else if (!hasMeaningfulMessage(message))
        nextErrors.message =
          "Message must be at least 10 meaningful characters.";
      else nextErrors.message = "";
    }
    setErrors(nextErrors);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    setStatus("submitting");
    setTimeout(() => {
      onSubmit({ name: name.trim(), message: message.trim(), rating });
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  }

  function handleReset() {
    setName("");
    setMessage("");
    setRating(0);
    setErrors({});
    setStatus("idle");
  }

  // ── Success screen ──────────────────────────────────────
  if (status === "success") {
    return (
      <div className="page-enter min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6 text-2xl">
            ✓
          </div>
          <h2 className="font-display text-3xl text-ink mb-3">Thank you!</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Your feedback has been submitted and is pending review. We really
            appreciate you taking the time.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-ink text-paper rounded-lg text-sm font-medium hover:bg-accent transition-colors focus:outline-none focus:ring-0"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────
  return (
    <main className="page-enter max-w-xl mx-auto px-3 py-12">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1.5">
          Share your experience
        </p>
        <h1 className="font-display text-4xl text-ink mb-2.5">
          Leave a Review
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          Your thoughts help us improve. Honest feedback, however critical, is
          always welcome.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl border border-cream shadow-sm p-5 space-y-5"
      >
        {/* Name field */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-ink">
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: "" }));
            }}
            onBlur={() => validateField("name")}
            placeholder="Jane Doe"
            className={[
              "field-input w-full px-3 py-2 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors",
              errors.name ? "border-red-400 bg-red-50" : "border-cream",
            ].join(" ")}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        {/* Message field */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-ink"
            >
              Your message
            </label>
            <span className="text-xs text-muted">
              {message.length}/{MAX_MESSAGE}
            </span>
          </div>
          <textarea
            id="message"
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_MESSAGE) {
                setMessage(e.target.value);
                if (errors.message) setErrors((p) => ({ ...p, message: "" }));
              }
            }}
            onBlur={() => validateField("message")}
            placeholder="Tell us what you think…"
            rows={4}
            className={[
              "field-input w-full px-3 py-2 rounded-lg border text-sm text-ink placeholder-muted bg-paper resize-none transition-colors",
              errors.message ? "border-red-400 bg-red-50" : "border-cream",
            ].join(" ")}
          />
          {errors.message && (
            <p className="text-red-500 text-xs">{errors.message}</p>
          )}
        </div>

        {/* Star rating */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-ink">Rating</p>
          <StarRating
            value={rating}
            onChange={(v) => {
              setRating(v);
              if (errors.rating) setErrors((p) => ({ ...p, rating: "" }));
            }}
          />
          {errors.rating && (
            <p className="text-red-500 text-xs">{errors.rating}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={
            status === "submitting" ||
            !hasMeaningfulText(name) ||
            !hasMeaningfulMessage(message) ||
            rating === 0
          }
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-ink text-paper hover:bg-accent active:scale-95 focus:outline-none focus:ring-0"
        >
          {status === "submitting" ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>
    </main>
  );
}
