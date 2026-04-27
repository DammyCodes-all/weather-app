/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        void: '#080810',
        surface: '#0F0F1A',
        'surface-2': '#161626',
        accent: '#4169FF',
        warm: '#C9873A',
        'text-primary': '#F0EDE8',
        'text-muted': '#5A5A72',
        'text-ghost': '#2E2E45',
      },
      fontFamily: {
        serif: ['DMSerifDisplay_400Regular'],
        mono: ['IBMPlexMono_400Regular'],
        'mono-mid': ['IBMPlexMono_500Medium'],
      },
    },
  },
  plugins: [],
};
