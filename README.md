# ⚔️ Life Quest - Gamified Task Management

Transform your daily tasks into epic quests with Life Quest! This gamified productivity app makes completing tasks feel like an adventure, complete with EXP, leveling, achievements, and adaptive motivation systems.

## 🌟 Features

### 🎮 Core Gamification
- **Quest System**: Transform tasks into RPG-style quests
- **EXP & Leveling**: Gain experience points and level up
- **Achievements**: Unlock badges and milestones
- **Progress Tracking**: Visual progress bars and statistics

### 🧠 Adaptive Motivation Engine
- **Warrior Mode**: Direct, tough motivation for determined users
- **Healer Mode**: Gentle, supportive encouragement
- **Rogue Mode**: Fun, playful motivation with humor

### 📊 Advanced Features
- **Mood Tracking**: Track your mood after completing quests
- **Mood Insights**: Analyze productivity patterns
- **Daily/Weekly Goals**: Set and track personal targets
- **Quest Categories**: Organize by Belajar, Kerja, Kesehatan, etc.
- **Priority System**: High, Medium, Low priority quests
- **Search & Filter**: Find quests easily
- **Streak Tracking**: Maintain daily completion streaks

### 🎨 Visual Features
- **Dynamic Themes**: UI adapts to time and level
- **Glass Morphism**: Modern, beautiful interface
- **Smooth Animations**: Level up effects, quest completion
- **Responsive Design**: Works on all devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd life-quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
life-quest/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard (main page)
│   ├── add/page.tsx       # Add new quest
│   ├── edit/[id]/page.tsx # Edit quest
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── QuestCard.tsx      # Individual quest display
│   ├── QuestList.tsx      # Quest list container
│   ├── QuestForm.tsx      # Add/edit quest form
│   ├── LevelProgress.tsx  # User level & EXP
│   ├── FilterBar.tsx      # Search and filter
│   ├── MotivationEngine.tsx # Adaptive motivation
│   └── MoodTracker.tsx    # Mood tracking & insights
├── types/                 # TypeScript interfaces
│   └── index.ts          # Data models
├── utils/                 # Utility functions
│   └── localStorage.ts    # Data persistence
└── styles/               # Additional styles
```

## 🎯 How to Use

### Creating Your First Quest
1. Click the **"+ New Quest"** button
2. Fill in the quest details:
   - **Title**: What you want to accomplish
   - **Description**: More details about the quest
   - **Category**: Choose from Belajar, Kerja, Kesehatan, etc.
   - **Priority**: High, Medium, or Low
   - **EXP Reward**: How much experience you'll gain (10-500)
3. Click **"Create Quest"**

### Completing Quests
1. Click the circle next to a quest to mark it as "In Progress"
2. Click again to mark it as "Completed"
3. Choose your mood after completion
4. Watch your EXP and level increase!

### Motivation Modes
- **Warrior**: Direct, tough motivation
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
