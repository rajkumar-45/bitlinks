import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";

export default function ResultSection({ shortenedUrl }) {
  const [copied, setCopied] = useState(false);

  if (!shortenedUrl) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className="px-6 md:px-16 pb-16 max-w-4xl mx-auto w-full z-10"
    >
      <div className="p-1 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
        <div className="bg-background rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <p className="text-sm text-muted-foreground mb-1">Your shortened URL is ready:</p>
            <a 
              href={shortenedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl md:text-2xl font-bold text-gradient truncate block hover:opacity-80 transition-opacity"
            >
              {shortenedUrl}
            </a>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-medium transition-colors border border-slate-200 shadow-sm"
            >
              {copied ? (
                <>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                  <span className="text-green-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 transition-colors border border-slate-200 shadow-sm flex items-center justify-center"
              title="Visit Link"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
