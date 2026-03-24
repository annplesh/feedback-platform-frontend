import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useFeedback() {
  const [approvedItems, setApprovedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.user_metadata?.role === "admin";

  // Load user session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load approved feedback on mount + subscribe to realtime updates
  useEffect(() => {
    fetchFeedback();
    fetchCategories();

    const channel = supabase
      .channel("feedback-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback" },
        () => fetchFeedback(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Refetch categories when tab becomes active again
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchCategories();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Fetch categories
  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (data) setCategories(data);
  }

  // Fetch approved feedback sorted by date
  async function fetchFeedback() {
    setLoading(true);

    const { data, error } = await supabase
      .from("feedback")
      .select("*, categories(name)")
      .eq("approved", true)
      .order("date", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setApprovedItems(data);
    }

    setLoading(false);
  }

  // Fetch all feedback for admin
  async function fetchAllFeedback() {
    const { data, error } = await supabase
      .from("feedback")
      .select("*, categories(name)")
      .order("date", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAllItems(data);
    }
  }

  // Submit new feedback (auto-approved)
  async function submitFeedback({ name, message, rating, category_id }) {
    const { error } = await supabase.from("feedback").insert([
      {
        name,
        message,
        rating,
        category_id: category_id || null,
        approved: true,
        user_id: user?.id,
        date: new Date().toISOString(), // UTC timestamp
      },
    ]);

    if (error) throw new Error(error.message);
    await fetchFeedback();
  }

  // Approve feedback (admin only)
  async function approveFeedback(id) {
    const { error } = await supabase
      .from("feedback")
      .update({ approved: true })
      .eq("id", id);

    if (error) throw new Error(error.message);
    await fetchAllFeedback();
  }

  // Delete feedback (own or admin)
  async function deleteFeedback(id) {
    const { error } = await supabase.from("feedback").delete().eq("id", id);

    if (error) throw new Error(error.message);
    await fetchFeedback();
    if (isAdmin) await fetchAllFeedback();
  }

  // Sign up
  async function signUp({ email, password }) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
  }

  // Sign in
  async function signIn({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  return {
    approvedItems,
    allItems,
    categories,
    user,
    isAdmin,
    submitFeedback,
    approveFeedback,
    deleteFeedback,
    fetchAllFeedback,
    signUp,
    signIn,
    signOut,
    loading,
    error,
  };
}
