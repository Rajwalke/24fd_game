
/** @type {import('tailwindcss').Config} */
export default{
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'balloon-fly': {
          '0%': { 
            transform: 'translateX(var(--fly-start-x)) translateY(0)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(var(--fly-end-x)) translateY(-100vh)',
            opacity: '0'
          }
        }
      },
      animation: {
        'balloon-fly': 'balloon-fly 8s linear forwards'
      }
    },
  },
  plugins: [],
}