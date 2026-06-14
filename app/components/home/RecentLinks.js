import { motion, AnimatePresence } from "framer-motion";
import { Link2, Copy, Check, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RecentLinks({ links, onClear }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!links || links.length === 0) return null;

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="px-6 md:px-16 pb-16 pt-8 max-w-4xl mx-auto w-full relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-poppins text-foreground flex items-center gap-2">
          Your Recent Links
        </h2>
        <button
          onClick={onClear}
          className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Clear History
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {links.map((link, index) => (
            <motion.div
              layout
              key={link.id || index}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, type: "spring", bounce: 0.2 }}
              className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-brand-primary/30 hover:shadow-md transition-all font-inter bg-white"
            >
              <div className="flex-1 min-w-0 pr-4 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5">
                  <div className="flex items-center gap-2 max-w-full">
                    <div className="bg-brand-light p-1.5 rounded-lg shrink-0">
                      <Link2 className="w-4 h-4 text-brand-primary" />
                    </div>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-foreground font-bold text-lg hover:text-brand-primary transition-colors truncate">
                      {link.shortUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-muted truncate ml-10">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate" title={link.originalUrl}>{link.originalUrl}</span>
                </div>
              </div>

              <div className="flex items-center w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <button
                  onClick={() => handleCopy(link.shortUrl, link.id || index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${copiedId === (link.id || index) ? 'bg-green-50 text-green-600' : 'bg-brand-light/50 text-brand-primary hover:bg-brand-primary hover:text-white'}`}
                  title="Copy link"
                >
                  {copiedId === (link.id || index) ? (
                    <>
                      <Check className="w-4 h-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
