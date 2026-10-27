import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chalk: v("chalk"),
        surface: v("surface"),
        ink: v("ink"),
        muted: v("muted"),
        line: v("line"),
        plate: v("plate"),
        ember: v("ember"),
        mat: v("mat"),
        onplate: v("onplate"),
      },
      fontFamily: { sans: ["var(--font-archivo)", "system-ui", "sans-serif"] },
      borderRadius: { card: "var(--r)", ctl: "calc(var(--r) * 0.6)" },
    },
  },
  plugins: [],
};

export default config;
