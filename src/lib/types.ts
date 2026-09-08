export type UserRole = 'APPLICANT' | 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'SUSPENDED' | 'WITHDRAWN';

export interface User {
  id: string;
  email: string;
  name: string;
  whatsappNumber?: string;
  timezone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CLARIFICATION_REQUIRED' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  whatsappNumber: string;
  timezone: string;
  currentTechStatus: string;
  primaryAreaOfInterest: string;
  dailyLearningCapacity: string;
  whyAccountabilityNow: string;
  dailyReportsCommitment: boolean;
  saturdayCallCommitment: boolean;
  emergencyPassAcceptance: boolean;
  disciplinePlan: string;
  reflectionAnswer?: string;
  score: number;
  status: ApplicationStatus;
  reviewerNotes?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  weeklyObjectiveId?: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  status: 'PLANNED' | 'TODAY' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'RESCHEDULED' | 'MISSED' | 'CANCELLED';
  completedAt?: string;
}

export interface WeeklyObjective {
  id: string;
  milestoneId: string;
  title: string;
  status: 'PLANNED' | 'COMPLETED';
  tasks: Task[];
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  order: number;
  weeklyObjectives: WeeklyObjective[];
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  targetDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  milestones: Milestone[];
}

export interface CheckIn {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completionStatus: 'YES' | 'PARTIAL' | 'NO' | 'EMERGENCY_PASS';
  learnings: string;
  completedWork: string;
  learningTimeMinutes: number;
  blockers?: string;
  nextPriority?: string;
  createdAt: string;
}

export interface EmergencyPass {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  usedAt: string;
  reason?: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  provider: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  whyRecommended?: string;
  cost: string;
  active: boolean;
  isIntroVideo: boolean;
  youtubeId?: string;
}

export interface WeeklyReport {
  userId: string;
  userName: string;
  weeklyObjective: string;
  tasksPlanned: number;
  tasksCompleted: number;
  completionRate: number;
  checkInsCount: number;
  totalLearningMinutes: number;
  currentStreak: number;
  mainBlocker: string;
  milestoneProgress: string;
  nextWeekObjective: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  objectType: string;
  objectId: string;
  timestamp: string;
  metadata?: string;
}
