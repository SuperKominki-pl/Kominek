/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'backgroundColor': '#13131A;',
                'accentColor': '#18E8B7',
                'backgroundLightColor': '#1E1E28',
                'backgroundDarkColor': '#0C0C10',
                'greyTextColor': '#9198A2',
            }
        },
    },
    plugins: [],
}
