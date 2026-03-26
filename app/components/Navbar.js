"use client"
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, Link as LinkIcon } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-gradient font-poppins">
            Bitlinks
          </div>
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/shorten" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Shorten
          </Link>
          <Link href="/github" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </Link>
        </div>

        <div className="flex gap-4 items-center">

          {session ? (
            <div className="flex gap-3 items-center ml-2 border-l border-border pl-4">
              <Link href="/dashboard" className="p-2 rounded-xl text-muted-foreground hover:bg-black/5 transition-colors" title="Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <div className="hidden md:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-xl">
                <User className="w-4 h-4 text-brand-primary" />
                <span className="text-sm font-semibold truncate max-w-[100px]">{session.user.name}</span>
              </div>
              <button 
                onClick={() => signOut()}
                className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3 items-center ml-2 border-l border-border pl-4">
              <Link href="/login" className="text-sm font-semibold hover:text-brand-primary transition-colors">
                Login
              </Link>
              <Link href="/register">
                <button className="btn-primary py-2 px-5 text-sm">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
