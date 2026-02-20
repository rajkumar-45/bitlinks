import Link from 'next/link';
import localfont from "next/font/local";

const poppins = localfont({
  src: "../fonts/Poppins-ExtraBold.ttf",
  variable: "--font-Poppins",
  weight: "800",
});

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 bg-purple-900/10 backdrop-blur-md border-b border-white/20 shadow-sm">
      <Link href="/">
        <div className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-pink-500 hover:scale-105 transition-transform duration-300 cursor-pointer ${poppins.className}`}>
          Bitlinks
        </div>
      </Link>
      
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-gray-700 font-semibold hover:text-purple-600 transition-colors relative group">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
        </Link>

        <Link href="/shorten" className="text-gray-700 font-semibold hover:text-purple-600 transition-colors relative group">
          Shorten
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
        </Link>
        
        <Link href="/github" className="text-gray-700 font-semibold hover:text-purple-600 transition-colors relative group">
          GitHub
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
        </Link>

        <Link href="/shorten">
            <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-5 py-2 rounded-full shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
            Get Started
            </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
