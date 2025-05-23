// filepath: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
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
			  border: "hsl(var(--border))",
			  input: "hsl(var(--input))",
			  ring: "hsl(var(--ring))",
			  background: "hsl(var(--background))",
			  foreground: "hsl(var(--foreground))",
			  primary: {
				DEFAULT: "hsl(var(--primary))",
				foreground: "hsl(var(--primary-foreground))",
			  },
			  secondary: {
				DEFAULT: "hsl(var(--secondary))",
				foreground: "hsl(var(--secondary-foreground))",
			  },
			  destructive: {
				DEFAULT: "hsl(var(--destructive))",
				foreground: "hsl(var(--destructive-foreground))",
			  },
			  muted: {
				DEFAULT: "hsl(var(--muted))",
				foreground: "hsl(var(--muted-foreground))",
			  },
			  accent: {
				DEFAULT: "hsl(var(--accent))",
				foreground: "hsl(var(--accent-foreground))",
			  },
			  popover: {
				DEFAULT: "hsl(var(--popover))",
				foreground: "hsl(var(--popover-foreground))",
			  },
			  card: {
				DEFAULT: "hsl(var(--card))",
				foreground: "hsl(var(--card-foreground))",
			  },
			  // Custom color palette with purple focus
			  violet: {
				50: "#f5f3ff",
				100: "#ede9fe",
				200: "#ddd6fe",
				300: "#c4b5fd",
				400: "#a78bfa",
				500: "#8b5cf6",
				600: "#7c3aed",
				700: "#6d28d9",
				800: "#5b21b6",
				900: "#4c1d95",
				950: "#2e1065",
			  },
			  purple: {
				50: "#faf5ff",
				100: "#f3e8ff",
				200: "#e9d5ff",
				300: "#d8b4fe",
				400: "#c084fc",
				500: "#a855f7",
				600: "#9333ea",
				700: "#7e22ce",
				800: "#6b21a8",
				900: "#581c87",
				950: "#3b0764",
			  },
			  fuchsia: {
				50: "#fdf4ff",
				100: "#fae8ff",
				200: "#f5d0fe",
				300: "#f0abfc",
				400: "#e879f9",
				500: "#d946ef",
				600: "#c026d3",
				700: "#a21caf",
				800: "#86198f",
				900: "#701a75",
				950: "#4a044e",
			  },
			},
			borderRadius: {
			  lg: "var(--radius)",
			  md: "calc(var(--radius) - 2px)",
			  sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
			  "accordion-down": {
				from: { height: "0" },
				to: { height: "var(--radix-accordion-content-height)" },
			  },
			  "accordion-up": {
				from: { height: "var(--radix-accordion-content-height)" },
				to: { height: "0" },
			  },
			  blob: {
				"0%": {
				  transform: "translate(0px, 0px) scale(1)",
				},
				"33%": {
				  transform: "translate(30px, -50px) scale(1.1)",
				},
				"66%": {
				  transform: "translate(-20px, 20px) scale(0.9)",
				},
				"100%": {
				  transform: "translate(0px, 0px) scale(1)",
				},
			  },
			},
			animation: {
			  "accordion-down": "accordion-down 0.2s ease-out",
			  "accordion-up": "accordion-up 0.2s ease-out",
			  blob: "blob 15s infinite",
			},
		  },
  },
  plugins: [require("tailwindcss-animate")],
}

