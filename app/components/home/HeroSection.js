import { motion } from "framer-motion";
import { Link2 } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative pt-32 pb-16 px-6 md:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl flex flex-col items-center"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold mb-8 border border-brand-primary/20"
        >
          <Link2 className="w-4 h-4" />
          <span>The New Standard in URL Shortening</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 font-poppins"
        >
          Shorten Your Links <br />
          <span className="text-gradient">Instantly 🚀</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Fast, secure, and simple URL shortener built for professionals. Turn your long, messy links into clean and trackable ones.
        </motion.p>
      </motion.div>
    </section>
  );
}
