import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative pt-20 pb-12 px-6 md:px-16 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl flex flex-col items-center"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft text-brand-primary text-sm font-semibold mb-8 border border-brand-primary/10 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
        >
          <Sparkles className="w-4 h-4 text-brand-accent" />
          <span>The New Standard in URL Shortening</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6 font-poppins text-foreground tracking-tight"
        >
          Shorten Links <br />
          <span className="text-gradient">in Seconds</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed font-inter"
        >
          Fast, secure and privacy-first URL shortener with custom aliases. Turn your long, messy links into clean and memorable ones.
        </motion.p>
      </motion.div>
    </section>
  );
}
