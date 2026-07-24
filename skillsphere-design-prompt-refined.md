# SkillSphere — Frontend Build Prompt (Refined)

You are a Senior Product Designer + Frontend Engineer. Build a production-quality frontend for **SkillSphere**, a student-powered platform where students learn from courses uploaded by other students, publish their own courses, and earn credits by completing contribution tasks posted by peers.

Target quality bar: Linear, Framer, Stripe, Arc Browser, Vercel. This is a portfolio/demo-grade frontend, not a college project. **Frontend only — no backend, no auth logic, no database. Use realistic mock data held in React state/context.**

---

## 1. Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (animations/page transitions)
- React Router v6 (routes below)
- Lucide React (icons)
- Zustand or React Context for mock app state (bookmarks, applications, mock "logged in" user) — no persistence needed unless you note otherwise; skip `localStorage`/`sessionStorage` if this runs inside a Claude.ai artifact
- Component-based architecture, one component per file, colocate types

### Routes
```
/                  → Landing
/login             → Login
/register          → Register
/profile-setup     → Profile Setup (only reachable after register)
/app               → Dashboard shell (persistent sidebar + topbar)
  /app/courses          → Courses feed (default child route)
  /app/contributions     → Contributions board
  /app/credits            → Credits page
  /app/profile            → Profile page
  /app/settings            → Settings (basic, low priority)
```
Use a mock "auth" boolean in context to gate `/app/*` — no real auth, just enough to enforce Landing → Login → Register → Profile Setup → Dashboard as the only path in.

---

## 2. Design Tokens (use these exactly — don't leave "bright lime" to interpretation)

**Colors**
| Token | Hex | Use |
|---|---|---|
| Primary (Lime) | `#C6FF3D` | Primary CTAs, active states, highlights |
| Primary Text-on-Lime | `#0B0B0B` | Text/icons placed on lime (never white — fails contrast) |
| Accent (Electric Blue) | `#3D5CFF` | Secondary actions, links, badges |
| Background | `#FFFFFF` | Page background |
| Surface / Card | `#FFFFFF` | Cards, on subtle `#FAFAFA` page backgrounds where needed |
| Text Primary | `#0A0A0A` | Headlines, body |
| Text Secondary | `#6B6B6B` | Metadata, captions |
| Border | `#EAEAEA` | Card borders, dividers |
| Success / Credits | `#22C55E` | Credit-related positive states |

Use gradients only as subtle accents (e.g. a soft lime→blue radial glow behind hero content) — never as full-section backgrounds.

**Typography**
- Display/headings: **General Sans** or **Clash Display** (Fontshare), 600–700 weight
- Body/UI: **Inter**, 400–500 weight
- Scale: `12 / 14 / 16 / 18 / 24 / 32 / 48 / 64px`, line-height 1.1 for display, 1.5 for body
- Max line length for body copy: ~65ch

**Spacing** — 4px base scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`

**Radius** — Cards `20px`, Buttons/Inputs `12px`, Badges/Pills `999px` (full)

**Shadow** — `0 1px 2px rgba(0,0,0,0.04), 0 12px 24px -8px rgba(0,0,0,0.10)` as the default "floating card" shadow; increase blur/spread by ~30% on hover, don't change color.

**Motion**
- Hover lift: `translateY(-4px)`, `160–200ms`, `ease-out`
- Page transitions: fade + `12px` slide, `250–300ms`
- List/grid entrance: stagger children `40–60ms` apart
- Buttons: scale `0.97` on press, spring-based (`framer-motion` `type: "spring", stiffness: 400, damping: 25`)
- Respect `prefers-reduced-motion`

**Breakpoints** — Mobile `<640px` (1 col), Tablet `640–1023px` (2 col), Desktop `≥1024px` (4 col), matching Tailwind `sm/md/lg`.

---

## 3. Mock Data Schema

Generate realistic seed data at this volume — not 3 placeholder items:

```ts
type Course = {
  id: string;
  title: string;
  thumbnailUrl: string; // use a placeholder image service, e.g. picsum.photos or unsplash source
  category: string; // e.g. "Design", "Web Dev", "Data Science", "Marketing", "Finance", "Languages"
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructor: { name: string; avatarUrl: string };
  durationMins: number;
  studentsCount: number;
  creditCost: number;
  rating: number; // 3.8–5.0
  bookmarked: boolean;
};

type Contribution = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  creditsOffered: number;
  deadline: string; // ISO date
  postedBy: { name: string; avatarUrl: string };
  applicantsCount: number;
};

type UserProfile = {
  name: string;
  avatarUrl: string;
  coverUrl: string;
  college: string;
  department: string;
  year: string;
  skills: string[];
  bio: string;
  coursesCreated: number;
  contributionsPosted: number;
  creditsEarned: number;
  rank: string;
  achievements: { title: string; icon: string }[];
};
```

- Seed **14–16 courses** across at least **6 categories**
- Seed **8–10 contributions**
- Seed **1 mock current user** with realistic profile data
- All interactions (bookmark, apply, publish course, post contribution) should update in-memory state so the UI feels functional, even with no backend

---

## 4. Page Specs

### Landing (`/`)
- Fixed nav: Logo · Features · About · Login · **Get Started** (primary button)
- Hero: large display headline (3 lines, e.g. "Learn. Build. Earn." — or write something equally punchy but original), one-sentence subhead explaining the value prop, primary CTA "Get Started" + secondary "Explore Courses"
- Right side of hero: a floating stack of 2–3 mock UI cards (course card, credit badge, avatar cluster) with subtle parallax/float animation — no stock illustrations
- Sections below fold, in order: **Features** (3–4 cards) → **How It Works** (3-step flow) → **Community/Stats** (animated counters) → **Testimonials** (3 cards) → **Footer**

### Login / Register
- Centered card, max-width ~420px, on a subtle lime/blue gradient-glow background
- Login: Email, Password, primary Login button, "Continue with Google" secondary button, link to Register
- Register: Name, Email, Password, Confirm Password, primary Create Account button
- Inputs: 12px radius, 1px border `#EAEAEA`, focus ring in Electric Blue

### Profile Setup (`/profile-setup`)
- Multi-field single form (avatar upload placeholder, Full Name, College, Department, Year dropdown, Skills — tag/chip input, Bio — textarea)
- "Save & Continue" → routes to `/app/courses`

### Dashboard Shell (`/app`)
- **Topbar** (fixed): Logo left · centered search bar with placeholder "Search courses..." · Notifications icon + Avatar right
- **Sidebar** (collapsible, icon+label, Linear/Notion-style): Home, Courses, Contributions, Credits, Profile, Settings
- Search bar: on focus/typing, show dropdown with 4 sections — Matching Courses, Popular Searches, Recent Searches, Suggested Categories (mock filtering against seed data)

### Courses Feed (`/app/courses`) — most important screen, spend the most effort here
- Responsive grid: 4 col desktop / 2 col tablet / 1 col mobile, infinite scroll (mock — load more from seed pool, loop if needed)
- Card contents: 16:9 thumbnail, category badge (top-left overlay), difficulty badge, title (2-line clamp), instructor avatar + name, duration, student count, credit cost badge, bookmark toggle (top-right overlay), hover: lift + shadow growth + slight thumbnail zoom
- Image-first, no tables/lists
- Skeleton loading state for initial grid load (shimmer, matches card shape)
- Empty/filtered-empty state design included

### Contributions Board (`/app/contributions`)
- Distinct visual treatment from Courses — this is an opportunity board, not a media grid. Consider a 2–3 column card layout rather than a dense media grid.
- Card contents: Task title, description (2–3 line clamp), required skills as chips, credits offered (prominent, lime badge), deadline (with urgency color if <3 days), posted-by avatar+name, Apply button (state changes to "Applied" on click)

### Floating Action Button
- Persistent circular lime FAB, bottom-right, all `/app/*` pages, scale/rotate micro-interaction on hover
- On Courses: opens "Publish Course" modal (Thumbnail upload, Title, Category select, Difficulty select, Description, Lessons count, Duration, Publish → prepends to feed with entrance animation)
- On Contributions: opens "Post Contribution" modal (Title, Description, Required Skills, Credits Offered, Deadline, Attachments, Publish → prepends to board)
- Modal: centered, backdrop blur, slide-up entrance, focus-trapped

### Credits (`/app/credits`)
- Summary cards: Total Credits, Earned, Spent, Current Rank
- Weekly progress — simple chart placeholder (bar or line, mock data, use Recharts if available)
- Recent Activity — timeline/list of mock transactions (earned/spent, with course or contribution reference)

### Profile (`/app/profile`)
- Large cover banner + avatar overlapping, name/college/department below
- Bio, skills as chips
- Stats row: Courses Created / Contributions Posted / Credits Earned
- Achievements/Badges grid, Certificates section (card-based)

---

## 5. Accessibility & Quality Bar
- Semantic HTML, `aria-label`s on icon-only buttons, alt text on all images
- Keyboard-navigable modals and dropdowns, visible focus states in Electric Blue
- Verify text-on-lime always uses `#0B0B0B`, not white
- Every interactive element has a hover *and* focus state, not just hover

## 6. Hard Constraints (don't violate)
- No admin dashboard, no Bootstrap/generic LMS look, no literal YouTube/Udemy/Coursera clone
- No tables or plain lists for Courses/Contributions — card-based, image-first only
- No auth/backend/database logic — mock everything in state
- Don't skip the Landing → Login → Register → Profile Setup → Dashboard flow — no direct dashboard entry

## 7. Build Order (do this sequentially, don't generate everything at once)
1. Design tokens (Tailwind config: colors, radius, shadow, font)
2. Mock data + Zustand/Context store
3. Dashboard shell (topbar + sidebar + routing)
4. Courses feed (highest priority screen)
5. Contribution board + both FAB modals
6. Credits + Profile pages
7. Landing, Login, Register, Profile Setup
8. Pass over the whole app for animation/hover polish and empty/loading states

---

**How to use this:** paste this whole document as your initial prompt into Claude Code, Cursor, v0, bolt.new, or similar. If you tell me which tool you're using, I can tailor formatting further (e.g. some tools do better with the build order split into separate follow-up prompts rather than one big spec).
