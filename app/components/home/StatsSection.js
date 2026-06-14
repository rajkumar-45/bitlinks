import { motion } from "framer-motion";
import { Link2, Users, MousePointerClick } from "lucide-react";

const stats = [
  { id: 1, name: "Links Shortened", value: "2.5M+", icon: Link2 },
  { id: 2, name: "Users Served", value: "100k+", icon: Users },
  { id: 3, name: "Clicks Tracked", value: "50M+", icon: MousePointerClick },
];

export default function StatsSection() {
  return (
    <section className="py-20 px-6 md:px-16 w-full relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-panel p-8 rounded-[2rem] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 bg-white"
            >
              <div className="bg-brand-light p-4 rounded-2xl text-brand-primary mb-6 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm border border-brand-primary/10">
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-black font-poppins text-foreground mb-2 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-brand-muted font-medium font-inter">{stat.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
