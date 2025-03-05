
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Festival color palette
				festival: {
					red: '#e63946',
					gold: '#f1c40f',
					pink: '#ff758f',
					orange: '#ff7043',
					peach: '#ffab91',
					yellow: '#ffe082',
				},
				// Seasonal colors
				seasonal: {
					spring: {
						light: '#fdf2f8',
						DEFAULT: '#ec4899',
						dark: '#be185d'
					},
					summer: {
						light: '#fef3c7',
						DEFAULT: '#f59e0b',
						dark: '#b45309'
					},
					autumn: {
						light: '#ffedd5',
						DEFAULT: '#ea580c',
						dark: '#9a3412'
					},
					winter: {
						light: '#e0f2fe',
						DEFAULT: '#0ea5e9',
						dark: '#0369a1'
					}
				}
			},
			backgroundImage: {
				'festival-gradient': 'linear-gradient(to bottom, #fff5f5 0%, #fff0ea 100%)',
				'red-gradient': 'linear-gradient(to bottom, #e63946 0%, #d62828 100%)',
				'gold-gradient': 'linear-gradient(135deg, #f9d923 0%, #f1c40f 100%)',
				'card-gradient': 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,240,234,0.9) 100%)',
				'card-red-gradient': 'linear-gradient(to bottom, #ffe5e5 30%, #fff5f5 100%)',
				'card-gold-gradient': 'linear-gradient(to bottom, #fffde7 30%, #fffbeb 100%)',
				'card-gradient-horizontal': 'linear-gradient(90deg, #fff5f5 0%, #fff0ea 100%)',
				// Seasonal background gradients
				'spring-gradient': 'linear-gradient(to bottom, #fdf2f8 0%, #f5f3ff 100%)',
				'summer-gradient': 'linear-gradient(to bottom, #fef3c7 0%, #fffbeb 100%)',
				'autumn-gradient': 'linear-gradient(to bottom, #ffedd5 0%, #fff7ed 100%)',
				'winter-gradient': 'linear-gradient(to bottom, #e0f2fe 0%, #f0f9ff 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'zoom-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'floating': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-out': 'fade-out 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-in': 'slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
				'zoom-in': 'zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
				'pulse-light': 'pulse-light 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'floating': 'floating 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'glass-hover': '0 8px 32px rgba(0, 0, 0, 0.15)',
				'festival': '0 4px 15px rgba(230, 57, 70, 0.2)',
				'glow': '0 0 15px rgba(255, 255, 255, 0.5)',
				'neon': '0 0 10px rgba(230, 57, 70, 0.5), 0 0 20px rgba(230, 57, 70, 0.3), 0 0 30px rgba(230, 57, 70, 0.1)',
				'neon-gold': '0 0 10px rgba(241, 196, 15, 0.5), 0 0 20px rgba(241, 196, 15, 0.3), 0 0 30px rgba(241, 196, 15, 0.1)',
				'neon-green': '0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3), 0 0 30px rgba(34, 197, 94, 0.1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
