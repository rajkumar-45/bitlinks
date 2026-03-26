import { motion } from "framer-motion";
import { Zap, BarChart3, Shield, MousePointer2, Smartphone, Globe } from "lucide-react";

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-brand-primary" />,
      title: "Instant Shortening",
      description: "Create memorable short links in milliseconds. Our global infrastructure ensures your redirects are lightning fast.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-brand-secondary" />,
      title: "Advanced Analytics",
      description: "Track clicks, referrers, and device types in real-time. Understand exactly who is clicking your links and when.",
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-accent" />,
      title: "Secure Links",
      description: "Add password protection and link expiry to keep your destinations private and secure.",
    },
    {
      icon: <MousePointer2 className="w-6 h-6 text-purple-500" />,
      title: "Custom Aliases",
      description: "Choose your own short URLs. Perfect for branding and creating memorable call-to-actions.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-orange-500" />,
      title: "QR Code Ready",
      description: "Every link automatically generates a high-quality QR code for offline sharing. Perfect for menus and flyers.",
    },
    {
      icon: <Globe className="w-6 h-6 text-green-500" />,
      title: "Global Scale",
      description: "Built on modern stack, Bitlinks scales effortlessly with your traffic, no matter how many clicks you get.",
    },
  ];

  return (
    <section className="px-6 md:px-16 py-24 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 font-poppins">
            Powerful <span className="text-gradient">Features</span>
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-3xl border border-border group hover:border-brand-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-poppins">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
