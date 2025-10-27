'use client';

import { useState, useEffect } from 'react';
import { Quest } from '@/types';
import { questStorage, userStorage } from '@/utils/localStorage';
import { Bell, X, Clock, Target, Zap } from 'lucide-react';

interface QuestReminderProps {
  className?: string;
}

export default function QuestReminder({ className = '' }: QuestReminderProps) {
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [pendingQuests, setPendingQuests] = useState<Quest[]>([]);
  const [lastReminderTime, setLastReminderTime] = useState<string | null>(null);

  useEffect(() => {
    checkForReminders();
    
    // Check for reminders every 30 minutes
    const interval = setInterval(checkForReminders, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkForReminders = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const today = now.toISOString().split('T')[0];
    
    // Don't show reminders between 10 PM and 6 AM
    if (currentHour >= 22 || currentHour < 6) return;
    
    // Check if we've already shown a reminder today
    const lastReminder = localStorage.getItem('lastQuestReminder');
    if (lastReminder === today) return;
    
    const quests = questStorage.getAll();
    const user = userStorage.get();
    
    // Filter for pending and in-progress quests
    const activeQuests = quests.filter(q => 
      q.status === 'pending' || q.status === 'in-progress'
    );
    
    if (activeQuests.length === 0) return;
    
    setPendingQuests(activeQuests);
    generateReminderMessage(activeQuests, user);
    setShowReminder(true);
    setLastReminderTime(today);
    
    // Mark reminder as shown for today
    localStorage.setItem('lastQuestReminder', today);
  };

  const generateReminderMessage = (quests: Quest[], user: any) => {
    const pendingCount = quests.filter(q => q.status === 'pending').length;
    const inProgressCount = quests.filter(q => q.status === 'in-progress').length;
    
    const messages = [
      `⚔️ You have ${quests.length} active quest${quests.length !== 1 ? 's' : ''} waiting for you!`,
      `🎯 ${pendingCount} quest${pendingCount !== 1 ? 's' : ''} ready to start, ${inProgressCount} in progress!`,
      `💪 Your quest log has ${quests.length} adventure${quests.length !== 1 ? 's' : ''} ready!`,
      `🔥 ${quests.length} quest${quests.length !== 1 ? 's' : ''} await your heroic deeds!`,
      `⚡ Time to tackle those ${quests.length} quest${quests.length !== 1 ? 's' : ''}!`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setReminderMessage(randomMessage);
  };

  const handleDismiss = () => {
    setShowReminder(false);
  };

  const handleViewQuests = () => {
    setShowReminder(false);
    // Scroll to quest list
    const questList = document.querySelector('[data-quest-list]');
    if (questList) {
      questList.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getMotivationMessage = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return "🌅 Start your day with purpose!";
    } else if (hour >= 12 && hour < 18) {
      return "☀️ Afternoon productivity boost!";
    } else {
      return "🌆 Evening quest completion time!";
    }
  };

  if (!showReminder) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg animate-in slide-in-from-right-2 duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-quest-gold" />
            <span className="text-white font-semibold">Quest Reminder</span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-white text-sm">{reminderMessage}</p>
          
          <div className="text-quest-gold text-sm font-medium">
            {getMotivationMessage()}
          </div>

          {/* Quest Summary */}
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-white/70 mb-2">
              <span>Quest Status</span>
              <span>{pendingQuests.length} total</span>
            </div>
            
            <div className="space-y-1">
              {pendingQuests.slice(0, 3).map((quest, index) => (
                <div key={quest.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    quest.status === 'pending' ? 'bg-white/50' : 'bg-quest-orange'
                  }`} />
                  <span className="text-white text-xs truncate">{quest.title}</span>
                </div>
              ))}
              {pendingQuests.length > 3 && (
                <div className="text-white/50 text-xs">
                  +{pendingQuests.length - 3} more quests...
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleViewQuests}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-quest-blue text-white rounded-lg hover:bg-quest-blue/80 transition-colors text-sm"
            >
              <Target className="w-3 h-3" />
              <span>View Quests</span>
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-3 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
