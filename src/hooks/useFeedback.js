import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const PAGE_SIZE = 9;

export function useFeedback() {
  const [approvedItems, setApprovedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
        { event: "INSERT", schema: "public", table: "feedback" },
        () => fetchFeedback(),
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") fetchFeedback(false);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Refetch categories and feedback when tab becomes active again
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchCategories();
        fetchFeedback(false);
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

  // Fetch profiles and merge with feedback items
  async function fetchProfiles(items) {
    const userIds = [...new Set(items.map((i) => i.user_id).filter(Boolean))];
    if (!userIds.length) return items;

    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, avatar_url")
        .in("id", userIds);

      if (!data) return items;

      const profileMap = Object.fromEntries(data.map((p) => [p.id, p]));
      return items.map((item) => ({
        ...item,
        profiles: profileMap[item.user_id] ?? null,
      }));
    } catch (err) {
      // If profiles fetch fails, return items without avatars
      console.error("Failed to fetch profiles:", err.message);
      return items;
    }
  }

  // Fetch approved feedback sorted by date (first page only)
  async function fetchFeedback(showLoading = true) {
    if (showLoading) setLoading(true);

    const { data, error, count } = await supabase
      .from("feedback")
      .select("*, categories(name)", { count: "exact" })
      .eq("approved", true)
      .order("date", { ascending: false })
      .range(0, PAGE_SIZE - 1);

    if (error) {
      setError(error.message);
    } else {
      const itemsWithProfiles = await fetchProfiles(data);
      // Silent refetch: don't replace existing data with empty result
      // (can happen when JWT has expired and token refresh is still in progress)
      if (showLoading || itemsWithProfiles.length > 0) {
        setApprovedItems(itemsWithProfiles);
      }
      setHasMore(data.length < count);
    }

    if (showLoading) setLoading(false);
  }

  // Load next page and append to existing list
  async function loadMore() {
    setIsLoadingMore(true);

    const from = approvedItems.length;
    const { data, error, count } = await supabase
      .from("feedback")
      .select("*, categories(name)", { count: "exact" })
      .eq("approved", true)
      .order("date", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (!error) {
      const itemsWithProfiles = await fetchProfiles(data);
      setApprovedItems((prev) => [...prev, ...itemsWithProfiles]);
      setHasMore(from + data.length < count);
    }

    setIsLoadingMore(false);
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
      const itemsWithProfiles = await fetchProfiles(data);
      setAllItems(itemsWithProfiles);
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
    await fetchFeedback(false);
    if (isAdmin) await fetchAllFeedback();
  }

  // Sign up
  async function signUp({ email, password }) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    // Send welcome email — don't block registration if it fails
    try {
      await supabase.functions.invoke("send-welcome-email", {
        body: { email },
      });
    } catch (err) {
      console.error("Welcome email failed:", err.message);
    }
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
    fetchFeedback,
    submitFeedback,
    approveFeedback,
    deleteFeedback,
    fetchAllFeedback,
    signUp,
    signIn,
    signOut,
    loading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
  };
}
