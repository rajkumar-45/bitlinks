"use client"
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, Link as LinkIcon, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass-panel px-6 py-3 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'shadow-glass' : 'bg-white/40 border-transparent shadow-none'}`}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary p-2 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-glow">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary font-poppins tracking-tight">
              BlinkURL
            </div>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center bg-white/50 px-6 py-2 rounded-full border border-white/60">
            <Link href="/" className="text-sm font-semibold text-brand-muted hover:text-brand-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-brand-muted hover:text-brand-primary transition-colors">
              How it works
            </Link>
            <Link href="/github" className="text-sm font-semibold text-brand-muted hover:text-brand-primary transition-colors">
              GitHub
            </Link>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-xl text-brand-muted hover:bg-brand-light hover:text-brand-primary transition-all hover-lift" 
                title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {session ? (
              <div className="flex gap-3 items-center">
                <Link href="/dashboard" className="p-2 rounded-xl text-brand-muted hover:bg-brand-light hover:text-brand-primary transition-all hover-lift" title="Dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-brand-light px-4 py-2 rounded-xl border border-brand-primary/10">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary truncate max-w-[100px]">{session.user.name}</span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="p-2 rounded-xl text-brand-muted hover:text-red-500 hover:bg-red-50 transition-all hover-lift"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link href="/login" className="text-sm font-semibold text-brand-muted hover:text-brand-primary transition-colors">
                  Login
                </Link>
                <Link href="/register">
                  <button className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-6 rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-brand-muted hover:bg-brand-light rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <button 
              onClick={toggleTheme} 
              className="md:hidden p-2 text-brand-muted hover:bg-brand-light rounded-xl transition-colors ml-2" 
          >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 px-6 md:hidden"
          >
            <div className="glass-panel p-4 flex flex-col gap-4">
              <Link href="/" className="px-4 py-2 hover:bg-brand-light rounded-xl font-medium text-brand-muted">Features</Link>
              <Link href="#how-it-works" className="px-4 py-2 hover:bg-brand-light rounded-xl font-medium text-brand-muted">How it works</Link>
              <Link href="/github" className="px-4 py-2 hover:bg-brand-light rounded-xl font-medium text-brand-muted">GitHub</Link>
              <div className="h-px bg-brand-primary/10 my-2" />
              {session ? (
                 <div className="flex flex-col gap-2">
                    <Link href="/dashboard" className="px-4 py-2 hover:bg-brand-light rounded-xl font-medium text-brand-muted flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5"/> Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="px-4 py-2 hover:bg-red-50 text-red-500 rounded-xl font-medium text-left flex items-center gap-2">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                 </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="px-4 py-2 text-center font-medium text-brand-muted hover:bg-brand-light rounded-xl">Login</Link>
                  <Link href="/register" className="bg-brand-primary text-white text-center py-2 rounded-xl font-medium shadow-soft">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
