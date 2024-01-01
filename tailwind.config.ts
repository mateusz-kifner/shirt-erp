import { type Config } from "tailwindcss";
import { type PluginAPI } from "tailwindcss/types/config";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
        pop: {
          "0%": {
            transform: "scale( 0.95)",
          },
          "40%": {
            transform: "scale(1.02)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "border-from-bottom": {
          "0%": {
            backgroundSize: "100% 100%,100% 100%",
          },
          "2%": {
            backgroundSize: "100% 100%,102% 10%",
          },
          "10%": {
            backgroundSize: "100% 100%,140% 10%",
          },
          "12%": {
            backgroundSize: "100% 100%,300% 10%",
          },
          "18%": {
            backgroundSize: "50% 100%,400% 200%",
          },
          "24%": {
            backgroundSize: "0% 100%,400% 200%",
          },
          "36%": {
            backgroundSize: "0% 100%,400% 200%",
          },
          "48%": {
            backgroundSize: "0% 100%,400% 200%",
          },
          "100%": {
            backgroundSize: "0% 100%,400% 200%",
          },
        },

        show: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pop: "pop  0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        show: "show 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "border-from-bottom": "border-from-bottom 1000ms ease-out forwards",
      },
      opacity: {
        15: ".15",
      },
      backgroundImage: {
        "gradient-circle": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-ellipse-b":
          "radial-gradient(ellipse at bottom,var(--tw-gradient-stops))",
        "gradient-ellipse-t":
          "radial-gradient(ellipse at top,var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addVariant }: PluginAPI) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
} satisfies Config;
