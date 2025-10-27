'use client';

import { useState, useEffect } from 'react';
import { Achievement } from '@/types';
import { achievementStorage } from '@/utils/localStorage';
import { Trophy, X } from 'lucide-react';

interface AchievementNotificationProps {
  className?: string;
}

export default function AchievementNotification({ className = '' }: AchievementNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const handleAchievementUpdate = () => {
      // Get the latest achievement
      const achievements = achievementStorage.getAll();
      if (achievements.length > 0) {
        const latestAchievement = achievements[achievements.length - 1];
        setAchievement(latestAchievement);
        setShowNotification(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    };

    window.addEventListener('achievementUpdated', handleAchievementUpdate);
    
    return () => {
      window.removeEventListener('achievementUpdated', handleAchievementUpdate);
    };
  }, []);

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification || !achievement) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm ${className}`}>
      <div className="bg-gradient-to-r from-quest-gold to-yellow-400 rounded-xl p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Achievement Unlocked!</span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{achievement.icon}</div>
            <div>
              <div className="text-white font-bold text-lg">{achievement.name}</div>
              <div className="text-white/80 text-sm">{achievement.description}</div>
            </div>
          </div>
          
          <div className="text-white/70 text-xs">
            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
