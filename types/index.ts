export interface Quest {
  id: string;
  title: string;
  category: QuestCategory;
  description: string;
  status: QuestStatus;
  exp: number;
  dateCreated: string;
  dateCompleted: string | null;
  priority: QuestPriority;
  mood?: MoodType;
}

export type QuestStatus = 'pending' | 'in-progress' | 'completed';
export type QuestCategory = 'Belajar' | 'Kerja' | 'Kesehatan' | 'Sosial' | 'Hobi' | 'Rumah' | 'Lainnya';
export type QuestPriority = 'low' | 'medium' | 'high';
export type MoodType = '😊' | '😐' | '😔' | '🤔' | '😴' | '🔥' | '💪' | '🎯';

export interface User {
  exp: number;
  level: number;
  totalQuestsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  // ISO date string for the last day the user completed at least one quest
  lastCompletionDate?: string | null;
  motivationMode: MotivationMode;
  dailyGoal: number;
  weeklyGoal: number;
  achievements: Achievement[];
  moodHistory: MoodEntry[];
}

export type MotivationMode = 'warrior' | 'healer' | 'rogue';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'productivity' | 'consistency' | 'milestone' | 'special';
}

export interface MoodEntry {
  date: string;
  mood: MoodType;
  questId: string;
  questTitle: string;
}

export interface DailyStats {
  date: string;
  questsCompleted: number;
  expGained: number;
  mood: MoodType | null;
}

export interface WeeklyStats {
  weekStart: string;
  totalQuests: number;
  completedQuests: number;
  totalExp: number;
  averageMood: number;
  streakDays: number;
}

export interface QuestFilter {
  status?: QuestStatus;
  category?: QuestCategory;
  search?: string;
}

export interface LevelInfo {
  currentLevel: number;
  currentExp: number;
  expToNext: number;
  progressPercentage: number;
}
