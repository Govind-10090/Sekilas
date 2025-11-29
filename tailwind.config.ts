import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  			serif: ['Playfair Display', 'serif'],
  		},
  		colors: {
  			background: '#f8f6f2',
  			cream: '#f5ede6',
  			gray: {
  				50: '#fafafa',
  				100: '#f4f4f5',
  				200: '#e5e7eb',
  				300: '#d4d4d8',
  				400: '#a1a1aa',
  				500: '#71717a',
  				600: '#52525b',
  				700: '#3f3f46',
  				800: '#27272a',
  				900: '#18181b',
  			},
  			gold: {
  				DEFAULT: '#D4AF37',
  				light: '#ffe9a7',
  				dark: '#a8891b',
  			},
  			burgundy: {
  				DEFAULT: '#800020',
  				light: '#b04a5a',
  				dark: '#4b0014',
  			},
  			navy: {
  				DEFAULT: '#23395d',
  				light: '#3a4a6b',
  				dark: '#101624',
  			},
  			accent: {
  				DEFAULT: '#D4AF37',
  			},
  			foreground: '#f8f8f8',
  			card: {
  				DEFAULT: '#181e2a',
  				foreground: '#f8f8f8',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				foreground: '#101624',
  			},
  			secondary: {
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				foreground: '#a0a0a0',
  			},
  			destructive: {
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: '#E5E4E2',
  			input: 'hsl(var(--input))',
  			ring: '#D4AF37',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			success: {
  				foreground: '#fff',
  			},
  			platinum: {
  				foreground: '#101624',
  			},
  			champagne: {
  				foreground: '#101624',
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: '1.5rem',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		boxShadow: {
  			glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  			gold: '0 0 16px 0 #D4AF3744',
  			card: '0 2px 16px 0 #e5e7eb33',
  		},
  		backdropBlur: {
  			glass: '12px',
  		},
  		fontSize: {
  			'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  			'headline': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
  			'body-lg': ['1.25rem', { lineHeight: '1.7' }],
  			'body': ['1.125rem', { lineHeight: '1.7' }],
  		},
  		gridTemplateColumns: {
  			'news-2': 'repeat(2, minmax(0, 1fr))',
  			'news-3': 'repeat(3, minmax(0, 1fr))',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
};
export default config;
