'use client';

import { useState } from 'react';
import { QuestFilter, QuestStatus, QuestCategory } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filter: QuestFilter) => void;
  className?: string;
}

export default function FilterBar({ onFilterChange, className = '' }: FilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<QuestStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions: { value: QuestStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Quests' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const categoryOptions: { value: QuestCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'Belajar', label: 'Belajar' },
    { value: 'Kerja', label: 'Kerja' },
    { value: 'Kesehatan', label: 'Kesehatan' },
    { value: 'Sosial', label: 'Sosial' },
    { value: 'Hobi', label: 'Hobi' },
    { value: 'Rumah', label: 'Rumah' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilter({ search: value || undefined });
  };

  const handleStatusChange = (status: QuestStatus | 'all') => {
    setSelectedStatus(status);
    updateFilter({ status: status === 'all' ? undefined : status });
  };

  const handleCategoryChange = (category: QuestCategory | 'all') => {
    setSelectedCategory(category);
    updateFilter({ category: category === 'all' ? undefined : category });
  };

  const updateFilter = (newFilter: Partial<QuestFilter>) => {
    const filter: QuestFilter = {
      search: searchTerm || undefined,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      ...newFilter
    };
    onFilterChange(filter);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedCategory('all');
    onFilterChange({});
  };

  const hasActiveFilters = searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all';

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-blue focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters ? 'bg-quest-blue text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Status Filter */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value as QuestStatus | 'all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === option.value
                      ? 'bg-quest-blue text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCategoryChange(option.value as QuestCategory | 'all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === option.value
                      ? 'bg-quest-gold text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-quest-blue/20 text-quest-blue rounded-full text-xs">
                &quot;{searchTerm}&quot;
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-2 py-1 bg-quest-green/20 text-quest-green rounded-full text-xs">
                {selectedStatus}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-quest-gold/20 text-quest-gold rounded-full text-xs">
                {selectedCategory}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
