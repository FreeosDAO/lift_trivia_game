/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Text colors
        'primary': '#ffffff',
        'secondary': '#b3b3b3', 
        'muted': '#808080',
        'accent': '#EB5528',
        // Background colors  
        'tertiary': '#2a2a2a',
        // Border colors
        'default': 'rgba(255, 255, 255, 0.1)',
        'hover': 'rgba(255, 255, 255, 0.2)',
      },
      backgroundColor: {
        'primary': '#121212',
        'secondary': '#1e1e1e',
        'tertiary': '#2a2a2a',
        'accent': '#EB5528',
      },
      textColor: {
        'primary': '#ffffff',
        'secondary': '#b3b3b3', 
        'muted': '#808080',
        'accent': '#EB5528',
      },
      borderColor: {
        'default': 'rgba(255, 255, 255, 0.1)',
        'hover': 'rgba(255, 255, 255, 0.2)',
        'accent': '#EB5528',
      },
      borderRadius: {
        'default': '16px',
        'lg': '24px',
      },
    },
  },
  safelist: [
    // Ensure these custom classes are always included
    'bg-primary',
    'bg-secondary', 
    'bg-tertiary',
    'bg-accent',
    'text-primary',
    'text-secondary',
    'text-muted',
    'text-accent',
    'border-default',
    'border-hover',
    'border-accent',
    'hover:bg-tertiary',
    'hover:bg-secondary',
    'hover:text-primary',
    'hover:border-hover',
    'gradient-text',
    'card',
    'btn',
    'btn-primary',
    'btn-secondary',
    'hover-lift',
  ],
  plugins: [],
}