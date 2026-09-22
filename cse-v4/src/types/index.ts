
export type Role = 'tutor' | 'learner';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SessionStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  bio?: string;
  profileImage?: string;
  averageRating?: number;
  totalSessions?: number;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface Skill {
  _id: string;
  name: string;
  skillName: string;
  description: string;
  level: SkillLevel;
  tutor: User;
  averageRating?: number;
  totalSessions?: number;
  isSaved?: boolean;
}

export interface Review {
  _id: string;
  rating: number;
  feedback: string;
  learner: User;
  skill: { skillName: string; };
  createdAt: string;
}

export interface TutorProfile {
  _id: string;
  name: string;
  email: string;
  averageRating: number;
  totalSessions: number;
  skills: Skill[];
  reviews: Review[];
}

export interface Session {
  _id: string;
  skill: Skill;
  tutor: User;
  learner: User;

  status: SessionStatus;

  rating?: number;
  feedback?: string;

  createdAt: string;
  requestedAt: string;
  rejectedAt?: string;
  acceptedAt?: string;
  completedAt?: string;
  updatedAt?: string;
}

export interface SearchFilters {
  name?: string;
  level?: SkillLevel | '';
  minRating?: number;
  sortBy?: string;
}

export interface ApiError {
  message: string;
}

export interface Notification {
  _id: string;

  title: string;

  message: string;

  type:
  | "session_request"
  | "session_accepted"
  | "session_rejected"
  | "review_received";

  isRead: boolean;

  link: string;

  createdAt: string;

  sender: {
    _id: string;
    name: string;
    profileImage?: string;
  };
}
