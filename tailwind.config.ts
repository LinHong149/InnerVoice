import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          "base-100": "#282A35",
          "base-200": "#1A1E23",
          "neutral": "#D6D7DB",
          "primary": "#24252F",
          "secondary": "#424556",
          "success": "#D6D7DB",
          "error": "#D6D7DB",
        },
        light: {
          "base-100": "#CDD6E4",
          "base-200": "#7A89A1",
          "neutral": "#222325",
          "primary": "#5e81ac",
          "secondary": "#81a1c1",
          "success": "#222325",
          "error": "#222325",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
export default config
