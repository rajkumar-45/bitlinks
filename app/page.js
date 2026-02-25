"use client";

import Image from "next/image";
import localfont from "next/font/local";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, BarChart3, Shield, ArrowRight, MousePointer2, Smartphone, Globe } from "lucide-react";

const poppins = localfont({
  src: "./fonts/Poppins-ExtraBold.ttf",
  variable: "--font-Poppins",
  weight: "800",
});

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <main className="relative overflow-x-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "4s" }}></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 px-6 md:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold mb-8 border border-brand-primary/20"
          >
            <Zap className="w-4 h-4 fill-brand-primary" />
            <span>New: Advanced Analytics Dashboard</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={`text-5xl md:text-7xl font-black leading-[1.1] mb-6 ${poppins.className}`}
          >
            Shorten. Share. <br />
            <span className="text-gradient">Track Everything.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The professional URL shortener for modern creators and businesses. 
            Create short links with <span className="text-foreground font-semibold">password protection</span>, 
            <span className="text-foreground font-semibold">custom aliases</span>, and <span className="text-foreground font-semibold">detailed analytics</span>.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shorten">
              <button className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto text-lg py-4 px-8">
                Start Shortening Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-secondary flex items-center gap-2 justify-center w-full sm:w-auto text-lg py-4 px-8">
                View Dashboard
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Mockup or Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative w-full aspect-video md:aspect-[21/9] max-w-5xl glass rounded-3xl overflow-hidden shadow-2xl group"
        >
          <Image
            src="/vector3.avif"
            alt="Bitlinks Dashboard Preview"
            fill
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-40"></div>
          {/* Dashboard UI Overlay Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="glass-card p-6 rounded-2xl w-4/5 md:w-1/2 flex flex-col gap-4 animate-pulse-slow">
                <div className="h-4 w-1/3 bg-brand-primary/20 rounded-full"></div>
                <div className="h-8 w-2/3 bg-foreground/10 rounded-full"></div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="h-20 bg-foreground/5 rounded-xl"></div>
                  <div className="h-20 bg-foreground/5 rounded-xl"></div>
                  <div className="h-20 bg-foreground/5 rounded-xl"></div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="relative px-6 md:px-16 py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-black mb-6 ${poppins.className}`}>
              Powerful Features for <span className="text-gradient">Power Users</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage your links like a pro. Detailed tracking, 
              customization, and enterprise-grade security.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-brand-primary" />}
              title="Instant Shortening"
              description="Create memorable short links in milliseconds. Our global infrastructure ensures your redirects are lightning fast."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-pink-500" />}
              title="Advanced Analytics"
              description="Track clicks, referrers, and device types in real-time. Understand exactly who is clicking your links and when."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-brand-accent" />}
              title="Secure Links"
              description="Add password protection and link expiry to keep your destinations private and secure. You're always in control."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={<MousePointer2 className="w-6 h-6 text-purple-500" />}
              title="Custom Aliases"
              description="Choose your own short URLs. Perfect for branding and creating memorable call-to-actions."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={<Smartphone className="w-6 h-6 text-orange-500" />}
              title="QR Code Ready"
              description="Every link automatically generates a high-quality QR code for offline sharing. Perfect for menus and flyers."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-green-500" />}
              title="Global Scale"
              description="Built on MongoDB and Next.js, Bitlinks scales effortlessly with your traffic, no matter how many clicks you get."
              variants={itemVariants}
            />
          </motion.div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="px-6 py-32">
        <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className={`text-4xl md:text-5xl font-black mb-8 ${poppins.className}`}>
              Ready to take control of <br /> <span className="text-gradient">your links?</span>
            </h2>
            <Link href="/register">
              <button className="btn-primary text-xl py-5 px-12 rounded-2xl">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Placeholder (since Navbar is fixed) */}
      <footer className="py-12 text-center text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} Bitlinks. All rights reserved.</p>
      </footer>
    </main>
  );
}

//   src: "./fonts/Poppins-ExtraBold.ttf",
//   variable: "--font-Poppins",
//   weight: "800",
// });

// export default function Home() {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     },
//   };

//   return (
//     <main className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen overflow-hidden">
//       {/* ================= HERO SECTION ================= */}
//       <section className="grid md:grid-cols-2 items-center min-h-[90vh] px-6 md:px-16 max-w-7xl mx-auto">
//         {/* LEFT SIDE CONTENT */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="flex flex-col gap-6 justify-center z-10"
//         >
//           {/* Headline */}
//           <motion.h1
//             variants={itemVariants}
//             className={`text-5xl md:text-6xl font-bold leading-tight ${poppins.className}`}
//           >
//             Shorten Your Links <br />
//             <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
//               Instantly & Securely
//             </span>
//           </motion.h1>

//           {/* Description */}
//           <motion.p
//             variants={itemVariants}
//             className="text-lg text-gray-600 max-w-lg"
//           >
//             Bitlinks helps you create short, memorable links in seconds. Track
//             clicks, share easily, and manage everything in one place.
//           </motion.p>

//           {/* Buttons */}
//           <motion.div variants={itemVariants} className="flex gap-4">
//             <Link href="/shorten" passHref>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-purple-100 text-purple-700 font-semibold px-6 py-3 rounded-lg border border-purple-900 shadow-sm hover:shadow-md transition-all"
//               >
//                 Try Now
//               </motion.button>
//             </Link>

//             <Link href="/github" passHref>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="border border-purple-300 text-purple-700 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-all shadow-sm"
//               >
//                 GitHub
//               </motion.button>
//             </Link>
//           </motion.div>
//         </motion.div>

//         {/* RIGHT SIDE IMAGE */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="relative h-[300px] md:h-[500px] w-full mt-10 md:mt-0"
//         >
//           <Image
//             src="/vector3.avif"
//             alt="vector"
//             fill
//             className="object-contain drop-shadow-xl"
//             priority
//           />
//         </motion.div>
//       </section>

//       {/* ================= FEATURES SECTION ================= */}
//       <section className="px-6 md:px-16 py-16 bg-white/50 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto">
//           {/* Section Title */}
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="text-4xl font-bold text-center mb-12 text-gray-800"
//           >
//             Why Choose Bitlinks?
//           </motion.h2>

//           {/* Feature Cards */}
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             className="grid md:grid-cols-3 gap-8"
//           >
//             {/* Feature 1 */}
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5 }}
//               className="bg-white p-8 rounded-2xl shadow-lg border border-purple-50 hover:border-purple-100 transition-colors"
//             >
//               <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
//                 ⚡
//               </div>
//               <h3 className="font-bold text-xl mb-3 text-gray-800">
//                 Lightning Fast
//               </h3>
//               <p className="text-gray-600 leading-relaxed">
//                 Create short links instantly with our high-speed infrastructure
//                 optimized for performance.
//               </p>
//             </motion.div>

//             {/* Feature 2 */}
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5 }}
//               className="bg-white p-8 rounded-2xl shadow-lg border border-purple-50 hover:border-purple-100 transition-colors"
//             >
//               <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
//                 📊
//               </div>
//               <h3 className="font-bold text-xl mb-3 text-gray-800">
//                 Detailed Analytics
//               </h3>
//               <p className="text-gray-600 leading-relaxed">
//                 Track clicks, visualize user locations, and monitor link
//                 performance in real-time.
//               </p>
//             </motion.div>

//             {/* Feature 3 */}
//             <motion.div
//               variants={itemVariants}
//               whileHover={{ y: -5 }}
//               className="bg-white p-8 rounded-2xl shadow-lg border border-purple-50 hover:border-purple-100 transition-colors"
//             >
//               <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
//                 🔒
//               </div>
//               <h3 className="font-bold text-xl mb-3 text-gray-800">
//                 Secure & Reliable
//               </h3>
//               <p className="text-gray-600 leading-relaxed">
//                 Your links are protected with enterprise-grade security and
//                 guaranteed 99.9% uptime.
//               </p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>
//     </main>
//   );
// }
