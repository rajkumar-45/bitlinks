import { motion } from "framer-motion";
import { Link2, Zap, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Link2 className="w-6 h-6 text-brand-primary" />,
      title: "Paste your link",
      description: "Copy and paste your long, messy URL into our shortener tool.",
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-secondary" />,
      title: "Click Shorten",
      description: "Our system instantly generates a clean, trackable short link.",
    },
    {
      icon: <Share2 className="w-6 h-6 text-brand-accent" />,
      title: "Share anywhere",
      description: "Use your brand new link on social media, emails, or SMS.",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-secondary/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 font-poppins">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to link mastery. No complex setup required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent opacity-20" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center glass-card p-8 rounded-3xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-background shadow-lg flex items-center justify-center mb-6 relative z-10 border border-border">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center text-sm shadow-md">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-poppins">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
