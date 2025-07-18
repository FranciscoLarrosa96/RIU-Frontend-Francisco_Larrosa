/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}" 
  ],
  theme: {
    extend: {
      colors: {
        main: '#dd0e7c',           
        secondary: '#6b1d68',      
        background: '#f9fafb',    
        border: '#fcd6e2',         
        hover: '#c6006d',          
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'] 
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.1)' 
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }
    }
  },
  plugins: []
}
