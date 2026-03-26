import { Link2, Twitter, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background pt-16 pb-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-lg group-hover:shadow-brand-primary/50 transition-shadow">
              <Link2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight font-poppins">BitLinks</span>
          </Link>
          <p className="text-muted-foreground leading-relaxed">
            The premium URL shortener for modern teams. Fast, secure, and packed with analytics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground font-poppins">Product</h4>
            <Link href="#features" className="text-muted-foreground hover:text-brand-primary transition-colors">Features</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-brand-primary transition-colors">Pricing</Link>
            <Link href="/api" className="text-muted-foreground hover:text-brand-primary transition-colors">API</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground font-poppins">Resources</h4>
            <Link href="/docs" className="text-muted-foreground hover:text-brand-primary transition-colors">Documentation</Link>
            <Link href="/blog" className="text-muted-foreground hover:text-brand-primary transition-colors">Blog</Link>
            <Link href="/support" className="text-muted-foreground hover:text-brand-primary transition-colors">Help Center</Link>
          </div>

          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <h4 className="font-bold text-foreground font-poppins">Legal</h4>
            <Link href="/privacy" className="text-muted-foreground hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-brand-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm text-center md:text-left">
          &copy; {currentYear} BitLinks. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4">
          <a href="#" className="p-2 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-brand-primary transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-[#0077b5] transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
