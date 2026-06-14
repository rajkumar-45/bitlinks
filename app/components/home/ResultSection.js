import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, QrCode, Download } from "lucide-react";
import QRCode from "qrcode";
import toast from "react-hot-toast";

export default function ResultSection({ result }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    if (result?.shortUrl) {
      QRCode.toDataURL(result.shortUrl, { 
        width: 300, 
        margin: 2, 
        color: { dark: '#0F172A', light: '#FFFFFF' } 
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error("Error generating QR:", err));
    }
  }, [result?.shortUrl]);

  if (!result || !result.shortUrl) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className="px-6 md:px-16 pb-16 max-w-4xl mx-auto w-full z-10"
    >
      <div className="glass-panel p-6 md:p-8 rounded-3xl relative shadow-glass border border-white/60 bg-white flex flex-col items-center">
        
        <h3 className="text-xl font-bold font-poppins text-foreground mb-6">Your short link is ready! 🎉</h3>

        <div className="flex flex-col md:flex-row w-full gap-8 items-center justify-between">
          <div className="flex-1 w-full space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-brand-muted font-inter">Original URL</span>
              <p className="text-sm text-slate-500 truncate max-w-sm md:max-w-md bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 font-inter" title={result.originalUrl}>
                {result.originalUrl}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-brand-muted font-inter">Shortened URL</span>
              <div className="flex items-center justify-between gap-3 bg-brand-light/50 border border-brand-primary/20 px-4 py-3 rounded-xl">
                <a 
                  href={result.shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-bold text-brand-primary truncate hover:opacity-80 transition-opacity font-inter group"
                >
                  {result.shortUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary/90 transition-all shadow-sm font-inter"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy</span>
                  </>
                )}
              </motion.button>
              
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-white text-brand-muted hover:text-foreground hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm flex items-center justify-center"
                title="Visit Link"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-brand-light/30 rounded-2xl border border-brand-primary/10 w-full md:w-auto">
            <div className="flex items-center gap-2 mb-3 text-brand-muted text-sm font-semibold font-inter">
              <QrCode className="w-4 h-4" /> QR Code
            </div>
            {qrCodeDataUrl ? (
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-3 hover:scale-105 transition-transform duration-300">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-32 h-32 md:w-40 md:h-40 object-contain" />
              </div>
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 animate-pulse rounded-xl mb-3" />
            )}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={qrCodeDataUrl}
              download="blinkurl-qr.png"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-secondary bg-white px-3 py-1.5 rounded-lg border border-brand-primary/20 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </motion.a>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
