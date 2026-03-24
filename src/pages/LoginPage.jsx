import { useState } from "react";

// LoginPage — email + password sign in form.
//
// Props:
//   onLogin  {function} receives { email, password }
//   setPage  {function} navigate to a page

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginPage({ onLogin, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'error'
  const [authError, setAuthError] = useState("");

  function validateAll() {
    const e = {};
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email.";
    if (!password.trim()) e.password = "Please enter your password.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    setStatus("submitting");
    setAuthError("");
    try {
      await onLogin({ email: email.trim(), password });
    } catch (err) {
      setAuthError(err.message);
      setStatus("error");
    }
  }

  return (
    <main className="page-enter max-w-sm mx-auto px-3 py-16">
      <div className="mb-7">
        <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1.5">
          Welcome back
        </p>
        <h1 className="font-display text-4xl text-ink mb-2.5">Sign In</h1>
        <p className="text-muted text-sm leading-relaxed">
          Sign in to leave a review.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl border border-cream shadow-sm p-5 space-y-5"
      >
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="jane@example.com"
            className={[
              "field-input w-full px-3 py-2 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors",
              errors.email ? "border-red-400 bg-red-50" : "border-cream",
            ].join(" ")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-ink"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: "" }));
            }}
            placeholder="••••••"
            className={[
              "field-input w-full px-3 py-2 rounded-lg border text-sm text-ink placeholder-muted bg-paper transition-colors",
              errors.password ? "border-red-400 bg-red-50" : "border-cream",
            ].join(" ")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Auth error */}
        {authError && <p className="text-red-500 text-xs">{authError}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-ink text-paper hover:bg-accent active:scale-95 focus:outline-none focus:ring-0"
        >
          {status === "submitting" ? "Signing in…" : "Sign In"}
        </button>

        {/* Link to register */}
        <p className="text-center text-xs text-muted">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setPage("register")}
            className="text-ink font-medium hover:text-accent transition-colors focus:outline-none focus:ring-0"
          >
            Sign up
          </button>
        </p>
      </form>
    </main>
  );
}
