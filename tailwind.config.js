/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,jsx,js}"],
  darkMode: "media",
  prefix: "plasmo-",
  important: true, // Ensures styles work in Shadow DOM
  corePlugins: {
    preflight: false // Disable base styles reset for Shadow DOM compatibility
  }
}
