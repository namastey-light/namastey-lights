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
				neon: {
					pink: 'hsl(var(--neon-orange))',
					blue: 'hsl(var(--neon-blue))',
					purple: 'hsl(var(--neon-purple))',
					green: 'hsl(var(--neon-green))',
					yellow: 'hsl(var(--neon-yellow))',
					orange: 'hsl(var(--neon-orange))',
					white: 'hsl(var(--neon-white))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-shift': 'gradientShift 3s ease infinite',
				'neon-pulse': 'neonPulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'orbitron': ['Orbitron', 'monospace'],
				'rajdhani': ['Rajdhani', 'sans-serif'],
				'passion-one': ['Passion One', 'cursive'],
				'dancing-script': ['Dancing Script', 'cursive'],
				'flavors': ['Flavors', 'cursive'],
				'ewert': ['Ewert', 'cursive'],
				'fugaz-one': ['Fugaz One', 'cursive'],
				'monoton': ['Monoton', 'cursive'],
				'abril-fatface': ['Abril Fatface', 'cursive'],
				'playfair-display': ['Playfair Display', 'serif'],
				'press-start': ['Press Start 2P', 'cursive'],
				'audiowide': ['Audiowide', 'cursive'],
				'permanent-marker': ['Permanent Marker', 'cursive'],
				'rubik-glitch': ['Rubik Glitch', 'cursive'],
				'rock-salt': ['Rock Salt', 'cursive'],
				'special-elite': ['Special Elite', 'cursive'],
				'edu-cursive' :['Edu NSW ACT Hand', 'cursive'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
