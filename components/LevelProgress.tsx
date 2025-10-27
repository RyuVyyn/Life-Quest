'use client';

import { useState, useEffect } from 'react';
import { userStorage, getLevelProgress } from '@/utils/localStorage';
import { User } from '@/types';

interface LevelProgressProps {
  className?: string;
}

export default function LevelProgress({ className = '' }: LevelProgressProps) {
  const [user, setUser] = useState<User | null>(null);
  const [levelInfo, setLevelInfo] = useState<{ level: number; progress: number; expToNext: number } | null>(null);
  const [previewExpGain, setPreviewExpGain] = useState<number | null>(null);
  const [previewLevelInfo, setPreviewLevelInfo] = useState<{ level: number; progress: number; expToNext: number } | null>(null);

  useEffect(() => {
    const loadUserData = () => {
      const userData = userStorage.get();
      setUser(userData);
      setLevelInfo(getLevelProgress(userData.exp));
    };
    
    loadUserData();
    
    // Listen for user updates
    const handleUserUpdate = () => {
      const userData = userStorage.get();
      setUser(userData);
      setLevelInfo(getLevelProgress(userData.exp));
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    // Listen for preview events from quest form (when editing EXP)
    const handlePreview = (e: Event) => {
      const custom = e as CustomEvent<number>;
      const gain = Number(custom.detail);
      if (!isNaN(gain)) {
        setPreviewExpGain(gain);
        const userData = userStorage.get();
        setPreviewLevelInfo(getLevelProgress(userData.exp + gain));
      }
    };

    const handleClearPreview = () => {
      setPreviewExpGain(null);
      setPreviewLevelInfo(null);
    };

    window.addEventListener('questExpPreview', handlePreview as EventListener);
    window.addEventListener('clearQuestExpPreview', handleClearPreview as EventListener);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('questExpPreview', handlePreview as EventListener);
      window.removeEventListener('clearQuestExpPreview', handleClearPreview as EventListener);
    };
  }, []);

  if (!user || !levelInfo) return null;

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-quest-gold';
    if (level >= 5) return 'text-quest-gold'; // use gold for mid/high tiers to match dark-fantasy theme
    if (level >= 3) return 'text-quest-blue';
    return 'text-quest-green';
  };

  const getProgressColor = (level: number) => {
    if (level >= 10) return 'bg-gradient-to-r from-quest-gold to-quest-purple';
    if (level >= 5) return 'bg-gradient-to-r from-quest-gold to-quest-purple'; // gold -> purple XP shimmer
    if (level >= 3) return 'bg-gradient-to-r from-quest-blue to-blue-400';
    return 'bg-gradient-to-r from-quest-green to-green-400';
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            levelInfo.level >= 5 ? 'bg-gradient-to-br from-quest-gold to-quest-purple' : 'bg-gradient-to-br from-quest-purple to-quest-blue'
          }`}>
            <span className="text-white font-bold text-lg">{levelInfo.level}</span>
          </div>
          <div>
            <h3 className={`text-xl font-bold ${getLevelColor((previewLevelInfo || levelInfo)!.level)}`}>
              Level {(previewLevelInfo || levelInfo)!.level}
            </h3>
            <p className="text-white/70 text-sm">
              {previewExpGain ? `${user.exp + previewExpGain} EXP (preview) • ${user.totalQuestsCompleted} quests completed` : `${user.exp} EXP • ${user.totalQuestsCompleted} quests completed`}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-quest-gold font-semibold">
            {user.currentStreak} day streak 🔥
          </div>
          <div className="text-white/70 text-sm">
            Best: {user.longestStreak} days
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>Progress to Level {levelInfo.level + 1}</span>
          <span>{levelInfo.expToNext} EXP needed</span>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${getProgressColor((previewLevelInfo || levelInfo)!.level)}`}
            style={{ width: `${(previewLevelInfo || levelInfo)!.progress}%` }}
          />
        </div>
        
        <div className="text-center text-white/70 text-sm">
          {Math.round(levelInfo.progress)}% complete
        </div>
      </div>

      {/* Achievements preview */}
      {user.achievements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <span className="text-quest-gold">🏆</span>
            <span className="text-white/70 text-sm">
              {user.achievements.length} achievement{user.achievements.length !== 1 ? 's' : ''} unlocked
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
