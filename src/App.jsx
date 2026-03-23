import { useState } from "react";
import Navbar from "./components/Navbar";
import SubmitPage from "./pages/SubmitPage";
import WallPage from "./pages/WallPage";
import { useFeedback } from "./hooks/useFeedback";

export default function App() {
  // Simple string-based routing — no router library needed
  const [page, setPage] = useState("submit"); // 'submit' | 'wall'

  // All feedback state lives here, passed down as props
  const { approvedItems, categories, submitFeedback, loading, error } =
    useFeedback();

  return (
    <div className="min-h-screen bg-paper">
      <Navbar page={page} setPage={setPage} />

      {page === "submit" && (
        <SubmitPage onSubmit={submitFeedback} categories={categories} />
      )}

      {page === "wall" && (
        <WallPage
          items={approvedItems}
          loading={loading}
          onLeaveReview={() => setPage("submit")}
        />
      )}

      <footer className="border-t border-cream py-8 text-center text-xs text-muted mt-10">
        © 2024 FeedbackHub · Frontend portfolio project
      </footer>
    </div>
  );
}
