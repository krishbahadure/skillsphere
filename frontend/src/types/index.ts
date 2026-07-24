export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Instructor {
  name: string;
  avatarUrl: string;
}

export interface CourseReview {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  category: string;
  difficulty: Difficulty;
  instructor: Instructor;
  durationMins: number;
  studentsCount: number;
  creditCost: number;
  rating: number;
  bookmarked: boolean;
  // Optional rich detail fields (populated for course detail modal)
  description?: string;
  tags?: string[];
  prerequisites?: string[];
  skillsLearned?: string[];
  curriculum?: CourseModule[];
  instructorBio?: string;
  reviews?: CourseReview[];
}


export interface Contribution {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  creditsOffered: number;
  deadline: string;
  postedBy: { name: string; avatarUrl: string };
  applicantsCount: number;
  applied?: boolean;
}

export interface Achievement {
  title: string;
  icon: string;
  description?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface RecentActivity {
  id: string;
  type: 'course_published' | 'course_enrolled' | 'contribution_posted' | 'task_completed' | 'credit_earned' | 'badge_unlocked';
  title: string;
  description: string;
  date: string;
  icon: string;
}

export interface Notification {
  id: string;
  type: 'credit' | 'enrollment' | 'contribution' | 'badge' | 'follow';
  message: string;
  time: string;
  read: boolean;
  avatarUrl?: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  coverUrl: string;
  college: string;
  department: string;
  year: string;
  skills: string[];
  interests: string[];
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  instagram?: string;
  location: string;
  coursesCreated: number;
  coursesEnrolled: number;
  contributionsPosted: number;
  tasksCompleted: number;
  creditsEarned: number;
  rank: string;
  level: number;
  levelTitle: string;
  isVerifiedCreator: boolean;
  memberSince: string;
  followers: number;
  following: number;
  achievements: Achievement[];
  certificates: Certificate[];
  recentActivity: RecentActivity[];
  notifications: Notification[];
  learningStreakDays: number;
  preferredCategories: string[];
  themePreference: 'light' | 'dark' | 'system';
}

export interface CreditTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  date: string;
  reference: string;
}
