'use client';

import { useState, useEffect, useMemo } from 'react';
import { Quest, QuestFilter } from '@/types';
import { questStorage } from '@/utils/localStorage';
import QuestCard from './QuestCard';

interface QuestListProps {
  filter: QuestFilter;
  onQuestUpdate: () => void;
  onEditQuest: (id: string) => void;
}

export default function QuestList({ filter, onQuestUpdate, onEditQuest }: QuestListProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuests = () => {
      const allQuests = questStorage.getAll();
      setQuests(allQuests);
      setIsLoading(false);
    };

    loadQuests();
  }, []);

  // Listen for quest updates
  useEffect(() => {
    const handleQuestUpdate = () => {
      const allQuests = questStorage.getAll();
      setQuests(allQuests);
    };

    // Listen for custom quest update events
    window.addEventListener('questUpdated', handleQuestUpdate);
    
    return () => {
      window.removeEventListener('questUpdated', handleQuestUpdate);
    };
  }, []);

  const filteredQuests = useMemo(() => {
    let filtered = [...quests];

    // Apply search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(quest =>
        quest.title.toLowerCase().includes(searchTerm) ||
        quest.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filter.status) {
      filtered = filtered.filter(quest => quest.status === filter.status);
    }

    // Apply category filter
    if (filter.category) {
      filtered = filtered.filter(quest => quest.category === filter.category);
    }

    // Sort by priority and creation date
    filtered.sort((a, b) => {
      // First by status (pending > in-progress > completed)
      const statusOrder = { 'pending': 0, 'in-progress': 1, 'completed': 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Then by priority (high > medium > low)
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Finally by creation date (newest first)
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    });

    return filtered;
  }, [quests, filter]);

  const getQuestStats = () => {
    const total = quests.length;
    const completed = quests.filter(q => q.status === 'completed').length;
    const inProgress = quests.filter(q => q.status === 'in-progress').length;
    const pending = quests.filter(q => q.status === 'pending').length;

    return { total, completed, inProgress, pending };
  };

  const stats = getQuestStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quest-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quest Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-white/70 text-sm">Total Quests</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-bold text-quest-green">{stats.completed}</div>
          <div className="text-white/70 text-sm">Completed</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-bold text-quest-orange">{stats.inProgress}</div>
          <div className="text-white/70 text-sm">In Progress</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-bold text-white/70">{stats.pending}</div>
          <div className="text-white/70 text-sm">Pending</div>
        </div>
      </div>

      {/* Quest List */}
      {filteredQuests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚔️</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {quests.length === 0 ? 'No quests yet!' : 'No quests match your filter'}
          </h3>
          <p className="text-white/70 mb-6">
            {quests.length === 0 
              ? 'Create your first quest to start your adventure!' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {quests.length === 0 && (
            <div className="text-quest-gold text-sm">
              💡 Tip: Start with small, achievable quests to build momentum!
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onUpdate={onQuestUpdate}
              onEdit={onEditQuest}
            />
          ))}
        </div>
      )}

      {/* Filter Results Summary */}
      {filteredQuests.length > 0 && (filter.search || filter.status || filter.category) && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-center text-white/70 text-sm">
            Showing {filteredQuests.length} of {quests.length} quests
            {filter.search && ` matching "${filter.search}"`}
            {filter.status && ` with status "${filter.status}"`}
            {filter.category && ` in category "${filter.category}"`}
          </div>
        </div>
      )}
    </div>
  );
}
