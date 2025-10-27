'use client';

import { useState, useEffect } from 'react';
import { Quest, QuestCategory, QuestPriority } from '@/types';
import { questStorage, userStorage } from '@/utils/localStorage';
import { ArrowLeft, Save, Star } from 'lucide-react';

interface QuestFormProps {
  questId?: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function QuestForm({ questId, onSave, onCancel }: QuestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Belajar' as QuestCategory,
    exp: 50,
    priority: 'medium' as QuestPriority
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // track original values when editing existing quest
  const [originalExp, setOriginalExp] = useState<number | null>(null);
  const [originalStatus, setOriginalStatus] = useState<Quest['status'] | null>(null);

  const categories: QuestCategory[] = ['Belajar', 'Kerja', 'Kesehatan', 'Sosial', 'Hobi', 'Rumah', 'Lainnya'];
  const priorities: { value: QuestPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'text-quest-green' },
    { value: 'medium', label: 'Medium', color: 'text-quest-orange' },
    { value: 'high', label: 'High', color: 'text-quest-red' }
  ];

  useEffect(() => {
    if (questId) {
      const quest = questStorage.getById(questId);
      if (quest) {
        setFormData({
          title: quest.title,
          description: quest.description,
          category: quest.category,
          exp: quest.exp,
          priority: quest.priority
        });
        // store original values for preview/submit adjustments
        setOriginalExp(quest.exp);
        setOriginalStatus(quest.status);
      }
    }
  }, [questId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        // If editing an existing completed quest, adjust user EXP by the delta
        if (questId) {
          const existing = questStorage.getById(questId);
          if (existing && existing.status === 'completed') {
            const oldExp = existing.exp || 0;
            const diff = formData.exp - oldExp;
            if (diff > 0) {
              userStorage.addExp(diff);
            } else if (diff < 0) {
              // subtract only the EXP amount, do not decrement completed count
              userStorage.subtractExp(Math.abs(diff));
            }
          }
        }
      const questData: Quest = {
        id: questId || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: questId ? questStorage.getById(questId)?.status || 'pending' : 'pending',
        exp: formData.exp,
        priority: formData.priority,
        dateCreated: questId ? questStorage.getById(questId)?.dateCreated || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dateCompleted: questId ? questStorage.getById(questId)?.dateCompleted || null : null,
        mood: questId ? questStorage.getById(questId)?.mood : undefined
      };

      questStorage.save(questData);
      // clear preview and notify
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clearQuestExpPreview'));
      }
      onSave();
    } catch (error) {
      console.error('Error saving quest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExpColor = (exp: number) => {
    if (exp >= 100) return 'text-quest-gold';
    if (exp >= 75) return 'text-quest-gold';
    if (exp >= 50) return 'text-quest-blue';
    return 'text-quest-green';
  };

  // Dispatch preview events so other components (e.g. LevelProgress) can show potential changes
  const dispatchExpPreview = (exp: number) => {
    if (typeof window === 'undefined') return;
    // If editing an already completed quest, preview should be the delta (new - original)
    let previewGain = exp;
    if (questId && originalStatus === 'completed' && originalExp !== null) {
      previewGain = exp - originalExp;
    }
    window.dispatchEvent(new CustomEvent('questExpPreview', { detail: previewGain }));
  };

  // Clear preview when unmounting or cancelling
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clearQuestExpPreview'));
      }
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white">
              {questId ? 'Edit Quest' : 'Create New Quest'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 text-quest-gold">
            <Star className="w-5 h-5" />
            <span className="font-semibold">{formData.exp} EXP</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quest Title */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Quest Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your quest title..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-blue focus:border-transparent"
              required
            />
          </div>

          {/* Quest Description */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your quest in detail..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-blue focus:border-transparent resize-none"
            />
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as QuestCategory })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-quest-blue focus:border-transparent"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as QuestPriority })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-quest-blue focus:border-transparent"
                required
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value} className="bg-gray-800">
                    {priority.label} Priority
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* EXP Reward */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              EXP Reward *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="10"
                max="500"
                value={formData.exp}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 10;
                  setFormData({ ...formData, exp: val });
                  dispatchExpPreview(val);
                }}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-quest-blue focus:border-transparent"
                required
              />
              <div className={`text-2xl font-bold ${getExpColor(formData.exp)}`}>
                ⭐
              </div>
            </div>
            <div className="mt-2 text-sm text-white/50">
              Higher EXP rewards for more challenging quests!
            </div>
          </div>

          {/* EXP Preview */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Quest Preview:</span>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${getExpColor(formData.exp)}`}>
                  {formData.exp} EXP
                </span>
                <span className="text-white/50">•</span>
                <span className="text-white/70 text-sm">
                  {formData.priority.toUpperCase()} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="px-6 py-3 rounded-lg bg-quest-blue text-white hover:bg-quest-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{questId ? 'Update Quest' : 'Create Quest'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
