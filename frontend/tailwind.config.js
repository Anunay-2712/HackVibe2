/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f1c',
        cyan: {
          DEFAULT: '#22d3ee',
          500: '#06b6d4',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          500: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
      animation: {
        'pulse-cyan': 'pulse-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan-line 3s linear infinite',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px 0px rgba(34, 211, 238, 0.5)' },
          '50%': { opacity: .5, boxShadow: '0 0 5px 0px rgba(34, 211, 238, 0.2)' },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      }
    },
  },
  plugins: [],
}
