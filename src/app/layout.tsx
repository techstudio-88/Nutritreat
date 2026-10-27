import type { Metadata, Viewport } from "next";
import { Archivo, Bebas_Neue, Oswald, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "Rackhouse – the gym app you can make your own",
  description:
    "Memberships, billing, front-desk check-in, workouts and diet plans, plus a member app that looks exactly how you design it.",
};

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-bg="mesh"
      data-card="glass"
      data-glow="on"
      data-font="bebas"
      className={`${archivo.variable} ${bebas.variable} ${oswald.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div className="bg-layer" aria-hidden>
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
