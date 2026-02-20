"use client";

import Image from "next/image";
import localfont from "next/font/local";
import Link from "next/link";
import { motion } from "framer-motion";

/* SAME — your custom font */
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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="grid md:grid-cols-2 items-center min-h-[90vh] px-6 md:px-16 max-w-7xl mx-auto">
        {/* LEFT SIDE CONTENT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 justify-center z-10"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className={`text-5xl md:text-6xl font-bold leading-tight ${poppins.className}`}
          >
            Shorten Your Links <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Instantly & Securely
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-lg"
          >
            Bitlinks helps you create short, memorable links in seconds. Track
            clicks, share easily, and manage everything in one place.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex gap-4">
            <Link href="/shorten" className="inline-block">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-100 text-purple-700 font-semibold px-6 py-3 rounded-lg border border-purple-900 shadow-sm hover:shadow-md transition-all inline-block cursor-pointer"
              >
                Try Now
              </motion.span>
            </Link>

            <Link href="/github" className="inline-block">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-purple-300 text-purple-700 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-all shadow-sm inline-block cursor-pointer"
              >
                GitHub
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[300px] md:h-[500px] w-full mt-10 md:mt-0"
        >
          <Image
            src="/vector3.avif"
            alt="vector"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </motion.div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="px-6 md:px-16 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Why Choose Bitlinks?
          </motion.h2>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-purple-50 hover:border-purple-100 transition-colors"
            >
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
                ⚡
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create short links instantly with our high-speed infrastructure
                optimized for performance.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-purple-50 hover:border-purple-100 transition-colors"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
                📊
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">
                Detailed Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track clicks, visualize user locations, and monitor link
                performance in real-time.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-purple-50 hover:border-purple-100 transition-colors"
            >
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🔒
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your links are protected with enterprise-grade security and
                guaranteed 99.9% uptime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// "use client";

// import Image from "next/image";
// import localfont from "next/font/local";
// import Link from "next/link";
// import { motion } from "framer-motion";

// /* SAME — your custom font */
// const poppins = localfont({
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
