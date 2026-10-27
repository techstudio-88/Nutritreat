import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rackhouse – gym management for owners and members",
  description:
    "Memberships, billing, front-desk check-in, workouts and diet plans in one place, with a mobile app your members will actually open.",
};

export const viewport: Viewport = {
  themeColor: "#2540ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
