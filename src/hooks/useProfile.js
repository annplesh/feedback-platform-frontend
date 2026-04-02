import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// useProfile — manages user avatar upload and profile data.
//
// Props:
//   userId        {string}   current user id
//   onAvatarUpdate {function} called after successful avatar upload

export function useProfile(userId, onAvatarUpdate) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  // Fetch avatar URL from profiles table
  async function fetchProfile() {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
    } catch (err) {
      // Profile not found — user has no avatar yet
      console.log("No profile found:", err.message);
    }
  }

  // Upload avatar to Supabase Storage
  async function uploadAvatar(file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be under 2MB");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const url = data.publicUrl;

      // Save URL to profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        avatar_url: url,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      setAvatarUrl(url);

      // Notify parent to refresh feedback cards
      if (onAvatarUpdate) onAvatarUpdate();
    } catch (err) {
      // Log error but don't block the app
      console.error("Avatar upload failed:", err.message);
      setError("Failed to upload avatar. Please try again.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setUploading(false);
    }
  }

  // Delete avatar from Storage and clear profile
  async function deleteAvatar() {
    if (!avatarUrl) return;
    setUploading(true);
    setError(null);
    try {
      const path = avatarUrl.split("/avatars/")[1];
      if (path) {
        const { error: removeError } = await supabase.storage
          .from("avatars")
          .remove([decodeURIComponent(path)]);
        if (removeError) throw removeError;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (profileError) throw profileError;

      setAvatarUrl(null);
      if (onAvatarUpdate) onAvatarUpdate();
    } catch (err) {
      console.error("Avatar delete failed:", err.message);
      setError("Failed to delete avatar. Please try again.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setUploading(false);
    }
  }

  return { avatarUrl, uploading, error, uploadAvatar, deleteAvatar };
}
