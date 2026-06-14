import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Link as LinkIcon, Loader2, Clipboard, X, Settings2, Lock, Calendar, Layers } from "lucide-react";
import toast from "react-hot-toast";

export default function InputSection({ onShorten, isLoading }) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isBulk, setIsBulk] = useState(false);
  const [error, setError] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a URL to shorten.");
      return;
    }
    
    if (isBulk) {
        const urlsArray = url.split('\n').map(u => u.trim()).filter(u => u);
        if (urlsArray.length === 0) {
            setError("Please enter at least one URL");
            return;
        }
        for (let u of urlsArray) {
            try { new URL(u.startsWith('http') ? u : `https://${u}`); } catch(err) { setError(`Invalid URL in bulk list: ${u}`); return; }
        }
        setError("");
        onShorten({ urls: urlsArray, expiresAt, password });
        return;
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      setError("");
      onShorten({ url, shorturl: alias.trim(), expiresAt, password });
    } catch (err) {
      setError("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      if (error) setError("");
    } catch (err) {
      toast.error("Clipboard permission denied. Please paste manually.");
    }
  };

  const handleClear = () => {
    setUrl("");
    setAlias("");
    setPassword("");
    setExpiresAt("");
    setError("");
    inputRef.current?.focus();
  };

  return (
    <section className="px-6 md:px-16 pb-20 max-w-4xl mx-auto w-full relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel p-2 md:p-3 rounded-[2rem] relative shadow-glass border border-white/60 bg-white/60"
      >
        <div className="flex justify-center mb-4 pt-2 gap-4">
            <button type="button" onClick={() => setIsBulk(false)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!isBulk ? 'bg-brand-primary text-white shadow-md' : 'text-brand-muted hover:bg-white/50'}`}>Single Link</button>
            <button type="button" onClick={() => setIsBulk(true)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isBulk ? 'bg-brand-primary text-white shadow-md' : 'text-brand-muted hover:bg-white/50'}`}>Bulk Shorten</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative z-10">
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className={`relative flex-1 flex ${isBulk ? 'items-start' : 'items-center'} bg-white rounded-3xl border border-brand-primary/10 pl-5 pr-2 py-2 focus-within:ring-4 focus-within:ring-brand-primary/20 focus-within:border-brand-primary/30 transition-all shadow-sm group`}>
              <LinkIcon className={`h-5 w-5 text-brand-muted shrink-0 group-focus-within:text-brand-primary transition-colors ${isBulk ? 'mt-3' : ''}`} />
              
              {isBulk ? (
                <textarea
                    ref={inputRef}
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
                    placeholder="Paste multiple long URLs here (one per line)..."
                    rows={3}
                    className="w-full bg-transparent border-none outline-none px-4 py-2 text-base text-foreground placeholder:text-slate-400 font-inter resize-none"
                />
              ) : (
                <input
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
                    placeholder="Paste your long URL here..."
                    className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg text-foreground placeholder:text-slate-400 font-inter"
                />
              )}

              <div className={`flex items-center gap-1 shrink-0 ${isBulk ? 'mt-1' : ''}`}>
                {url && (
                  <button type="button" onClick={handleClear} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="Clear input">
                    <X className="w-5 h-5" />
                  </button>
                )}
                {!url && (
                  <button type="button" onClick={handlePaste} className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-light rounded-full transition-colors flex items-center gap-1 text-sm font-medium" title="Paste from clipboard">
                    <Clipboard className="w-5 h-5" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                )}
                
                <button type="button" onClick={() => setShowOptions(!showOptions)} className={`p-2 hidden md:flex rounded-full transition-colors ${showOptions ? 'bg-brand-light text-brand-primary' : 'text-brand-muted hover:bg-slate-100 hover:text-foreground'}`} title="Link Options">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={!url || isLoading} className={`flex items-center justify-center gap-2 py-4 px-8 rounded-3xl bg-brand-primary text-white font-bold text-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 font-inter group`}>
              {isLoading ? (
                 <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <> Shorten <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> </>
              )}
            </motion.button>
          </div>

          <button type="button" onClick={() => setShowOptions(!showOptions)} className="md:hidden flex items-center justify-center gap-2 py-2 text-sm font-medium text-brand-muted hover:text-foreground">
            <Settings2 className="w-4 h-4" /> {showOptions ? "Hide Options" : "Show Options"}
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden px-2">
                <div className="pt-2 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Custom Alias */}
                  {!isBulk && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-brand-muted flex items-center gap-1"><LinkIcon className="w-4 h-4"/> Custom Alias</label>
                        <div className="flex items-center bg-white rounded-xl border border-brand-primary/10 focus-within:border-brand-primary/40 focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all shadow-sm">
                        <span className="pl-3 pr-1 text-slate-400 text-sm font-medium">blinkurl.app/</span>
                        <input type="text" value={alias} onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))} placeholder="my-link" className="w-full bg-transparent outline-none py-2 pr-3 text-foreground font-inter text-sm" />
                        </div>
                    </div>
                  )}
                  {/* Password Protection */}
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-brand-muted flex items-center gap-1"><Lock className="w-4 h-4"/> Password Protect</label>
                      <div className="flex items-center bg-white rounded-xl border border-brand-primary/10 focus-within:border-brand-primary/40 focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all shadow-sm px-3">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secret password" className="w-full bg-transparent outline-none py-2 text-foreground font-inter text-sm" />
                      </div>
                  </div>
                  {/* Expiry Date */}
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-brand-muted flex items-center gap-1"><Calendar className="w-4 h-4"/> Expiry Date</label>
                      <div className="flex items-center bg-white rounded-xl border border-brand-primary/10 focus-within:border-brand-primary/40 focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all shadow-sm px-3">
                        <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full bg-transparent outline-none py-2 text-foreground font-inter text-sm" />
                      </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
        
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-8 left-0 text-red-500 text-sm font-semibold px-4 flex items-center gap-1">
              <X className="w-4 h-4" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
