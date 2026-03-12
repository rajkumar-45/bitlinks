import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, variants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card p-8 rounded-[2rem] border border-border/50 hover:border-brand-primary/40 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(124,58,237,0.12)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>
      <div className="bg-background w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-shallow group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
