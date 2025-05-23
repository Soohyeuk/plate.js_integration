import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			brand: {
    				DEFAULT: 'hsl(var(--brand))',
    				foreground: 'hsl(var(--brand-foreground))'
    			},
    			highlight: {
    				DEFAULT: 'hsl(var(--highlight))',
    				foreground: 'hsl(var(--highlight-foreground))'
    			}
    		},
    		fontFamily: {
    			heading: [
    				'var(--font-heading)',
    				'ui-sans-serif',
    				'-apple-system',
    				'BlinkMacSystemFont',
    				'Segoe UI Variable Display',
    				'Segoe UI',
    				'Helvetica',
    				'Apple Color Emoji',
    				'Arial',
    				'sans-serif',
    				'Segoe UI Emoji',
    				'Segoe UI Symbol',
    				'Noto Color Emoji'
    			],
    			mono: [
    				'var(--font-mono)',
    				...require("tailwindcss/defaultTheme").fontFamily.mono
    			],
    			sans: [
    				'var(--font-sans)',
    				'ui-sans-serif',
    				'-apple-system',
    				'BlinkMacSystemFont',
    				'Segoe UI Variable Display',
    				'Segoe UI',
    				'Helvetica',
    				'Apple Color Emoji',
    				'Arial',
    				'sans-serif',
    				'Segoe UI Emoji',
    				'Segoe UI Symbol',
    				'Noto Color Emoji'
    			]
    		}
    	}
    }
}
export default config 