export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member';
  isActive: boolean;
  lastLogin?: string;
  jiraAccountId?: string;
  jiraDisplayName?: string;
}

export interface Project {
  id: string;
  name: string;
  jiraProjectKey?: string;
  jiraBoardId?: string;
  jiraServerUrl?: string;
  jiraUsername?: string;
  jiraApiToken?: string;
  jiraConfig?: Record<string, unknown>;
  config?: Record<string, unknown>;
  isActive: boolean;
  ProjectUsers?: ProjectUser[];
}

export interface ProjectUser {
  id: string;
  projectId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  User?: User;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
  status: 'planning' | 'active' | 'completed';
  velocityTarget?: number;
  actualVelocity?: number;
  burndownData?: Record<string, unknown>;
  jiraSprintId?: string;
  UserStories?: UserStory[];
  CapacityPlans?: CapacityPlan[];
}

export interface UserStory {
  id: string;
  title: string;
  description?: string;
  storyPoints?: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'Done';
  assigneeId?: string;
  sprintId?: string;
  projectId: string;
  jiraKey?: string;
  epicKey?: string;
  assignee?: User;
  createdAt?: string;
}

export interface CapacityPlan {
  id: string;
  userId: string;
  sprintId: string;
  availableHours: number;
  allocatedHours: number;
  weeklyCapacity?: WeeklyCapacity[];
  availabilityDays?: Record<string, unknown>;
  User?: User;
  Sprint?: Sprint;
}

export interface WeeklyCapacity {
  week: string;
  holiday: number;
  customer: number;
  internal: number;
  other: number;
}

export interface SprintStatistics {
  sprint: { id: string; name: string; status: string; startDate: string; endDate: string };
  stories: { total: number; totalPoints: number; donePoints: number; inProgressPoints: number; completionRate: number };
  capacity: { totalAvailableHours: number; totalAllocatedHours: number; utilizationRate: number };
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  memberCapacity: { user: User; availableHours: number; allocatedHours: number }[];
}

export interface VelocityData {
  velocity: { sprintId: string; sprintName: string; endDate: string; velocity: number; totalPoints: number; storiesCompleted: number; storiesTotal: number }[];
  averageVelocity: number;
}

export interface DashboardStats {
  totalSprints: { active: number; total: number };
  totalStories: { completed: number; total: number };
  storyPoints: { completed: number; total: number };
  completionRate: number;
  sprintOverview: { activeSprints: number; completedSprints: number; totalSprints: number; averageVelocity: number; successRate: number };
  storyProgress: { totalStoryPoints: number; completedPoints: number; totalStories: number; completedStories: number; storyPointsRate: number };
}

export interface TeamPerformance {
  members: { user: User; velocity: number; completionRate: number; storiesCount: number; doneCount: number }[];
  teamSummary: { topVelocity: number; avgCompletion: number; teamSize: number; totalPoints: number };
}

export interface BurndownData {
  burndownData: Record<string, number> | null;
  idealBurndown: { date: string; remaining: number }[];
  totalPoints: number;
  startDate: string;
  endDate: string;
}

export interface Retrospective {
  id: string;
  sprintId: string;
  projectId: string;
  wentWell: string;
  needsImprovement: string;
  actionItems: { text: string; assigneeId: string; done: boolean }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Forecast {
  avgVelocity: number;
  minVelocity: number;
  maxVelocity: number;
  remainingPoints: number;
  sprintsRemaining: number | null;
  sprintsRemainingBest: number | null;
  sprintsRemainingWorst: number | null;
  estimatedCompletionDate: string | null;
  completedSprintsAnalyzed: number;
  recommendedPoints: number;
  currentSprintCapacity: number | null;
  avgHistoricalCapacity: number | null;
}

export interface SprintComparison {
  current: { sprintId: string; sprintName: string; velocity: number; totalPoints: number; storiesCompleted: number; storiesTotal: number; completionRate: number };
  previous: { sprintId: string; sprintName: string; velocity: number; totalPoints: number; storiesCompleted: number; storiesTotal: number; completionRate: number } | null;
  benchmarks: { averageVelocity: number; bestPerformance: number; sprintCount: number };
}
