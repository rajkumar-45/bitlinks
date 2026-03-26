import { motion } from "framer-motion";
import { Link2, MousePointerClick, Clock, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function RecentLinks({ links }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!links || links.length === 0) return null;

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="px-6 md:px-16 py-12 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-brand-primary" />
        <h2 className="text-2xl font-bold font-poppins">Recent Links</h2>
      </div>

      <div className="space-y-4">
        {links.map((link, index) => (
          <motion.div
            key={link.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-brand-primary/30 transition-colors"
          >
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold hover:underline truncate">
                  {link.shortUrl}
                </a>
              </div>
              <p className="text-sm text-muted-foreground truncate">{link.originalUrl}</p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 rounded-lg">
                <MousePointerClick className="w-4 h-4 text-brand-secondary" />
                <span className="text-sm font-medium">{link.clicks || 0}</span>
              </div>
              <button
                onClick={() => handleCopy(link.shortUrl, link.id || index)}
                className="p-2 hover:bg-secondary/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title="Copy link"
              >
                {copiedId === (link.id || index) ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
