import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = localFont({
  src: "./fonts/Poppins-ExtraBold.ttf",
  variable: "--font-poppins",
  weight: "800",
});

export const metadata = {
  title: "BlinkURL | Professional URL Shortener",
  description: "Shorten, track, and manage your links with enterprise-grade features.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} antialiased text-foreground bg-[#F8FAFC] selection:bg-brand-primary/20 selection:text-brand-primary`}
      >
        {/* Global animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#F8FAFC]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-[100px] mix-blend-multiply animate-blob" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-brand-secondary/10 rounded-full blur-[120px] mix-blend-multiply animate-blob" style={{ animationDelay: "4s" }} />
        </div>

        <SessionWrapper>
          <ThemeProvider>
            <Toaster 
              position="top-right" 
              toastOptions={{
                className: 'font-inter shadow-glass',
                style: {
                  background: 'white',
                  color: '#0F172A',
                  borderRadius: '16px',
                  border: '1px solid rgba(79, 70, 229, 0.1)',
                },
              }} 
            />
            <Navbar />
            <main className="min-h-screen relative z-0 flex flex-col pt-24">
              {children}
            </main>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
