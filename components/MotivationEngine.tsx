'use client';

import { useState, useEffect, useRef } from 'react';
import { User, MotivationMode } from '@/types';
import { userStorage } from '@/utils/localStorage';
import { Sword, Heart, Smile, TrendingUp, Target, Zap } from 'lucide-react';

interface MotivationEngineProps {
  className?: string;
}

export default function MotivationEngine({ className = '' }: MotivationEngineProps) {
  const [user, setUser] = useState<User | null>(null);
  const [motivationMessage, setMotivationMessage] = useState('');
  const [showMotivation, setShowMotivation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = userStorage.get();
        if (userData) {
          setUser(userData);
          generateMotivationMessage(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Retry after a short delay
        setTimeout(() => {
          const userData = userStorage.get();
          setUser(userData);
          generateMotivationMessage(userData);
        }, 100);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
    
    // Listen for user updates
    const handleUserUpdate = () => {
      try {
        const userData = userStorage.get();
        setUser(userData);
        generateMotivationMessage(userData);
      } catch (error) {
        console.error('Error handling user update:', error);
      }
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const generateMotivationMessage = (userData: User) => {
    if (!userData || !userData.motivationMode) return;
    const messages = getMotivationMessages(userData.motivationMode, userData);
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMotivationMessage(randomMessage);
  };

  const getMotivationMessages = (mode: MotivationMode, user: User) => {
    const baseMessages = {
      warrior: [
        "⚔️ Time to conquer your quests! No mercy for unfinished tasks!",
        "🔥 Your determination burns bright! Show those quests who's boss!",
        "💪 Every completed quest makes you stronger! Keep pushing forward!",
        "⚡ Strike while the iron is hot! Your quests await your command!",
        "🎯 Focus like a warrior! Your targets are within reach!"
      ],
      healer: [
        "💚 Take it one quest at a time. You're doing great!",
        "🌸 Remember to be kind to yourself. Progress, not perfection!",
        "🌱 Every small step counts. You're growing stronger each day!",
        "💫 You've got this! Trust in your ability to complete your quests!",
        "🕊️ Breathe deeply and tackle your quests with calm determination!"
      ],
      rogue: [
        "😏 Sneaky quest completion mode activated! Let's do this quietly!",
        "🎭 Time to put on your quest-completing mask and show off!",
        "🦹‍♂️ Stealth mode: complete quests before anyone notices!",
        "🎪 Life's a stage, and you're the star of your own quest show!",
        "🃏 Deal yourself a winning hand with these quests!"
      ]
    };

    // Add contextual messages based on user stats
    const contextualMessages = [];
    
    if (user.currentStreak >= 3) {
      contextualMessages.push("🔥 Your streak is on fire! Keep the momentum going!");
    }
    
    if (user.level >= 5) {
      contextualMessages.push("⭐ You're becoming a quest master! Level up your game!");
    }
    
    if (user.totalQuestsCompleted >= 10) {
      contextualMessages.push("🏆 Quest completion champion! You're unstoppable!");
    }

    return [...baseMessages[mode], ...contextualMessages];
  };

  const getMotivationIcon = (mode: MotivationMode) => {
    const currentMode = mode || 'warrior';
    switch (currentMode) {
      case 'warrior':
        return <Sword className="w-6 h-6 text-quest-red" />;
      case 'healer':
        return <Heart className="w-6 h-6 text-quest-green" />;
      case 'rogue':
        return <Smile className="w-6 h-6 text-quest-gold" />;
      default:
        return <Sword className="w-6 h-6 text-quest-red" />;
    }
  };

  const getMotivationColor = (mode: MotivationMode) => {
    const currentMode = mode || 'warrior';
    switch (currentMode) {
      case 'warrior':
        return 'border-quest-red bg-quest-red/10';
      case 'healer':
        return 'border-quest-green bg-quest-green/10';
      case 'rogue':
        return 'border-quest-gold bg-quest-gold/10';
      default:
        return 'border-quest-red bg-quest-red/10';
    }
  };

  const handleModeChange = (newMode: MotivationMode) => {
    try {
      const updatedUser = userStorage.updateMotivationMode(newMode);
      setUser(updatedUser);
      generateMotivationMessage(updatedUser);
      // Show motivation and reset any existing hide timeout so repeated clicks
      // extend the visible duration instead of causing flicker.
      setShowMotivation(true);
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      hideTimeout.current = window.setTimeout(() => {
        setShowMotivation(false);
        hideTimeout.current = null;
      }, 3000);
    } catch (error) {
      console.error('Error changing motivation mode:', error);
    }
  };

  // Ref to hold the hide timeout id so we can clear it on repeated clicks/unmount
  const hideTimeout = useRef<number | null>(null);

  // Show loading state while user data is being loaded
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-3"></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 bg-white/10 rounded-lg"></div>
              <div className="h-16 bg-white/10 rounded-lg"></div>
              <div className="h-16 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show default state if user data is not available
  if (!user) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-center py-4">
            <div className="text-white/70 text-sm">Loading motivation engine...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Motivation Mode Selector */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Motivation Mode</h3>
          <div className="flex items-center space-x-2">
            {getMotivationIcon(user.motivationMode)}
            <span className="text-white/70 text-sm capitalize">{user.motivationMode || 'warrior'} Mode</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleModeChange('warrior')}
            className={`p-3 rounded-lg border-2 transition-all ${
              (user.motivationMode || 'warrior') === 'warrior'
                ? 'border-quest-red bg-quest-red/20 text-white'
                : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Sword className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs font-medium">Warrior</div>
            <div className="text-xs text-white/50">Tough & Direct</div>
          </button>

          <button
            onClick={() => handleModeChange('healer')}
            className={`p-3 rounded-lg border-2 transition-all ${
              (user.motivationMode || 'warrior') === 'healer'
                ? 'border-quest-green bg-quest-green/20 text-white'
                : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Heart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs font-medium">Healer</div>
            <div className="text-xs text-white/50">Gentle & Supportive</div>
          </button>

          <button
            onClick={() => handleModeChange('rogue')}
            className={`p-3 rounded-lg border-2 transition-all ${
              (user.motivationMode || 'warrior') === 'rogue'
                ? 'border-quest-gold bg-quest-gold/20 text-white'
                : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Smile className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs font-medium">Rogue</div>
            <div className="text-xs text-white/50">Fun & Playful</div>
          </button>
        </div>
      </div>

      {/* Motivation Message */}
      {showMotivation && (
        <div className={`rounded-xl p-4 border-2 ${getMotivationColor(user.motivationMode)} animate-in slide-in-from-top-2 duration-300`}>
          <div className="flex items-center space-x-3">
            {getMotivationIcon(user.motivationMode)}
            <p className="text-white font-medium">{motivationMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-quest-blue" />
            <span className="text-white/70 text-sm">Daily Goal</span>
          </div>
          <div className="text-xl font-bold text-white">{user.dailyGoal || 3}</div>
          <div className="text-white/50 text-xs">quests per day</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-quest-green" />
            <span className="text-white/70 text-sm">Weekly Goal</span>
          </div>
          <div className="text-xl font-bold text-white">{user.weeklyGoal || 15}</div>
          <div className="text-white/50 text-xs">quests per week</div>
        </div>
      </div>

      {/* Motivation Tips */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-quest-gold" />
          <span className="text-white/70 text-sm font-medium">Pro Tip</span>
        </div>
        <p className="text-white/60 text-sm">
          {(user.motivationMode || 'warrior') === 'warrior' && "Break down big quests into smaller, conquerable tasks!"}
          {(user.motivationMode || 'warrior') === 'healer' && "Remember to celebrate small wins and be patient with yourself!"}
          {(user.motivationMode || 'warrior') === 'rogue' && "Turn your quests into a game - add some fun challenges!"}
        </p>
      </div>
    </div>
  );
}
