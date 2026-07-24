/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        lime: {
          DEFAULT: '#C6FF3D',
          hover: '#B8F020',
        },
        'lime-text': '#0B0B0B',
        accent: {
          DEFAULT: '#3D5CFF',
          hover: '#2D4AEE',
        },
        surface: '#FFFFFF',
        'text-primary': '#0A0A0A',
        'text-secondary': '#6B6B6B',
        border: '#EAEAEA',
        success: '#22C55E',
        bg: '#FAFAFA',
      },
      fontFamily: {
        display: ['Clash Display', 'General Sans', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': '12px',
        xs: '14px',
        sm: '16px',
        base: '18px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      lineHeight: {
        display: '1.1',
        body: '1.5',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      borderRadius: {
        card: '20px',
        btn: '12px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 12px 24px -8px rgba(0,0,0,0.10)',
        'card-hover': '0 1px 2px rgba(0,0,0,0.04), 0 16px 32px -10px rgba(0,0,0,0.13)',
        modal: '0 4px 6px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(0,0,0,0.18)',
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        float: 'float 4s ease-in-out infinite',
        'counter-up': 'counterUp 2s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      maxWidth: {
        content: '65ch',
      },
    },
  },
  plugins: [],
}
