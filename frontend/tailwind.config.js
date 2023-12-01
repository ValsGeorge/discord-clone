/** @type {import('tailwindcss').Config} */
const { createThemes } = require("tw-colors");

module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {},
    },
    plugins: [
        createThemes({
            light: {
                primary: "#ffffff",
                secondary: "#f2f3f5",
                accent: "#e3e5e8",
                "secondary-accent": "#ebedef",
                hover: "#e0e1e5",
                text: "#060607",
            },
            dark: {
                primary: "#313338",
                secondary: "#2b2d31",
                accent: "#232428",
                "secondary-accent": "#1e1f22",
                hover: "#3a3c41",
                text: "#e9eaeb",
                "message-hover": "#2e3035",
            },
        }),
    ],
};
