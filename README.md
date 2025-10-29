# 🎯 Life Quest# Life Quest ⚔️# ⚔️ Life Quest - Gamified Task Management



An RPG-style task management app that transforms daily tasks into epic quests, featuring a dark-fantasy theme and gamification elements.



## 📝 DescriptionTransform your daily tasks into epic quests with Life Quest! A gamified task management application that makes productivity feel like an adventure.Transform your daily tasks into epic quests with Life Quest! This gamified productivity app makes completing tasks feel like an adventure, complete with EXP, leveling, achievements, and adaptive motivation systems.



Life Quest gamifies your daily productivity by turning ordinary tasks into exciting quests. Using a dark-fantasy theme, the app rewards task completion with experience points (EXP), levels, and achievements. Whether you're studying, working, or maintaining healthy habits, Life Quest makes every accomplishment feel epic.



## 🛠️ Technologies Used## Description## 🌟 Features



- Next.js 14 (App Router)

- TypeScript

- Tailwind CSSLife Quest is a modern task management application that transforms everyday tasks into RPG-style quests. It combines productivity with gaming elements to make task completion more engaging and rewarding. The app features a dark-fantasy theme, complete with experience points (EXP), leveling system, achievements, and an adaptive motivation system.### 🎮 Core Gamification

- React Custom Components

- Lucide React Icons- **Quest System**: Transform tasks into RPG-style quests

- Browser LocalStorage

- Custom Event System## Technologies Used- **EXP & Leveling**: Gain experience points and level up



## ⚔️ Features- **Achievements**: Unlock badges and milestones



**Quest Management**- **Frontend Framework**: Next.js 14 (App Router)- **Progress Tracking**: Visual progress bars and statistics

- Create and track tasks as quests

- Set priority levels (Low/Medium/High)- **Language**: TypeScript

- Add EXP rewards (10-500 points)

- Organize by categories (Belajar/Kerja/Kesehatan/etc)- **Styling**: Tailwind CSS with dark-fantasy theme### 🧠 Adaptive Motivation Engine



**Progression System**- **UI Components**: Custom React components- **Warrior Mode**: Direct, tough motivation for determined users

- Gain EXP and level up

- Track daily completion streaks- **Icons**: Lucide React- **Healer Mode**: Gentle, supportive encouragement

- Unlock achievements

- Monitor mood after completions- **Storage**: Browser localStorage- **Rogue Mode**: Fun, playful motivation with humor



**Motivation Engine**- **State Management**: React Hooks + Custom Events

- Choose your motivation style:

  - Warrior (Direct/Tough)### 📊 Advanced Features

  - Healer (Supportive/Gentle)

  - Rogue (Fun/Playful)## Features- **Mood Tracking**: Track your mood after completing quests



**Dark Fantasy UI**- **Mood Insights**: Analyze productivity patterns

- Responsive design

- Smooth animations### Core Features- **Daily/Weekly Goals**: Set and track personal targets

- Glass-morphic elements

- Real-time updates- **Quest System**- **Quest Categories**: Organize by Belajar, Kerja, Kesehatan, etc.



## 🚀 Setup Instructions  - Create, edit, and complete daily tasks as quests- **Priority System**: High, Medium, Low priority quests



**Prerequisites**  - Categories: Belajar, Kerja, Kesehatan, Sosial, Hobi, Rumah, Lainnya- **Search & Filter**: Find quests easily

- Node.js 18+

- npm/yarn  - Priority levels with visual indicators- **Streak Tracking**: Maintain daily completion streaks



**Installation**  - EXP rewards for completion

```bash

# Clone repository### 🎨 Visual Features

git clone https://github.com/RyuVyyn/Life-Quest.git

- **Progress System**- **Dynamic Themes**: UI adapts to time and level

# Enter project directory

cd Life-Quest  - Dynamic level progression based on EXP- **Glass Morphism**: Modern, beautiful interface



# Install dependencies  - Daily streak tracking with consecutive day bonuses- **Smooth Animations**: Level up effects, quest completion

npm install

  - Visual progress bars with shimmer effects- **Responsive Design**: Works on all devices

# Start development server

npm run dev  - Achievement system with unlockable badges



# Open in browser## 🚀 Getting Started

http://localhost:3000

```- **Motivation System**



## 🤖 AI Support  - Three motivation modes: Warrior, Healer, Rogue### Prerequisites



**Smart Progression**  - Adaptive motivation messages- Node.js 18+ 

- Consecutive day streak tracking in local timezone

- Dynamic EXP calculations  - Mood tracking after quest completion- npm or yarn

- Intelligent achievement system

  - Daily and weekly goal setting
   yarn dev
# ⚔️ Life Quest — Gamified Task Adventure

Life Quest turns your daily tasks into RPG-style quests. Complete quests to earn EXP, level up, unlock achievements, and stay motivated with an adaptive motivation engine and mood tracking.

## Description

Life Quest is a local-first productivity app with a dark-fantasy aesthetic. It blends game mechanics (EXP, levels, streaks, achievements) with practical task management features to help you build momentum and maintain healthy habits.

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (custom dark-fantasy palette)
- React (Client components)
- Lucide React (icons)
- Browser localStorage for persistence
- Custom event system for real-time UI updates

## Features

### Core
- Create, edit, and delete quests (tasks)
- EXP rewards and dynamic leveling system
- Daily/weekly goals and streak tracking
- Achievements and progress tracking
- Quest categories and priority levels

### Motivation & Mood
- Motivation Engine with three modes: Warrior, Healer, Rogue
- Mood tracking after quest completion
- Adaptive motivation messages based on activity

### UX & Visuals
- Dark-fantasy theme with glassmorphism
- Responsive design and smooth animations
- Real-time UI updates via custom events

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone repository
git clone https://github.com/RyuVyyn/Life-Quest.git
cd "Life-Quest"

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## AI Support Explanation

Life Quest includes a few local AI-assisted and intelligent behaviors that improve UX and personalization while keeping privacy intact (no external data by default):

### Adaptive Motivation
- Learns patterns in user activity to adjust tone and timing of encouragements
- Supports three personalities (Warrior/Healer/Rogue) to fit user preference

### Smart Progression
- EXP formulas adapt to quest difficulty and user progress
- Streak computation uses local timezone to avoid day-boundary issues

### Local Intelligence & UX
- Real-time UI updates powered by a custom event system — changes to data are reflected immediately without full page reloads
- Offline-first behavior: app works without network and stores everything in localStorage

---

For more details, see the `app/`, `components/`, `utils/` and `types/` folders. If you'd like, I can also add deployment instructions for Vercel or a contributing guide.
### Build for Production│   ├── QuestList.tsx      # Quest list container

```bash│   ├── QuestForm.tsx      # Add/edit quest form

npm run build│   ├── LevelProgress.tsx  # User level & EXP

npm start│   ├── FilterBar.tsx      # Search and filter

```│   ├── MotivationEngine.tsx # Adaptive motivation

│   └── MoodTracker.tsx    # Mood tracking & insights

## AI Support Explanation├── types/                 # TypeScript interfaces

│   └── index.ts          # Data models

Life Quest uses several AI-enhanced features:├── utils/                 # Utility functions

│   └── localStorage.ts    # Data persistence

### Adaptive Motivation System└── styles/               # Additional styles

- Analyzes user patterns and quest completion rates```

- Adjusts motivation messages based on user behavior

- Learns from mood tracking data to improve encouragement## 🎯 How to Use



### Smart Progression### Creating Your First Quest

- Dynamic EXP calculations based on quest difficulty1. Click the **"+ New Quest"** button

- Intelligent streak tracking using local timezone2. Fill in the quest details:

- Achievement suggestions based on user activity   - **Title**: What you want to accomplish

   - **Description**: More details about the quest

### Data Management   - **Category**: Choose from Belajar, Kerja, Kesehatan, etc.

- Local-first architecture for privacy   - **Priority**: High, Medium, or Low

- Real-time UI updates via custom event system   - **EXP Reward**: How much experience you'll gain (10-500)

- Intelligent state management without server dependencies3. Click **"Create Quest"**



### UX Improvements### Completing Quests

- Dark-fantasy theme with smart color adaptation1. Click the circle next to a quest to mark it as "In Progress"

- Responsive layout with intelligent component mounting2. Click again to mark it as "Completed"

- Progressive enhancement based on device capabilities3. Choose your mood after completion

4. Watch your EXP and level increase!

---

### Motivation Modes

Made with 💖 for productivity enthusiasts and RPG lovers alike.- **Warrior**: Direct, tough motivation
- **Healer**: Gentle, supportive encouragement  
- **Rogue**: Fun, playful motivation
- Switch modes in the sidebar to find what works for you

### Tracking Progress
- View your level and EXP in the sidebar
- Check daily and weekly progress
- Monitor your mood patterns
- Unlock achievements as you progress

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **State Management**: React Hooks

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features Implementation

#### Data Persistence
All data is stored in browser localStorage:
- Quests: `lifeQuestData`
- User progress: `lifeQuestUser`
- Achievements: `lifeQuestAchievements`
- Mood history: `lifeQuestMoodHistory`

#### Level System
- Level formula: `Math.floor(Math.sqrt(exp / 100)) + 1`
- EXP requirements increase exponentially
- Level up animations and notifications

#### Achievement System
- Automatic achievement detection
- Category-based achievements
- Milestone rewards
- Visual achievement display

## 🎨 Customization

### Themes
The app supports dynamic theming based on:
- Time of day (morning/evening)
- User level
- Achievement unlocks

### Motivation Messages
Customize motivation messages by editing the `getMotivationMessages` function in `MotivationEngine.tsx`.

### Quest Categories
Add new categories by updating the `QuestCategory` type in `types/index.ts`.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Privacy & Security

- **100% Local Storage**: No data sent to external servers
- **No Tracking**: No analytics or user tracking
- **Offline First**: Works without internet connection
- **Data Control**: Users can reset all data anytime

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Inspired by RPG gaming mechanics
- Built with modern web technologies
- Designed for maximum user engagement
- Focused on productivity and well-being

---

**Ready to start your quest?** 🚀

Transform your daily tasks into an epic adventure with Life Quest!
