npm run dev'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Quest, QuestFilter, User } from '@/types';
import { questStorage, userStorage, resetAllData, cleanupMoodHistory } from '@/utils/localStorage';
import QuestList from '@/components/QuestList';
import QuestForm from '@/components/QuestForm';
import LevelProgress from '@/components/LevelProgress';
import FilterBar from '@/components/FilterBar';
import MotivationEngine from '@/components/MotivationEngine';
import MoodTracker from '@/components/MoodTracker';
import QuestReminder from '@/components/QuestReminder';
import AchievementNotification from '@/components/AchievementNotification';
import { Plus, Settings, Trash2, Trophy, Target, Zap } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<QuestFilter>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Clean up invalid mood history entries on app start
    cleanupMoodHistory();
    
    loadData();
    
    // Listen for quest and user updates
    const handleQuestUpdate = () => {
      const questData = questStorage.getAll();
      setQuests(questData);
    };
    
    const handleUserUpdate = () => {
      const userData = userStorage.get();
      setUser(userData);
    };
    
    window.addEventListener('questUpdated', handleQuestUpdate);
    window.addEventListener('userUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('questUpdated', handleQuestUpdate);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const loadData = () => {
    const questData = questStorage.getAll();
    const userData = userStorage.get();
    setQuests(questData);
    setUser(userData);
  };

  const handleQuestUpdate = () => {
    // Force re-render by updating state
    const questData = questStorage.getAll();
    const userData = userStorage.get();
    setQuests(questData);
    setUser(userData);
  };

  const handleEditQuest = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleAddQuest = () => {
    setShowAddForm(true);
  };

  const handleFormSave = () => {
    setShowAddForm(false);
    loadData();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  const handleResetData = () => {
    resetAllData();
    loadData();
    setShowResetConfirm(false);
  };

  const getDailyProgress = () => {
    if (!user) return { completed: 0, total: 3, percentage: 0 };
    
    const today = new Date().toISOString().split('T')[0];
    const todayQuests = quests.filter(q => q.dateCompleted === today);
    const completed = todayQuests.length;
    const total = user.dailyGoal;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  };

  const getWeeklyProgress = () => {
    if (!user) return { completed: 0, total: 15, percentage: 0 };
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weekQuests = quests.filter(q => 
      q.dateCompleted && q.dateCompleted >= weekStartStr
    );
    const completed = weekQuests.length;
    const total = user.weeklyGoal;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  };

  const dailyProgress = getDailyProgress();
  const weeklyProgress = getWeeklyProgress();

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-primary p-4">
        <QuestForm onSave={handleFormSave} onCancel={handleFormCancel} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-surface/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">⚔️</div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Life Quest</h1>
                <p className="text-text-primary/70 text-sm">Your epic productivity adventure</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddQuest}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-secondary text-text-primary rounded-lg hover:bg-accent-secondary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Quest</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-surface/50 hover:bg-highlight-hover transition-colors"
              >
                <Settings className="w-4 h-4 text-text-primary" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface backdrop-blur-sm rounded-xl p-4 border border-surface/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-5 h-5 text-quest-blue" />
                  <span className="text-text-primary font-medium">Daily Progress</span>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-2">
                  {dailyProgress.completed}/{dailyProgress.total}
                </div>
                <div className="w-full bg-surface/50 rounded-full h-2">
                  <div 
                    className="xp-gradient h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(dailyProgress.percentage, 100)}%` }}
                  />
                </div>
                <div className="text-text-primary/70 text-sm mt-1">
                  {Math.round(dailyProgress.percentage)}% complete
                </div>
              </div>

              <div className="bg-surface backdrop-blur-sm rounded-xl p-4 border border-surface/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-5 h-5 text-accent-secondary" />
                  <span className="text-text-primary font-medium">Weekly Progress</span>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-2">
                  {weeklyProgress.completed}/{weeklyProgress.total}
                </div>
                <div className="w-full bg-surface/50 rounded-full h-2">
                  <div 
                    className="bg-accent-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(weeklyProgress.percentage, 100)}%` }}
                  />
                </div>
                <div className="text-text-primary/70 text-sm mt-1">
                  {Math.round(weeklyProgress.percentage)}% complete
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar onFilterChange={setFilter} />

            {/* Quest List */}
            <div data-quest-list>
              <QuestList 
                filter={filter} 
                onQuestUpdate={handleQuestUpdate}
                onEditQuest={handleEditQuest}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <LevelProgress />

            {/* Motivation Engine */}
            <MotivationEngine />

            {/* Mood Tracker */}
            <MoodTracker />
          </div>
        </div>
      </main>

      {/* Quest Reminder */}
      <QuestReminder />
      
      {/* Achievement Notification */}
      <AchievementNotification />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-surface/50 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg bg-surface/50 hover:bg-highlight-hover transition-colors"
              >
                <Settings className="w-4 h-4 text-text-primary" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-primary/70">Daily Goal</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={user?.dailyGoal || 3}
                  onChange={(e) => {
                    const newUser = userStorage.updateGoals(
                      parseInt(e.target.value) || 3,
                      user?.weeklyGoal || 15
                    );
                    setUser(newUser);
                  }}
                  className="w-20 px-3 py-1 bg-white/10 border border-surface/50 rounded text-text-primary text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-primary/70">Weekly Goal</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={user?.weeklyGoal || 15}
                  onChange={(e) => {
                    const newUser = userStorage.updateGoals(
                      user?.dailyGoal || 3,
                      parseInt(e.target.value) || 15
                    );
                    setUser(newUser);
                  }}
                  className="w-20 px-3 py-1 bg-white/10 border border-surface/50 rounded text-text-primary text-center"
                />
              </div>

              <div className="pt-4 border-t border-surface/50">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-danger/20 text-danger rounded-lg hover:bg-danger/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-surface/50 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Reset All Data</h3>
              <p className="text-text-primary/70 mb-6">
                This will permanently delete all your quests, progress, and achievements. This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white/10 text-text-primary rounded-lg hover:bg-surface/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetData}
                  className="flex-1 px-4 py-2 bg-danger text-text-primary rounded-lg hover:bg-danger/80 transition-colors"
                >
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
