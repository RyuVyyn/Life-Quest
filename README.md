# Life Quest - Gamified Task Management

Life Quest is a gamified task management application that transforms daily tasks into RPG-style quests. Complete quests to earn experience (EXP), level up, and unlock achievements while tracking mood and motivation.

## Features

### Core Features

- Quest system: create, edit, and delete quests with categories and priorities
- EXP rewards and leveling system
- Daily and weekly goal tracking
- Streak tracking based on local timezone
- Achievements and progress history

### Motivation & Mood

- Adaptive Motivation Engine with multiple modes (Warrior, Healer, Rogue)
- Mood tracking after quest completion
- Personalized motivational messages

### UX & Visuals

- Responsive dark-fantasy theme with glassmorphism
- Smooth animations and visual progress indicators
- Real-time UI updates via custom event dispatching

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React (Client components)
- Lucide React icons
- Browser localStorage for persistence

## Installation

### Prerequisites

- Node.js 18 or newer
- npm or yarn

### Quick Start

```bash
# Clone repository
git clone https://github.com/RyuVyyn/Life-Quest.git
cd Life-Quest

# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Life-Quest/
├── app/            # Next.js App Router pages and layout
├── components/     # React UI components
├── types/          # TypeScript interfaces and types
├── utils/          # Utilities and localStorage handlers
└── public/         # Static assets
```

## Key Features Explained

### Adaptive Motivation

- The Motivation Engine adjusts messaging based on recent activity and user-selected mode (Warrior/Healer/Rogue).

### Progression & Levels

- EXP is awarded for completed quests and used to calculate levels. Level thresholds scale with EXP to maintain challenge.

### Streaks

- Streaks are calculated using local timezone-aware dates to avoid errors at day boundaries.

## Configuration

- Customize theme colors in `tailwind.config.js`.
- Edit motivational messages in `components/MotivationEngine.tsx`.
- Adjust EXP/level formulas in `utils/localStorage.ts`.

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repository into Vercel and deploy the `main` branch

If you see build errors on Vercel, run a local production build (`npm run build`) to replicate and fix issues. Common problems include accidental injected text at the top of files or TypeScript errors in client components.

### Other platforms

- Netlify (for static exports)
- Any Node host that supports Next.js

## Configuration & Environment

- All data is stored locally by default; no server is required.

### Environment Variables

You can configure optional environment variables for deployments or when integrating with an API. Create a `.env.local` file in the project root for local development.

Example `.env.local`:

```
# Public app name (display or telemetry)
NEXT_PUBLIC_APP_NAME="Life Quest"

# Optional API URL (if you run a backend)
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

Notes:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Keep secrets off the client and use server-only env vars for sensitive values.
- For Vercel deployments, set these environment variables in the Vercel project settings instead of storing secrets in the repo.

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Make changes and test
4. Open a PR with a description of your changes

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- Icons by Lucide
- Built with Tailwind CSS and React

## Support

For support or issues, please open an issue in this repository.
