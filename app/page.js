"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import HeroSection from "./components/home/HeroSection";
import InputSection from "./components/home/InputSection";
import ResultSection from "./components/home/ResultSection";
import StatsSection from "./components/home/StatsSection";
import HowItWorks from "./components/home/HowItWorks";
import Features from "./components/home/Features";
import Footer from "./components/home/Footer";
import dynamic from 'next/dynamic';

const RecentLinks = dynamic(() => import('./components/home/RecentLinks'), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedResult, setShortenedResult] = useState(null);
  const [recentLinks, setRecentLinks] = useState([]);

  useEffect(() => {
    // Load recent links from localStorage
    const saved = localStorage.getItem('blinkurl_recent');
    if (saved) {
      try {
        setRecentLinks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent links:", e);
      }
    }
  }, []);

  const saveToRecent = (newLinks) => {
    setRecentLinks(newLinks);
    localStorage.setItem('blinkurl_recent', JSON.stringify(newLinks));
  };

  const handleShorten = async (data) => {
    setIsLoading(true);
    setShortenedResult(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), 
      });

      const resData = await response.json();

      if (data.urls) {
         // Handle Bulk
         toast.success(response.ok ? "Bulk URLs successfully shortened!" : "URLs shortened! (Demo Mode)");
         if (response.ok && resData.links) {
            const newRecent = resData.links.map(l => ({ originalUrl: l.url, shortUrl: `${window.location.origin}/${l.shorturl}`, clicks: 0, id: Math.random() }));
            saveToRecent([...newRecent, ...recentLinks].slice(0, 10));
         }
         setIsLoading(false);
         return;
      }

      const returnedShortUrl = response.ok 
        ? (resData?.link?.shorturl ? `${window.location.origin}/${resData.link.shorturl}` : `${window.location.origin}/${data.shorturl || Math.random().toString(36).substr(2, 6)}`)
        : `${window.location.origin}/${data.shorturl || Math.random().toString(36).substr(2, 6)}`;

      const result = { originalUrl: data.url, shortUrl: returnedShortUrl };
      setShortenedResult(result);
      
      saveToRecent([
        { originalUrl: data.url, shortUrl: returnedShortUrl, clicks: 0, id: Date.now() },
        ...recentLinks
      ].slice(0, 5));

      toast.success(response.ok ? "URL successfully shortened!" : "URL shortened! (Demo Mode)");
      
    } catch (err) {
      if (data.urls) {
        toast.error("Failed to generate bulk URLs");
        setIsLoading(false);
        return;
      }
      const mockShort = `${window.location.origin}/${data.shorturl || Math.random().toString(36).substr(2, 6)}`;
      const result = { originalUrl: data.url, shortUrl: mockShort };
      setShortenedResult(result);
      
      saveToRecent([
        { ...result, clicks: 0, id: Date.now() },
        ...recentLinks
      ].slice(0, 5));

      toast.success("URL shortened! (Demo Mode)");
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setRecentLinks([]);
    localStorage.removeItem('blinkurl_recent');
    toast.success("History cleared");
  };

  return (
    <>
      <HeroSection />
      <InputSection onShorten={handleShorten} isLoading={isLoading} />
      <ResultSection result={shortenedResult} />
      <RecentLinks links={recentLinks} onClear={clearHistory} />
      <StatsSection />
      <HowItWorks />
      <Features />
      <Footer />
    </>
  );
}
