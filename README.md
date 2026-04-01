# FeedbackHub

A full-stack feedback platform built with React, Vite, Tailwind CSS and Supabase. Users can submit reviews with a name, message, star rating and category. Approved entries are displayed on a public wall with sorting, stats and AI-powered analysis.

Built as a portfolio project to demonstrate full-stack development, authentication, third-party integrations and UI design.

---

## Tech Stack

- **React 18** — UI and state management
- **Vite** — dev server and build tool
- **Tailwind CSS 3** — utility-first styling
- **Supabase** — database, auth, realtime, storage, edge functions
- **Resend** — transactional email
- **Groq AI** — review analysis powered by Llama 3
- **Google OAuth** — social authentication
- **Google Fonts** — Cormorant Garamond + Outfit

---

## Features

- Submit feedback form with validation (name, message, star rating, category)
- Character counter and inline field errors
- Custom category dropdown selector
- Thank-you confirmation screen with personalized greeting
- Public feedback wall with sort controls (newest, oldest, highest, lowest rated)
- Summary stats: total reviews and average rating
- AI-powered review analysis — ask questions about reviews using Groq + Llama 3
- User authentication — email/password and Google OAuth
- Avatar upload with hover effect and fallback initials
- Admin panel for review moderation
- Toast notifications for actions
- Skeleton loading states
- Staggered card reveal animations
- Responsive layout (1 → 2 → 3 column grid)
- Realtime updates via Supabase channels

---

## Project Structure

```
feedback-platform/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                          # Local env vars (gitignored)
├── .env.example                  # Template for env vars
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── supabaseClient.js
    ├── hooks/
    │   ├── useFeedback.js        # Feedback state, auth, realtime
    │   └── useProfile.js         # Avatar upload and profile data
    ├── components/
    │   ├── Navbar.jsx            # Top bar with avatar dropdown
    │   ├── StarRating.jsx        # Input + display modes
    │   ├── FeedbackCard.jsx      # Review card with avatar
    │   ├── CategorySelect.jsx    # Custom dropdown
    │   ├── AvatarUpload.jsx      # Avatar with hover effect
    │   └── AskAI.jsx             # AI chat widget
    └── pages/
        ├── SubmitPage.jsx        # Review submission form
        ├── WallPage.jsx          # Public review wall
        ├── LoginPage.jsx         # Sign in with email or Google
        ├── RegisterPage.jsx      # Sign up with email or Google
        └── AdminPage.jsx         # Moderation panel
```

---

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Create `.env` in project root:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> `.env` is listed in `.gitignore` and never committed. See `.env.example` for reference.

### 3. Supabase setup

Run in Supabase SQL Editor:

```sql
-- Categories table
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- Feedback table
create table feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2),
  message text not null check (char_length(message) >= 10 and char_length(message) <= 300),
  rating integer not null check (rating >= 1 and rating <= 5),
  approved boolean not null default true,
  date timestamptz not null default now(),
  category_id uuid references categories(id),
  user_id uuid references auth.users(id)
);

-- Profiles table for avatars
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Seed categories
insert into categories (name) values
  ('Service'), ('Quality'), ('Delivery'), ('General');
```

### 4. Start development server

```bash
npm run dev
```

Open http://localhost:5173

---

## Database Schema

### Tables

**`categories`** — review categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY, default gen_random_uuid() |
| name | text | NOT NULL, UNIQUE |

**`feedback`** — user reviews
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY, default gen_random_uuid() |
| name | text | NOT NULL, min 2 chars |
| message | text | NOT NULL, 10–300 chars |
| rating | integer | NOT NULL, 1–5 |
| approved | boolean | NOT NULL, default true |
| date | timestamptz | NOT NULL, default now() |
| category_id | uuid | FK → categories(id) |
| user_id | uuid | FK → auth.users(id) |

**`profiles`** — user avatar URLs
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY, FK → auth.users(id) |
| avatar_url | text | nullable |
| updated_at | timestamptz | default now() |

### Relations

- One `categories` → many `feedback` (один ко многим)
- One `auth.users` → many `feedback` (один ко многим)
- One `auth.users` → one `profiles` (один к одному)

### RLS Policies

- Public can read approved feedback and all categories
- Authenticated users can insert feedback with their `user_id`
- Users can delete only their own feedback
- Admin (via `user_metadata.role`) can read all feedback and delete any

## Integrations

### Supabase Storage (Avatars)

- Bucket: `avatars` (public)
- Users upload JPG/PNG/WebP up to 2MB
- Avatar URL stored in `profiles` table
- Fallback to initials if no avatar

### Resend (Email)

- Confirmation email on registration via Supabase SMTP
- Welcome email via Edge Function `send-welcome-email`
- `RESEND_API_KEY` stored in Supabase Secrets only

### Groq AI (Review Analysis)

- Edge Function `ask-ai` — loads reviews from Supabase, sends to Groq API
- Model: `llama-3.1-8b-instant`
- `GROQ_API_KEY` stored in Supabase Secrets only
- Graceful error handling — app works if AI is unavailable

### Google OAuth

- Configured via Supabase Auth → Google provider
- Redirect URI: `https://[project-ref].supabase.co/auth/v1/callback`

---

## Security

- Client keys in `.env` (gitignored)
- Server keys (Resend, Groq) in Supabase Secrets — never in frontend code
- RLS policies on all tables
- Users can only delete their own reviews
- Admin role via `user_metadata.role`

---

## Authentication

### Email + Password

- Registration and sign in via Supabase Auth
- Email confirmation sent via Resend SMTP
- Welcome email sent via Edge Function after registration
- Minimum 6 characters for password
- Frontend validation with inline error highlighting

### Google OAuth

- One-click sign in with Google account
- Configured via Supabase Auth → Google provider
- No additional password required

### Roles

- **user** — can submit and delete own reviews
- **admin** — can delete any review, access admin panel
- Admin role set via `user_metadata.role` in Supabase Dashboard

### Protected Routes

- WallPage — public, no auth required
- SubmitPage — requires auth, shows sign in prompt for guests
- AdminPage — requires admin role

### RLS Policies

```sql
-- Public reads approved feedback
create policy "Public reads approved" on feedback
for select using (approved = true);

-- Admin reads all feedback
create policy "Admin reads all" on feedback
for select using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Authenticated users can insert own feedback
create policy "Authenticated can insert" on feedback
for insert with check (auth.uid() = user_id);

-- Users can delete own feedback
create policy "User can delete own" on feedback
for delete using (auth.uid() = user_id);

-- Admin can delete any feedback
create policy "Admin can delete any" on feedback
for delete using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
```

## Build

```bash
npm run build
npm run preview
```
