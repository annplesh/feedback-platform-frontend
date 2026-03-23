import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useFeedback() {
  const [approvedItems, setApprovedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Submit new feedback (auto-approved)
  async function submitFeedback({ name, message, rating, category_id }) {
    const { error } = await supabase.from("feedback").insert([
      {
        name,
        message,
        rating,
        category_id: category_id || null,
        approved: true,
        date: new Date().toISOString(), // UTC timestamp
      },
    ]);

    if (error) throw new Error(error.message);

    await fetchFeedback();
  }

  return { approvedItems, categories, submitFeedback, loading, error };
}
