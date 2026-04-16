import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";

// AskAI — AI-powered review analysis widget.
// Allows users to ask questions about all reviews.

const EXAMPLE_QUESTIONS = [
  "What do customers think overall?",
  "What are the most common complaints?",
  "What do customers like the most?",
];

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "ask-ai",
        {
          body: { question: question.trim() },
        },
      );

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setAnswer(data.answer);
    } catch (err) {
      setError("AI is unavailable, please try again.");
      console.error("Ask AI failed:", err.message);
    } finally {
      setLoading(false);
      setCooldown(10);
      timerRef.current = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) { clearInterval(timerRef.current); return 0; }
          return c - 1;
        });
      }, 1000);
    }
  }

  function handleExampleClick(q) {
    setQuestion(q);
  }

  return (
    <section className="mb-8 bg-white rounded-xl border border-cream p-5 xs:p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center shrink-0">
          <span className="text-paper text-[11px] font-semibold">AI</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Ask AI about reviews</p>
          <p className="text-[11px] text-muted">Powered by Groq · Llama 3</p>
        </div>
      </div>

      {/* Example questions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {EXAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleExampleClick(q)}
            className="text-[11px] px-2.5 py-1 rounded-full border border-cream text-muted hover:bg-black/5 active:bg-black/10 active:scale-95 [touch-action:manipulation] transition-[colors,transform] focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => {
            if (e.target.value.length <= 200) setQuestion(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask a question about the reviews…"
          className="field-input flex-1 px-3 py-2 rounded-lg border border-cream text-sm text-ink placeholder-muted bg-paper transition-colors focus:outline-none focus:ring-0"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim() || cooldown > 0}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-ink text-paper hover:bg-accent active:bg-accent/80 active:scale-95 [touch-action:manipulation] transition-[colors,transform] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-0"
        >
          {loading ? "…" : cooldown > 0 ? `Wait ${cooldown}s` : "Ask"}
        </button>
      </div>

      {/* Answer */}
      {answer && (
        <div className="mt-4 p-3 bg-cream rounded-lg">
          <p className="text-sm text-ink leading-relaxed">{answer}</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </section>
  );
}
