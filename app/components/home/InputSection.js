import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Link as LinkIcon, Loader2 } from "lucide-react";

export default function InputSection({ onShorten, isLoading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    
    try {
      new URL(url);
      setError("");
      onShorten(url);
      setUrl("");
    } catch (err) {
      setError("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  return (
    <section className="px-6 md:px-16 pb-16 max-w-4xl mx-auto w-full relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-6 md:p-8 rounded-3xl relative"
      >
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 relative">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your long URL here..."
              className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/20 rounded-2xl text-lg outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm hover:shadow-md"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!url || isLoading}
            className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold text-lg hover:opacity-95 transition-all duration-300 shadow-lg hover:shadow-[0_8px_20px_-4px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Shorten
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-red-500 mt-3 text-sm font-medium px-2"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
