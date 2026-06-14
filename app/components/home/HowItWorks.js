import { motion } from "framer-motion";
import { Link2, Zap, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Link2 className="w-8 h-8 text-brand-primary" />,
      title: "Paste your link",
      description: "Copy and paste your long, messy URL into our shortener tool. Add an optional custom alias.",
      color: "from-brand-primary/20 to-brand-primary/5",
      border: "border-brand-primary/20"
    },
    {
      icon: <Zap className="w-8 h-8 text-brand-secondary" />,
      title: "Click Shorten",
      description: "Our system instantly generates a clean, trackable short link in milliseconds.",
      color: "from-brand-secondary/20 to-brand-secondary/5",
      border: "border-brand-secondary/20"
    },
    {
      icon: <Share2 className="w-8 h-8 text-brand-accent" />,
      title: "Copy & Share",
      description: "Use your brand new link on social media, emails, or SMS. Track clicks instantly.",
      color: "from-brand-accent/20 to-brand-accent/5",
      border: "border-brand-accent/20"
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 md:px-16 relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 font-poppins text-foreground tracking-tight">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto font-inter">
            Three simple steps to link mastery. No complex setup required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-px bg-gradient-to-r from-brand-primary/10 via-brand-secondary/30 to-brand-accent/10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2, type: "spring", bounce: 0.4 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-b ${step.color} shadow-sm flex items-center justify-center mb-8 relative z-10 border ${step.border} group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300`}>
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-foreground font-black flex items-center justify-center text-lg shadow-soft border border-brand-primary/10 font-poppins">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-poppins text-foreground">{step.title}</h3>
              <p className="text-brand-muted leading-relaxed font-inter max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
