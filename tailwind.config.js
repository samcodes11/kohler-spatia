/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1C1714',
          muted: '#362E28',
          dark: '#110D0B',
        },
        porcelain: {
          DEFAULT: '#FAEFF1', // Band 1 (Lightest / Primary App Background)
          pure: '#FFFFFF',
          warm: '#F3DFD2',    // Band 2 (Cards / Warm Peach-Sand Surfaces)
          dark: '#D8D0C3',    // Band 3 (Mid-tone / Warm Stone)
        },
        brass: {
          DEFAULT: '#825916',
          light: '#9C6E21',
          dark: '#61400C',
        },
        stone: {
          DEFAULT: '#2E2722',
          muted: '#4A423B',
          light: '#C9BBA9',
          dark: '#1C1714',
          border: 'rgba(74, 66, 59, 0.25)',
        },
        band: {
          1: '#FAEFF1', // Lightest / Background
          2: '#F3DFD2', // Cards / Surfaces
          3: '#D8D0C3', // Mid-tone / Borders
          4: '#C9BBA9', // Deep Accent / Taupe
        },
        accent: {
          DEFAULT: 'var(--color-accent, #825916)',
          hover: 'var(--color-accent-hover, #6B480F)',
          soft: 'var(--color-accent-soft, rgba(130, 89, 22, 0.14))',
          subtle: 'var(--color-accent-subtle, rgba(130, 89, 22, 0.06))',
        }
      },
      fontFamily: {
        serif: ['"Montserrat"', 'sans-serif'],
        sans: ['"Montserrat"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'editorial': '0 20px 40px -15px rgba(28, 33, 38, 0.07)',
        'luxury': '0 30px 60px -20px rgba(28, 33, 38, 0.12)',
        'accent': '0 10px 30px -10px var(--color-accent-soft, rgba(174, 138, 78, 0.25))',
      },
      letterSpacing: {
        'brand': '0.18em',
        'subhead': '0.12em',
      }
    },
  },
  plugins: [],
}
