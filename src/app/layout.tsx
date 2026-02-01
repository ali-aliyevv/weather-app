import type { Metadata } from "next";
import "./global.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather App | Next.js",
  description:
    "Production-ready weather app built with Next.js 14, TypeScript, TailwindCSS and OpenWeather API.",
  metadataBase: new URL("https://weather-app-five-omega-17.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
