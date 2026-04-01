# Changelog

All notable changes to FeedbackHub are documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.5.0] — 2026-03-31

### Added

- Groq AI chat widget on WallPage — ask questions about reviews using Llama 3
- Resend email integration — confirmation email via SMTP and welcome email via Edge Function
- Google OAuth — sign in with Google account
- Supabase Edge Functions: `send-welcome-email`, `send-review-confirmation`, `ask-ai`
- CORS headers on all Edge Functions

### Changed

- Navbar Sign Up button removed — available inside Sign In form
- Error message on login simplified to "Invalid email or password."

---

## [0.4.0] — 2026-03-25

### Added

- Supabase Auth — email + password registration and sign in
- Google OAuth support via Supabase provider
- Admin panel for review moderation
- Avatar upload via Supabase Storage with hover effect and fallback initials
- `useProfile.js` hook — avatar management
- `AvatarUpload.jsx` component
- Personalized greeting "Hi, [name]!" in Navbar after first review
- Personalized success screen "Thank you, [name]!"
- "View all reviews" button on success screen
- Toast notification after review deletion
- Skeleton loading state on WallPage
- Delete button on own reviews for authenticated users
- RLS policies for data protection

### Changed

- Navbar — email replaced with avatar dropdown (Admin Panel, Sign Out)
- Sign In/Sign Up buttons highlight active page
- WallPage redirects to Sign In when unauthenticated user clicks "Leave a Review"

### Fixed

- Smooth delete UX — no loading flash, single toast notification
- Redirect to WallPage after sign out

---

## [0.3.0] — 2026-03-20

### Added

- `categories` table in Supabase with seed data (Service, Quality, Delivery, General)
- `category_id` foreign key on `feedback` table — one-to-many relation
- `CategorySelect` — custom dropdown component replacing native select
- Category badge on `FeedbackCard`
- Skeleton placeholder for category field while loading
- Refetch on tab visibility change to fix disappearing data bug

### Changed

- Mobile adaptation 375–430px fully tested
- Sort filter buttons styled consistently
- Focus outline removed on all interactive elements

---

## [0.2.0] — 2026-03-15

### Added

- Supabase database integration — replaced mock data
- `feedback` table with fields: id, name, message, rating, approved, date
- Realtime updates via Supabase `postgres_changes`
- `supabaseClient.js` — Supabase client setup
- `.env` + `.env.example` for environment variables

### Removed

- `mockFeedback.js` — hardcoded seed data
- In-memory state — all data persisted in Supabase

---

## [0.1.0] — 2026-03-10

### Added

- Initial frontend — Submit Feedback and Feedback Wall pages
- `useFeedback.js` hook with mock data
- `StarRating` component — interactive input and read-only display modes
- `FeedbackCard` component with initials avatar and stagger animation
- `CategorySelect` custom dropdown
- Form validation — name, message, rating
- Character counter (max 300)
- Sort controls — newest, oldest, highest rated, lowest rated
- Summary stats — total reviews and average rating
- Responsive grid — 1 → 2 → 3 columns
- Empty state handling
- Page transition animations
- Tailwind custom colors and fonts (Cormorant Garamond + Outfit)
