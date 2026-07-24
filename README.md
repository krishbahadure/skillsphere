# SkillSphere

Student-powered peer learning platform built with React 18, TypeScript, Tailwind CSS, and Framer Motion.

## 📁 Project Structure

```
skillsphere/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Topbar, Sidebar, FAB, Modals
│   │   │   └── ui/           # CourseCard, ContributionCard, Modal, Skeleton, PageTransition
│   │   ├── data/             # Mock data (courses, contributions, profile, transactions)
│   │   ├── pages/
│   │   │   ├── app/          # Dashboard, Courses, Contributions, Credits, Profile, Settings
│   │   │   ├── Landing.tsx   # Landing page
│   │   │   ├── Login.tsx     # Login screen
│   │   │   ├── Register.tsx  # Registration screen
│   │   │   └── ProfileSetup.tsx # Onboarding form
│   │   ├── store/            # Zustand global state
│   │   ├── types/            # TypeScript models
│   │   ├── App.tsx           # Main App & router setup
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets & favicon
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🚀 How to Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Install Dependencies
Navigate to the `frontend` folder and install dependencies:
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
```
