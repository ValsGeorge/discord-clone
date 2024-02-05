/** @type {import('tailwindcss').Config} */
const { createThemes } = require("tw-colors");

module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            fontSize: {
                xxs: ["0.625rem", { lineHeight: "1rem" }],
            },
            fontFamily: {
                disc: ["Fragment Mono"],
            },
            letterSpacing: {
                extraTight: "-0.05em",
                superTight: "-0.0.8em",
            },
        },
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
                "message-hover": "#f4f5f7",
                "text-faded": "#121213",
                "accent-2": "#ffffff",
                "bgray-1": "#e1e2e4",
                "scrollbar-bar": "#c4c9ce",
            },
            dark: {
                primary: "#313338",
                secondary: "#2b2d31",
                accent: "#232428",
                "secondary-accent": "#1e1f22",
                hover: "#3a3c41",
                text: "#e9eaeb",
                "message-hover": "#2e3035",
                "text-faded": "#dbdee1",
                "accent-2": "#111214",
                "bgray-1": "#2e2f34",
                "scrollbar-bar": "#1a1b1e",
            },
        }),
        require("tailwind-scrollbar"),
    ],
    variants: {
        scrollbar: ["rounded"],
    },
};
