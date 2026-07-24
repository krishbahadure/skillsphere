import { create } from 'zustand';
import type { Course, Contribution, UserProfile, CreditTransaction } from '../types';
import { mockCourses, mockContributions, mockUser, mockCreditTransactions } from '../data/mockData';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // User
  user: UserProfile;
  setUser: (u: Partial<UserProfile>) => void;

  // Courses
  courses: Course[];
  toggleBookmark: (id: string) => void;
  addCourse: (c: Course) => void;

  // Contributions
  contributions: Contribution[];
  applyToContribution: (id: string) => void;
  addContribution: (c: Contribution) => void;

  // Credits
  creditBalance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: CreditTransaction[];

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  user: mockUser,
  setUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),

  courses: mockCourses,
  toggleBookmark: (id) =>
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === id ? { ...c, bookmarked: !c.bookmarked } : c
      ),
    })),
  addCourse: (c) =>
    set((s) => ({
      courses: [c, ...s.courses],
      user: { ...s.user, coursesCreated: s.user.coursesCreated + 1 },
    })),

  contributions: mockContributions,
  applyToContribution: (id) =>
    set((s) => ({
      contributions: s.contributions.map((c) =>
        c.id === id ? { ...c, applied: !c.applied, applicantsCount: c.applied ? c.applicantsCount - 1 : c.applicantsCount + 1 } : c
      ),
    })),
  addContribution: (c) =>
    set((s) => ({
      contributions: [c, ...s.contributions],
      user: { ...s.user, contributionsPosted: s.user.contributionsPosted + 1 },
    })),

  creditBalance: mockUser.creditsEarned - mockCreditTransactions.filter(t => t.type === 'spent').reduce((acc, t) => acc + t.amount, 0),
  totalEarned: mockCreditTransactions.filter(t => t.type === 'earned').reduce((acc, t) => acc + t.amount, 0),
  totalSpent: mockCreditTransactions.filter(t => t.type === 'spent').reduce((acc, t) => acc + t.amount, 0),
  transactions: mockCreditTransactions,

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
