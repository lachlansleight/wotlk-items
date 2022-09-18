const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                neutral: colors.zinc,
                primary: colors.sky,
                secondary: colors.green,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
    safelist: [
        "border-gray-400",
        "border-white",
        "border-green-500",
        "border-blue-500",
        "border-purple-500",
        "border-orange-500",
        "border-orange-200",
        "text-gray-400",
        "text-white",
        "text-green-500",
        "text-blue-500",
        "text-purple-500",
        "text-orange-500",
        "text-orange-200",
    ],
};
