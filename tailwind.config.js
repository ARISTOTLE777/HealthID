/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3B60',  // Deep Navy Blue – headers, footer, structural blocks
          light: '#E8F2FA',    // Navy tint – hover states, active bg
          dark: '#082D47',     // Darker navy – pressed states
        },
        teal: {
          DEFAULT: '#2BB3B1',  // Teal – secondary buttons, icons, decorative shapes
          light: '#E0F7F7',    // Teal tint
          dark: '#1F8A88',     // Deeper teal
        },
        cta: {
          DEFAULT: '#E55C13',  // Vibrant Orange – primary CTA buttons (Book Now, Submit)
          light: '#FDE9DD',    // Orange tint
          dark: '#C44E0F',     // Darker orange – pressed
        },
        surface: {
          DEFAULT: '#FFFFFF',  // Clean White – main page background
          card: '#F8F9FA',     // Light Grey – secondary section backgrounds, cards
        },
        alert: '#B32727',      // Deep Red – emergency banners, critical notices
        'text-primary': '#0B3B60',   // Navy – headings & body text
        'text-secondary': '#374151', // Slate – secondary labels
        'text-muted': '#6B7280',     // Grey – placeholders, captions
        border: '#E5E7EB',           // Light grey border
        success: '#16A34A',          // Green for success states
        warning: '#D97706',          // Amber for warnings
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-down': 'fadeDown 0.7s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-border': 'pulseBorder 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseBorder: {
          '0%, 100%': { borderColor: '#B32727', boxShadow: '0 0 0 0 rgba(179, 39, 39, 0.4)' },
          '50%': { borderColor: '#E55C13', boxShadow: '0 0 0 4px rgba(179, 39, 39, 0)' },
        },
      },
    },
  },
  plugins: [],
}
