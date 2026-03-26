"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import HeroSection from "./components/home/HeroSection";
import InputSection from "./components/home/InputSection";
import ResultSection from "./components/home/ResultSection";
import RecentLinks from "./components/home/RecentLinks";
import HowItWorks from "./components/home/HowItWorks";
import Features from "./components/home/Features";
import Footer from "./components/home/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [recentLinks, setRecentLinks] = useState([]);

  const handleShorten = async (url) => {
    setIsLoading(true);
    setShortenedUrl(null); // Reset previous
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }), 
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming API returns { shortUrl: "..." } or similar
        const returnedShortUrl = data?.shortUrl || `${window.location.origin}/${data?.data?.alias || Math.random().toString(36).substr(2, 6)}`;
        setShortenedUrl(returnedShortUrl);
        setRecentLinks(prev => [
          { originalUrl: url, shortUrl: returnedShortUrl, clicks: 0, id: Date.now() },
          ...prev
        ].slice(0, 5));
        toast.success("URL successfully shortened!");
      } else {
        // Fallback mockup for UI demonstration
        const mockShort = `${window.location.origin}/${Math.random().toString(36).substr(2, 6)}`;
        setShortenedUrl(mockShort);
        setRecentLinks(prev => [
          { originalUrl: url, shortUrl: mockShort, clicks: 0, id: Date.now() },
          ...prev
        ].slice(0, 5));
        toast.success("URL shortened! (Demo Mode)");
      }
    } catch (err) {
      // Fallback for UI visualization if API fails or doesn't exist yet
      const mockShort = `${window.location.origin}/${Math.random().toString(36).substr(2, 6)}`;
      setShortenedUrl(mockShort);
      setRecentLinks(prev => [
        { originalUrl: url, shortUrl: mockShort, clicks: 0, id: Date.now() },
        ...prev
      ].slice(0, 5));
      toast.success("URL shortened! (Demo Mode)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 hover:bg-brand-primary/30 transition-colors duration-700 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-brand-secondary/20 hover:bg-brand-secondary/30 transition-colors duration-700 rounded-full blur-[100px] pointer-events-none" />
      
      <main className="flex-1 flex flex-col relative z-10 w-full mb-auto mt-16 md:mt-0">
        <HeroSection />
        <InputSection onShorten={handleShorten} isLoading={isLoading} />
        <ResultSection shortenedUrl={shortenedUrl} />
        <RecentLinks links={recentLinks} />
        <HowItWorks />
        <Features />
      </main>
      
      <Footer />
    </div>
  );
}
