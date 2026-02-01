import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather App | Next.js",
  description:
    "Production-ready weather app built with Next.js 14, TypeScript, TailwindCSS and OpenWeather API.",
  metadataBase: new URL("https://weather-app-five-omega-17.vercel.app"),
  openGraph: {
    title: "Weather App | Next.js",
    description:
      "Weather app with city search, geolocation, and 7-day forecast. Built with Next.js 14.",
    url: "https://weather-app-five-omega-17.vercel.app",
    siteName: "Weather App",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
