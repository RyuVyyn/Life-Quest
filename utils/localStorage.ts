import { Quest, User, Achievement, MoodEntry, DailyStats, WeeklyStats, MotivationMode } from '@/types';

const STORAGE_KEYS = {
  QUESTS: 'lifeQuestData',
  USER: 'lifeQuestUser',
  ACHIEVEMENTS: 'lifeQuestAchievements',
  MOOD_HISTORY: 'lifeQuestMoodHistory',
  DAILY_STATS: 'lifeQuestDailyStats',
  WEEKLY_STATS: 'lifeQuestWeeklyStats',
} as const;

// Custom event system for real-time updates
const dispatchQuestUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('questUpdated'));
  }
};

const dispatchUserUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userUpdated'));
  }
};

const dispatchAchievementUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('achievementUpdated'));
  }
};

const dispatchMoodUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('moodUpdated'));
  }
};

// Quest CRUD Operations
export const questStorage = {
  getAll: (): Quest[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
    return data ? JSON.parse(data) : [];
  },

  save: (quest: Quest): void => {
    if (typeof window === 'undefined') return;
    const quests = questStorage.getAll();
    const existingIndex = quests.findIndex(q => q.id === quest.id);
    
    if (existingIndex >= 0) {
      quests[existingIndex] = quest;
    } else {
      quests.push(quest);
    }
    
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    dispatchQuestUpdate();
  },

  delete: (id: string): void => {
    if (typeof window === 'undefined') return;
    const quests = questStorage.getAll();
    const filteredQuests = quests.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(filteredQuests));
    
    // Also clean up mood history for this quest
    moodStorage.removeQuestMoodHistory(id);
    
    // Dispatch both quest and mood updates
    dispatchQuestUpdate();
    dispatchMoodUpdate();
  },

  getById: (id: string): Quest | null => {
    const quests = questStorage.getAll();
    return quests.find(q => q.id === id) || null;
  },

  updateStatus: (id: string, status: Quest['status']): void => {
    const quest = questStorage.getById(id);
    if (quest) {
      quest.status = status;
      if (status === 'completed') {
        quest.dateCompleted = new Date().toISOString().split('T')[0];
      }
      questStorage.save(quest);
    }
  },

  updateMood: (id: string, mood: Quest['mood']): void => {
    const quest = questStorage.getById(id);
    if (quest) {
      quest.mood = mood;
      questStorage.save(quest);
    }
  }
};

// User Data Operations
export const userStorage = {
  get: (): User => {
    if (typeof window === 'undefined') {
      return {
        exp: 0,
        level: 1,
        totalQuestsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletionDate: null,
        motivationMode: 'warrior',
        dailyGoal: 3,
        weeklyGoal: 15,
        achievements: [],
        moodHistory: []
      };
    }
    
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) {
      const defaultUser = {
        exp: 0,
        level: 1,
        totalQuestsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletionDate: null,
        motivationMode: 'warrior' as MotivationMode,
        dailyGoal: 3,
        weeklyGoal: 15,
        achievements: [],
        moodHistory: []
      };
      userStorage.save(defaultUser);
      return defaultUser;
    }
    
    return JSON.parse(data);
  },

  save: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    dispatchUserUpdate();
  },

  addExp: (exp: number): User => {
    const user = userStorage.get();
    user.exp += exp;
    
    // Check for level up
    const newLevel = calculateLevel(user.exp);
    if (newLevel > user.level) {
      user.level = newLevel;
      // Trigger level up achievement
      achievementStorage.unlock('level_up', `Level ${newLevel} Achieved!`);
    }
    
    userStorage.save(user);
    return user;
  },

  completeQuest: (): User => {
    const user = userStorage.get();

    // Always increment total completed quests
    user.totalQuestsCompleted = (user.totalQuestsCompleted || 0) + 1;

    // Use local timezone-aware date strings
    const today = toLocalDateString(new Date());

    // If we've already counted a completion for today, don't modify the streak
    if (user.lastCompletionDate === today) {
      userStorage.save(user);
      return user;
    }

    // Determine yesterday's date string in local time
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toLocalDateString(yesterday);

    // If lastCompletionDate was yesterday, this is a consecutive day -> increment streak
    if (user.lastCompletionDate === yesterdayStr) {
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else {
      // Otherwise start a new streak with 1 (today)
      user.currentStreak = 1;
    }

    // Update last completion day to local date
    user.lastCompletionDate = today;

    // Update longest streak if needed
    if ((user.currentStreak || 0) > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }

    userStorage.save(user);
    return user;
  },

  resetStreak: (): User => {
    const user = userStorage.get();
    user.currentStreak = 0;
    userStorage.save(user);
    return user;
  },

  updateMotivationMode: (mode: User['motivationMode']): User => {
    const user = userStorage.get();
    user.motivationMode = mode;
    userStorage.save(user);
    return user;
  },

  updateGoals: (dailyGoal: number, weeklyGoal: number): User => {
    const user = userStorage.get();
    user.dailyGoal = dailyGoal;
    user.weeklyGoal = weeklyGoal;
    userStorage.save(user);
    return user;
  }
  ,
  // Remove EXP and decrement completed quests when a completed quest is deleted
  removeCompletedQuest: (exp: number): User => {
    const user = userStorage.get();
    user.exp = Math.max(0, user.exp - exp);
    user.totalQuestsCompleted = Math.max(0, (user.totalQuestsCompleted || 0) - 1);
    // Recalculate level after subtraction
    const newLevel = calculateLevel(user.exp);
    user.level = newLevel;
    userStorage.save(user);
    return user;
  }
  ,
  // Subtract EXP without changing completed count (used when editing an already completed quest)
  subtractExp: (exp: number): User => {
    const user = userStorage.get();
    user.exp = Math.max(0, user.exp - exp);
    const newLevel = calculateLevel(user.exp);
    user.level = newLevel;
    userStorage.save(user);
    return user;
  }
};

// Achievement System
export const achievementStorage = {
  getAll: (): Achievement[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  },

  unlock: (achievementId: string, name: string): Achievement | null => {
    const achievements = achievementStorage.getAll();
    const existing = achievements.find(a => a.id === achievementId);
    
    if (existing) return null;
    
    const newAchievement: Achievement = {
      id: achievementId,
      name,
      description: getAchievementDescription(achievementId),
      icon: getAchievementIcon(achievementId),
      unlockedAt: new Date().toISOString(),
      category: getAchievementCategory(achievementId)
    };
    
    achievements.push(newAchievement);
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    
    // Update user achievements
    const user = userStorage.get();
    user.achievements.push(newAchievement);
    userStorage.save(user);
    
    // Dispatch achievement update event
    dispatchAchievementUpdate();
    
    return newAchievement;
  },

  checkAchievements: (): void => {
    const user = userStorage.get();
    const quests = questStorage.getAll();
    
    // Check various achievement conditions
    if (user.totalQuestsCompleted >= 10 && !user.achievements.find(a => a.id === 'first_10')) {
      achievementStorage.unlock('first_10', 'Quest Novice');
    }
    
    if (user.currentStreak >= 7 && !user.achievements.find(a => a.id === 'week_streak')) {
      achievementStorage.unlock('week_streak', 'Consistency Master');
    }
    
    if (user.level >= 5 && !user.achievements.find(a => a.id === 'level_5')) {
      achievementStorage.unlock('level_5', 'Rising Star');
    }
    
    // Check category-specific achievements
    const categories = quests.map(q => q.category);
  const uniqueCategories = Array.from(new Set(categories));
    if (uniqueCategories.length >= 5 && !user.achievements.find(a => a.id === 'diverse_quests')) {
      achievementStorage.unlock('diverse_quests', 'Quest Explorer');
    }
  }
};

// Mood Tracking
export const moodStorage = {
  addEntry: (questId: string, questTitle: string, mood: Quest['mood']): void => {
    if (!mood) return;
    
    const entry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood,
      questId,
      questTitle
    };
    
    const user = userStorage.get();
    user.moodHistory.push(entry);
    userStorage.save(user);
    
    // Dispatch mood update event
    dispatchMoodUpdate();
  },

  getHistory: (): MoodEntry[] => {
    const user = userStorage.get();
    return user.moodHistory;
  },

  getWeeklyMood: (): number => {
    const history = moodStorage.getHistory();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentMoods = history.filter(entry => 
      new Date(entry.date) >= weekAgo
    );
    
    if (recentMoods.length === 0) return 0;
    
    const moodValues = recentMoods.map(entry => getMoodValue(entry.mood));
    return moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
  },

  removeQuestMoodHistory: (questId: string): void => {
    if (typeof window === 'undefined') return;
    
    // Get current mood history from user data
    const user = userStorage.get();
    const filteredMoodHistory = user.moodHistory.filter(entry => entry.questId !== questId);
    
    // Update user with filtered mood history
    user.moodHistory = filteredMoodHistory;
    userStorage.save(user);
    
    // Also update the separate mood history storage
    const history = moodStorage.getHistory();
    const filteredHistory = history.filter(entry => entry.questId !== questId);
    localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(filteredHistory));
    
    // Dispatch mood update event
    dispatchMoodUpdate();
  },

  cleanupInvalidEntries: (): void => {
    if (typeof window === 'undefined') return;
    
    const user = userStorage.get();
    const allQuests = questStorage.getAll();
    const questIds = new Set(allQuests.map(q => q.id));
    
    // Filter out mood entries for quests that no longer exist
    const validMoodHistory = user.moodHistory.filter(entry => questIds.has(entry.questId));
    
    if (validMoodHistory.length !== user.moodHistory.length) {
      user.moodHistory = validMoodHistory;
      userStorage.save(user);
      
      // Dispatch mood update event if changes were made
      dispatchMoodUpdate();
    }
  }
};

// Statistics
export const statsStorage = {
  getDailyStats: (date: string): DailyStats => {
    if (typeof window === 'undefined') {
      return { date, questsCompleted: 0, expGained: 0, mood: null };
    }
    
    const data = localStorage.getItem(`${STORAGE_KEYS.DAILY_STATS}_${date}`);
    return data ? JSON.parse(data) : { date, questsCompleted: 0, expGained: 0, mood: null };
  },

  saveDailyStats: (stats: DailyStats): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${STORAGE_KEYS.DAILY_STATS}_${stats.date}`, JSON.stringify(stats));
  },

  getWeeklyStats: (weekStart: string): WeeklyStats => {
    if (typeof window === 'undefined') {
      return {
        weekStart,
        totalQuests: 0,
        completedQuests: 0,
        totalExp: 0,
        averageMood: 0,
        streakDays: 0
      };
    }
    
    const data = localStorage.getItem(`${STORAGE_KEYS.WEEKLY_STATS}_${weekStart}`);
    return data ? JSON.parse(data) : {
      weekStart,
      totalQuests: 0,
      completedQuests: 0,
      totalExp: 0,
      averageMood: 0,
      streakDays: 0
    };
  },

  saveWeeklyStats: (stats: WeeklyStats): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${STORAGE_KEYS.WEEKLY_STATS}_${stats.weekStart}`, JSON.stringify(stats));
  }
};

// Utility Functions
export const calculateLevel = (exp: number): number => {
  return Math.floor(Math.sqrt(exp / 100)) + 1;
};

// Return local date string in YYYY-MM-DD using local timezone
const toLocalDateString = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getExpToNextLevel = (currentExp: number): number => {
  const currentLevel = calculateLevel(currentExp);
  const nextLevelExp = Math.pow(currentLevel, 2) * 100;
  return nextLevelExp - currentExp;
};

export const getLevelProgress = (currentExp: number): { level: number; progress: number; expToNext: number } => {
  const level = calculateLevel(currentExp);
  const currentLevelExp = Math.pow(level - 1, 2) * 100;
  const nextLevelExp = Math.pow(level, 2) * 100;
  const progress = ((currentExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  
  return {
    level,
    progress: Math.max(0, Math.min(100, progress)),
    expToNext: nextLevelExp - currentExp
  };
};

// Helper functions for achievements
const getAchievementDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    'first_10': 'Complete your first 10 quests!',
    'week_streak': 'Maintain a 7-day quest streak!',
    'level_5': 'Reach level 5!',
    'diverse_quests': 'Complete quests in 5 different categories!',
    'level_up': 'Level up!'
  };
  return descriptions[id] || 'Achievement unlocked!';
};

const getAchievementIcon = (id: string): string => {
  const icons: Record<string, string> = {
    'first_10': '🎯',
    'week_streak': '🔥',
    'level_5': '⭐',
    'diverse_quests': '🗺️',
    'level_up': '⬆️'
  };
  return icons[id] || '🏆';
};

const getAchievementCategory = (id: string): Achievement['category'] => {
  if (id.includes('level')) return 'milestone';
  if (id.includes('streak')) return 'consistency';
  if (id.includes('first')) return 'milestone';
  return 'productivity';
};

const getMoodValue = (mood: Quest['mood']): number => {
  const moodValues: Record<string, number> = {
    '😔': 1,
    '😐': 2,
    '🤔': 3,
    '😴': 2,
    '😊': 4,
    '🔥': 5,
    '💪': 5,
    '🎯': 4
  };
  return moodValues[mood || '😐'] || 3;
};

// Clean up invalid mood history entries
export const cleanupMoodHistory = (): void => {
  if (typeof window === 'undefined') return;
  
  // Use the cleanup function from moodStorage
  moodStorage.cleanupInvalidEntries();
};

// Reset all data
export const resetAllData = (): void => {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Also remove daily and weekly stats
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEYS.DAILY_STATS) || key.startsWith(STORAGE_KEYS.WEEKLY_STATS)) {
      localStorage.removeItem(key);
    }
  });
  
  // Notify application that data has changed so UI can refresh without full page reload
  dispatchQuestUpdate();
  dispatchUserUpdate();
  dispatchAchievementUpdate();
  dispatchMoodUpdate();
};
