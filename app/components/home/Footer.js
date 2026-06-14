import { Link2, Twitter, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8FAFC] border-t border-brand-primary/10 pt-20 pb-10 px-6 md:px-16 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-16 relative z-10">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Link2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight font-poppins text-foreground">BlinkURL</span>
          </Link>
          <p className="text-brand-muted leading-relaxed font-inter">
            Privacy first, fast, and secure URL shortener. Build connections and track your links with ease. 
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 w-full md:w-auto font-inter">
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-foreground">Product</h4>
            <Link href="#features" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">Features</Link>
            <Link href="#how-it-works" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">How it works</Link>
            <Link href="/pricing" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">Pricing</Link>
          </div>
          
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-foreground">Resources</h4>
            <Link href="/docs" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">Documentation</Link>
            <Link href="/blog" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">Blog</Link>
            <Link href="/github" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">GitHub</Link>
          </div>

          <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
            <h4 className="font-bold text-foreground">Legal</h4>
            <Link href="/privacy" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-brand-muted hover:text-brand-primary hover:translate-x-1 transition-all">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-brand-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <p className="text-brand-muted text-sm flex items-center gap-1 font-inter">
          &copy; {currentYear} BlinkURL. Built with Next.js + Vercel.
        </p>
        
        <div className="flex items-center gap-3">
          <a href="#" className="p-2.5 rounded-full bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="p-2.5 rounded-full bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="p-2.5 rounded-full bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
