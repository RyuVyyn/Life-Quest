import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Life Quest - Gamified Task Management',
  description: 'Transform your daily tasks into epic quests with Life Quest - the gamified productivity app that makes completing tasks feel like an adventure!',
  keywords: 'productivity, task management, gamification, quest, RPG, level up, EXP, achievements',
  authors: [{ name: 'Life Quest Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8A2BE2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-primary`}>
        {children}
      </body>
    </html>
  )
}
