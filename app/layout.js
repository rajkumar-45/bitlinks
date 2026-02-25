import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionWrapper from "./components/SessionWrapper";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bitlinks | Your Professional URL Shortener",
  description: "Shorten, track, and manage your links with enterprise-grade features.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-brand-primary selection:text-white`}
      >
        <SessionWrapper>
          <ThemeProvider>
            <Toaster position="top-right" />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
