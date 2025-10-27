'use client';

import { useState } from 'react';
import { Quest, QuestStatus, MoodType } from '@/types';
import { questStorage, userStorage, moodStorage, achievementStorage } from '@/utils/localStorage';
import { CheckCircle, Circle, Clock, Trash2, Edit, Star } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onUpdate: () => void;
  onEdit: (id: string) => void;
}

export default function QuestCard({ quest, onUpdate, onEdit }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const getStatusIcon = (status: QuestStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-accent-secondary" />;
      default:
        return <Circle className="w-5 h-5 text-text-secondary" />;
    }
  };

  const getStatusColor = (status: QuestStatus) => {
    switch (status) {
      case 'completed':
        return 'border-success bg-success/10';
      case 'in-progress':
        return 'border-accent-secondary bg-accent-secondary/10';
      default:
        return 'border-surface/50 bg-surface/30';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Belajar': 'bg-quest-blue',
      'Kerja': 'bg-quest-gold',
      'Kesehatan': 'bg-quest-green',
      'Sosial': 'bg-quest-orange',
      'Hobi': 'bg-quest-blue',
      'Rumah': 'bg-danger',
      'Lainnya': 'bg-text-secondary'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-accent-secondary';
      default:
        return 'text-success';
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    // If quest is already completed, do not allow status changes
    if (quest.status === 'completed') {
      return;
    }

    if ((newStatus as any) === 'completed') {
      setIsCompleting(true);
      
      // Update quest status
      questStorage.updateStatus(quest.id, newStatus);
      
      // Add EXP to user
      userStorage.addExp(quest.exp);
      
      // Complete quest for user stats
      userStorage.completeQuest();
      
      // Check for achievements
      achievementStorage.checkAchievements();
      
      // Show mood selector after a short delay
      setTimeout(() => {
        setShowMoodSelector(true);
        setIsCompleting(false);
      }, 1000);
    } else {
      questStorage.updateStatus(quest.id, newStatus);
    }
    
    // Force immediate update
    onUpdate();
  };

  const handleMoodSelect = (mood: MoodType) => {
    questStorage.updateMood(quest.id, mood);
    moodStorage.addEntry(quest.id, quest.title, mood);
    setShowMoodSelector(false);
    // Force immediate update
    onUpdate();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quest?')) {
      // If this quest was already completed, remove its EXP and decrement completed count
      if (quest.status === 'completed') {
        try {
          userStorage.removeCompletedQuest(quest.exp);
        } catch (error) {
          console.error('Error removing quest EXP from user:', error);
        }
      }
      questStorage.delete(quest.id);
      // Force immediate update
      onUpdate();
    }
  };

  const moodOptions: MoodType[] = ['😊', '😐', '😔', '🤔', '😴', '🔥', '💪', '🎯'];

  return (
    <div className={`relative rounded-xl border-2 p-4 transition-all duration-300 hover:scale-[1.02] ${getStatusColor(quest.status)} ${isCompleting ? 'animate-quest-complete' : ''}`}>
      {/* Quest Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => handleStatusChange(quest.status === 'completed' ? 'pending' : quest.status === 'pending' ? 'in-progress' : 'completed')}
            className={`transition-transform ${quest.status === 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            disabled={quest.status === 'completed'}
            aria-disabled={quest.status === 'completed'}
            title={quest.status === 'completed' ? 'Quest already completed' : 'Change status'}
          >
            {getStatusIcon(quest.status)}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${quest.status === 'completed' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
              {quest.title}
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              {quest.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(quest.id)}
            className="p-2 rounded-lg bg-surface/50 hover:bg-highlight-hover transition-colors"
          >
            <Edit className="w-4 h-4 text-text-primary" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-danger/20 hover:bg-danger/30 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-danger" />
          </button>
        </div>
      </div>

      {/* Quest Details */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(quest.category)}`}>
            {quest.category}
          </span>
          
          <span className={`font-medium ${getPriorityColor(quest.priority)}`}>
            {quest.priority.toUpperCase()} Priority
          </span>
          
          <div className="flex items-center space-x-1 text-accent-secondary">
            <Star className="w-4 h-4" />
            <span>{quest.exp} EXP</span>
          </div>
        </div>

        <div className="text-text-secondary text-xs">
          Created: {new Date(quest.dateCreated).toLocaleDateString()}
        </div>
      </div>

      {/* Mood Display */}
      {quest.mood && (
        <div className="mt-3 pt-3 border-t border-surface/50">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Mood:</span>
            <span className="text-2xl">{quest.mood}</span>
          </div>
        </div>
      )}

      {/* Mood Selector Modal */}
      {showMoodSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-surface/50 max-w-md mx-4">
            <h3 className="text-text-primary text-lg font-semibold mb-4 text-center">
              How do you feel about completing this quest? 🎉
            </h3>
            
            <div className="grid grid-cols-4 gap-3 mb-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className="p-3 rounded-lg bg-surface/50 hover:bg-highlight-hover transition-colors text-2xl"
                >
                  {mood}
                </button>
              ))}
            </div>
            
            <div className="text-center text-text-secondary text-sm">
              +{quest.exp} EXP gained! ⭐
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
