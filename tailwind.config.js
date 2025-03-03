/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
      extend: {
        backgroundImage: {
          'section_one': "url('Assets/Images/law.jpg')",
        }
    },
  },
  plugins: [],
}

