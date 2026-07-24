export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Instructor {
  name: string;
  avatarUrl: string;
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
}

export interface UserProfile {
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
  achievements: Achievement[];
}

export interface CreditTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  date: string;
  reference: string;
}
