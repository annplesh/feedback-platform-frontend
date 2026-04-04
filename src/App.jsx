import { useState } from "react";
import Navbar from "./components/Navbar";
import SubmitPage from "./pages/SubmitPage";
import WallPage from "./pages/WallPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import { useFeedback } from "./hooks/useFeedback";

export default function App() {
  // Simple string-based routing — no router library needed
  const [page, setPage] = useState("wall"); // 'submit' | 'wall' | 'login' | 'register' | 'admin'

  // userName is set after first review submission for personalized greeting
  const [userName, setUserName] = useState("");

  // All feedback state lives here, passed down as props
  const {
    approvedItems,
    allItems,
    categories,
    user,
    isAdmin,
    fetchFeedback,
    submitFeedback,
    deleteFeedback,
    fetchAllFeedback,
    signUp,
    signIn,
    signOut,
    loading,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useFeedback();

  async function handleLogin(credentials) {
    await signIn(credentials);
    setPage("submit");
  }

  async function handleRegister(credentials) {
    await signUp(credentials);
    setPage("submit");
  }

  async function handleAdminPage() {
    await fetchAllFeedback();
    setPage("admin");
  }

  async function handleSubmit(data) {
    await submitFeedback(data);
    if (!userName) setUserName(data.name);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        isAdmin={isAdmin}
        userName={userName}
        onSignOut={async () => {
          await signOut();
          setPage("wall");
        }}
        onAdminPage={handleAdminPage}
        onAvatarUpdate={() => fetchFeedback(false)}
      />

      {page === "submit" && !user && (
        <div className="page-enter min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-4">✍️</p>
            <h2 className="font-display text-3xl text-ink mb-3">
              Sign in to leave a review
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-6">
              You need an account to share your feedback.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPage("login")}
                className="px-5 py-2 bg-ink text-paper rounded-lg text-sm font-medium hover:bg-accent transition-colors focus:outline-none focus:ring-0"
              >
                Sign In
              </button>
              <button
                onClick={() => setPage("register")}
                className="px-5 py-2 border border-cream text-ink rounded-lg text-sm font-medium hover:bg-cream transition-colors focus:outline-none focus:ring-0"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {page === "submit" && user && (
        <SubmitPage
          onSubmit={handleSubmit}
          categories={categories}
          onViewAll={() => setPage("wall")}
        />
      )}

      {page === "wall" && (
        <WallPage
          items={approvedItems}
          loading={loading}
          user={user}
          isAdmin={isAdmin}
          onDelete={deleteFeedback}
          onLeaveReview={() => (user ? setPage("submit") : setPage("login"))}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadMore={loadMore}
        />
      )}

      {page === "login" && (
        <LoginPage onLogin={handleLogin} setPage={setPage} />
      )}

      {page === "register" && (
        <RegisterPage onRegister={handleRegister} setPage={setPage} />
      )}

      {page === "admin" && isAdmin && (
        <AdminPage items={allItems} onDelete={deleteFeedback} />
      )}

      <footer className="border-t border-cream py-8 text-center text-xs text-muted mt-10">
        © 2026 FeedbackHub · Full‑stack portfolio project
      </footer>
    </div>
  );
}
