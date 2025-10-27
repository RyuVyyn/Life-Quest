/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New color palette
        'primary': '#0F0F14',        // Background utama - hitam kebiruan pekat
        'surface': '#1B1B25',        // Surface/Panel - latar konten
  'accent': '#8A2BE2',         // Accent utama - ungu royal (keputusan desain: tetap tersedia)
        'accent-secondary': '#FFB400', // Accent secondary - emas hangat
        'text-primary': '#E5E5E5',   // Text utama
        'text-secondary': '#9B9BA3', // Text sekunder
        'success': '#4ADE80',        // Success - quest selesai
        'danger': '#EF4444',         // Danger - hapus quest
        'highlight-hover': '#2D2D3A', // Highlight hover
        
        // Legacy colors for backward compatibility
        'quest-gold': '#FFB400',
  'quest-purple': '#3B82F6', // repurposed to a deep blue to reduce purple accents
        'quest-blue': '#3B82F6',
        'quest-green': '#4ADE80',
        'quest-red': '#EF4444',
        'quest-orange': '#FFB400',
      },
      animation: {
        'level-up': 'bounce 1s ease-in-out',
        'quest-complete': 'pulse 0.5s ease-in-out',
        'exp-gain': 'ping 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}
