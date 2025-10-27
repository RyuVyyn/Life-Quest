'use client';

import { useState, useEffect } from 'react';
import { MoodEntry, MoodType } from '@/types';
import { moodStorage, userStorage, questStorage } from '@/utils/localStorage';
import { TrendingUp, Calendar, Smile, BarChart3 } from 'lucide-react';

interface MoodTrackerProps {
  className?: string;
}

export default function MoodTracker({ className = '' }: MoodTrackerProps) {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [weeklyMood, setWeeklyMood] = useState(0);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const loadMoodData = () => {
      const history = moodStorage.getHistory();
      setMoodHistory(history);
      setWeeklyMood(moodStorage.getWeeklyMood());
    };
    
    loadMoodData();
    
    // Listen for mood updates
    const handleMoodUpdate = () => {
      const history = moodStorage.getHistory();
      setMoodHistory(history);
      setWeeklyMood(moodStorage.getWeeklyMood());
    };
    
    // Listen for quest updates (mood changes)
    const handleQuestUpdate = () => {
      // Reload mood data when quests are updated (including deletions)
      const history = moodStorage.getHistory();
      setMoodHistory(history);
      setWeeklyMood(moodStorage.getWeeklyMood());
    };
    
    window.addEventListener('moodUpdated', handleMoodUpdate);
    window.addEventListener('questUpdated', handleQuestUpdate);
    
    return () => {
      window.removeEventListener('moodUpdated', handleMoodUpdate);
      window.removeEventListener('questUpdated', handleQuestUpdate);
    };
  }, []);

  const moodOptions: { mood: MoodType; label: string; color: string }[] = [
    { mood: '😔', label: 'Struggling', color: 'text-red-400' },
    { mood: '😐', label: 'Neutral', color: 'text-gray-400' },
    { mood: '🤔', label: 'Thinking', color: 'text-blue-400' },
  { mood: '😴', label: 'Tired', color: 'text-quest-gold' },
    { mood: '😊', label: 'Happy', color: 'text-green-400' },
    { mood: '🔥', label: 'On Fire', color: 'text-orange-400' },
    { mood: '💪', label: 'Strong', color: 'text-quest-green' },
    { mood: '🎯', label: 'Focused', color: 'text-quest-blue' }
  ];

  const getMoodValue = (mood: MoodType): number => {
    const values: Record<MoodType, number> = {
      '😔': 1,
      '😐': 2,
      '🤔': 3,
      '😴': 2,
      '😊': 4,
      '🔥': 5,
      '💪': 5,
      '🎯': 4
    };
    return values[mood] || 3;
  };

  const getMoodInsights = () => {
    if (moodHistory.length === 0) return null;

    // Filter out mood entries for quests that no longer exist
    const validMoodHistory = moodHistory.filter(entry => {
      // Check if the quest still exists
      const quest = questStorage.getById(entry.questId);
      return quest !== null;
    });

    if (validMoodHistory.length === 0) return null;

    const recentMoods = validMoodHistory.slice(-7); // Last 7 entries
    const moodValues = recentMoods.map(entry => getMoodValue(entry.mood));
    const averageMood = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;

    const mostCommonMood = recentMoods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topMood = Object.entries(mostCommonMood).sort(([,a], [,b]) => b - a)[0];

    return {
      averageMood,
      topMood: topMood ? topMood[0] : '😐',
      totalEntries: validMoodHistory.length,
      recentEntries: recentMoods.length
    };
  };

  const getMoodDescription = (value: number): string => {
    if (value >= 4.5) return "You're feeling amazing! 🌟";
    if (value >= 3.5) return "You're doing great! 💪";
    if (value >= 2.5) return "You're doing okay! 👍";
    if (value >= 1.5) return "Hang in there! 💙";
    return "Take care of yourself! 💚";
  };

  const getMoodColor = (value: number): string => {
    if (value >= 4) return 'text-quest-green';
    if (value >= 3) return 'text-quest-blue';
    if (value >= 2) return 'text-quest-orange';
    return 'text-quest-red';
  };

  const insights = getMoodInsights();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mood Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Mood Tracker</h3>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-white" />
          </button>
        </div>

        {insights ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {weeklyMood.toFixed(1)}/5
                </div>
                <div className={`text-sm ${getMoodColor(weeklyMood)}`}>
                  {getMoodDescription(weeklyMood)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl">{insights.topMood}</div>
                <div className="text-white/70 text-sm">Most common</div>
              </div>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  weeklyMood >= 4 ? 'bg-quest-green' :
                  weeklyMood >= 3 ? 'bg-quest-blue' :
                  weeklyMood >= 2 ? 'bg-quest-orange' : 'bg-quest-red'
                }`}
                style={{ width: `${(weeklyMood / 5) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-white/70 text-sm">
              Complete some quests to start tracking your mood!
            </p>
          </div>
        )}
      </div>

      {/* Mood Insights */}
      {showInsights && insights && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-quest-blue" />
            <span className="text-white font-medium">Mood Insights</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Average Mood (7 days)</span>
              <span className={`font-semibold ${getMoodColor(insights.averageMood)}`}>
                {insights.averageMood.toFixed(1)}/5
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Total Mood Entries</span>
              <span className="text-white font-semibold">{insights.totalEntries}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Most Common Mood</span>
              <span className="text-2xl">{insights.topMood}</span>
            </div>
          </div>

          {/* Mood Pattern */}
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="text-white/70 text-sm mb-2">Recent Mood Pattern</div>
            <div className="flex space-x-1">
              {moodHistory.slice(-7).map((entry, index) => (
                <div key={index} className="text-2xl" title={entry.questTitle}>
                  {entry.mood}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mood History */}
      {moodHistory.length > 0 && (() => {
        // Filter out mood entries for quests that no longer exist
        const validMoodHistory = moodHistory.filter(entry => {
          const quest = questStorage.getById(entry.questId);
          return quest !== null;
        });
        
        return validMoodHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-quest-gold" />
              <span className="text-white font-medium">Recent Moods</span>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {validMoodHistory.slice(-5).reverse().map((entry, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{entry.mood}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{entry.questTitle}</div>
                      <div className="text-white/50 text-xs">{entry.date}</div>
                    </div>
                  </div>
                  <div className="text-white/70 text-xs">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Mood Tips */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <Smile className="w-4 h-4 text-quest-gold" />
          <span className="text-white/70 text-sm font-medium">Mood Tips</span>
        </div>
        <div className="text-white/60 text-sm">
          {weeklyMood >= 4 ? "You're in a great mood! Keep up the positive energy! 🌟" :
           weeklyMood >= 3 ? "You're doing well! Consider what's working for you. 💪" :
           weeklyMood >= 2 ? "Take some time to reflect on what brings you joy. 💙" :
           "Remember to be kind to yourself. Small steps lead to big changes. 💚"}
        </div>
      </div>
    </div>
  );
}
