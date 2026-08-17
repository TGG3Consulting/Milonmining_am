import flowbitePlugin from "flowbite/plugin";
/** @type {import('tailwindcss').Config} */
export default {
    mode: 'jit',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
        'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
        // "./node_modules/tw-elements/dist/js/**/*.js"
    ],
    theme: {
        extend: {},
        fontWeight: {
            thin: '100',
            hairline: '100',
            extralight: '200',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '1000',
        }
    },
    darkMode: 'class',
    plugins: [
        flowbitePlugin,
        require('@tailwindcss/forms'),
        // require("tw-elements/dist/plugin.cjs")
    ],
}

