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
                home: "#eee",
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
                "color-accent": "#0b24b5", // blue
                "color-contrast": "#222", // black
            },
            dark: {
                home: "#222",
                primary: "#313338",
                secondary: "#2b2d31",
                accent: "#232428",
                "secondary-accent": "#1e1f22",
                hover: "#3a3c41",
                text: "#e9eaeb",
                "message-hover": "#2e3035",
                "text-faded": "#dbdee1",
                "text-faded-2": "#949ba4",
                "accent-2": "#111214",
                "bgray-1": "#2e2f34",
                "scrollbar-bar": "#1a1b1e",
                "color-accent": "#0b24b5", // blue
                "color-contrast": "#eee", // white
            },
            darker: {
                home: "#222",
                primary: "#17181a",
                secondary: "#171717",
                accent: "#0d0d0d",
                "secondary-accent": "#0a0a0a",
                hover: "#1f1f1f",
                text: "#e9eaeb",
                "message-hover": "#2e3035",
                "text-faded": "#dbdee1",
                "text-faded-2": "#949ba4",
                "accent-2": "#111214",
                "bgray-1": "#2e2f34",
                "scrollbar-bar": "#1a1b1e",
                "color-accent": "#0b24b5", // blue
                "color-contrast": "#eee", // white
            },
        }),
        require("tailwind-scrollbar"),
    ],
    variants: {
        scrollbar: ["rounded"],
    },
};
