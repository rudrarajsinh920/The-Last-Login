/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          950: '#0E1713',
          900: '#18251F', // Midnight Olive primary
          800: '#23362D',
          700: '#31493E',
          600: '#436153',
          100: '#E4EAE6',
          50: '#F1F5F3',
        },
        parchment: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F5EFE3', // Warm Parchment primary
          300: '#EDE2D0',
          400: '#E2D3BC',
          500: '#D5C1A4',
          900: '#3D362C',
        },
        marigold: {
          50: '#FDF8EC',
          100: '#FAEFD0',
          200: '#F4DC9E',
          300: '#ECC66B',
          400: '#E3B242',
          500: '#D99A35', // Marigold primary
          600: '#BF7D25',
          700: '#995C1C',
        },
        terracotta: {
          50: '#FAF3F0',
          100: '#F3E4DE',
          200: '#E8C8BC',
          300: '#D9A796',
          400: '#CA8671',
          500: '#B96F54', // Terracotta primary
          600: '#9F553C',
          700: '#7F3F2A',
        },
        sage: {
          50: '#F4F6F2',
          100: '#E7ECE2',
          200: '#D2E1CD', // Light Sage
          300: '#B4C5A5',
          400: '#9EAF8E',
          500: '#8C9A7A', // Sage primary
          600: '#727E61',
          700: '#58624B',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Larken', 'Georgia', 'serif'],
        sans: ['DM Sans', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft-card': '0 4px 20px -2px rgba(24, 37, 31, 0.06), 0 2px 6px -1px rgba(24, 37, 31, 0.04)',
        'elevated': '0 12px 32px -4px rgba(24, 37, 31, 0.12), 0 4px 12px -2px rgba(24, 37, 31, 0.06)',
        'glow-marigold': '0 0 24px -2px rgba(217, 154, 53, 0.28)',
        'glow-candle': '0 0 32px 4px rgba(217, 154, 53, 0.22)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
