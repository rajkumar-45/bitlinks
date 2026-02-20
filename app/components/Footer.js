import Link from 'next/link';
import localfont from "next/font/local";

const poppins = localfont({
  src: "../fonts/Poppins-ExtraBold.ttf",
  variable: "--font-Poppins",
  weight: "800",
});

const Footer = () => {
    return (
        <footer className="bg-purple-950 text-white pt-12 pb-6 relative overflow-hidden">
             {/* Decorative Top Border */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Brand Column */}
                <div className="flex flex-col gap-4">
                    <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 ${poppins.className}`}>Bitlinks</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        The most straightforward and professional URL shortener for your business and personal needs. Secure, fast, and reliable.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-lg mb-2">Product</h3>
                    <Link href="/shorten" className="text-gray-400 hover:text-white transition-colors text-sm">Shortener</Link>
                    <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors text-sm">Analytics</Link>
                    <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
                </div>

                {/* Resources */}
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-lg mb-2">Resources</h3>
                    <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link>
                    <Link href="/developers" className="text-gray-400 hover:text-white transition-colors text-sm">Developers</Link>
                    <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link>
                </div>

                {/* Legal / Social */}
                <div className="flex flex-col gap-3">
                     <h3 className="font-bold text-lg mb-2">Legal</h3>
                    <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                    <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Bitlinks. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
// import Link from 'next/link';
// import localfont from "next/font/local";

// const poppins = localfont({
//   src: "../fonts/Poppins-ExtraBold.ttf",
//   variable: "--font-Poppins",
//   weight: "800",
// });

// const Footer = () => {
//     return (
//         <footer className="bg-purple-950 text-white pt-12 pb-6 relative overflow-hidden">
//              {/* Decorative Top Border */}
//              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>

//             <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//                 {/* Brand Column */}
//                 <div className="flex flex-col gap-4">
//                     <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 ${poppins.className}`}>Bitlinks</h2>
//                     <p className="text-gray-400 text-sm leading-relaxed">
//                         The most straightforward and professional URL shortener for your business and personal needs. Secure, fast, and reliable.
//                     </p>
//                 </div>

//                 {/* Quick Links */}
//                 <div className="flex flex-col gap-3">
//                     <h3 className="font-bold text-lg mb-2">Product</h3>
//                     <Link href="/shorten" className="text-gray-400 hover:text-white transition-colors text-sm">Shortener</Link>
//                     <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors text-sm">Analytics</Link>
//                     <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
//                 </div>

//                 {/* Resources */}
//                 <div className="flex flex-col gap-3">
//                     <h3 className="font-bold text-lg mb-2">Resources</h3>
//                     <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link>
//                     <Link href="/developers" className="text-gray-400 hover:text-white transition-colors text-sm">Developers</Link>
//                     <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link>
//                 </div>

//                 {/* Legal / Social */}
//                 <div className="flex flex-col gap-3">
//                      <h3 className="font-bold text-lg mb-2">Legal</h3>
//                     <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
//                     <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
//                 </div>
//             </div>

//             {/* Bottom Bar */}
//             <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
//                 <p>&copy; {new Date().getFullYear()} Bitlinks. All rights reserved.</p>
//             </div>
//         </footer>
//     );
// };

// export default Footer;
