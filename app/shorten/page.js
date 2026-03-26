"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import localfont from "next/font/local";
import { Link as LinkIcon, Sparkles, Copy, Check, ArrowRight, Shield, Calendar, Lock, Zap, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from 'qrcode';
import { motion } from "framer-motion";

const poppins = localfont({
    src: "../fonts/Poppins-ExtraBold.ttf",
    variable: "--font-Poppins",
    weight: "800",
});

const Shorten = () => {
    const [url, seturl] = useState("")
    const [shorturl, setshorturl] = useState("")
    const [expiresAt, setExpiresAt] = useState("")
    const [password, setPassword] = useState("")
    const [generated, setgenerated] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [qrCode, setQrCode] = useState("")
    const [copied, setCopied] = useState(false)

    const generate = async () => {
        if (!url || !shorturl) {
            setError("Please enter both URL and short text!")
            return
        }

        // Alias validation (alphanumeric and hyphens only)
        if (!/^[a-zA-Z0-9-]+$/.test(shorturl)) {
            setError("Short text can only contain letters, numbers, and hyphens!")
            return
        }

        setError("")
        setLoading(true)
        const loadingToast = toast.loading("Creating your link...")
        
        try {
            const response = await fetch("/api/generate/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    url, 
                    shorturl,
                    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
                    password: password || null
                })
            })
            const result = await response.json()
            
            setLoading(false)
            if (result.success) {
                const fullUrl = `${window.location.protocol}//${window.location.host}/${shorturl}`
                setgenerated(fullUrl)
                toast.success("Link generated!", { id: loadingToast })
                
                // Generate QR Code
                const qr = await QRCode.toDataURL(fullUrl)
                setQrCode(qr)

                seturl("")
                setshorturl("")
                setExpiresAt("")
                setPassword("")
            } else {
                setError(result.message)
                toast.error(result.message, { id: loadingToast })
            }
        } catch (error) {
            setLoading(false)
            toast.error("Failed to generate link", { id: loadingToast })
            setError("An error occurred! Please try again.")
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generated)
        setCopied(true)
        toast.success("Copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className='min-h-screen pt-32 pb-20 px-6 relative overflow-hidden'>
            {/* Background Decorations */}
            <div className="absolute top-40 -left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>
            <div className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "2s" }}></div>

            <div className='max-w-2xl mx-auto'>
                <div className='text-center mb-12'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-4 border border-brand-primary/20'>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Shortening</span>
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-black mb-4 ${poppins.className}`}>
                        Create <span className="text-gradient">Magic Links</span>
                    </h1>
                    <p className='text-muted-foreground'>Customize, secure, and share your links in seconds.</p>
                </div>

                <div className='glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group'>
                    <div className='absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-primary/10 transition-colors'></div>
                    
                    <div className='flex flex-col gap-6 relative z-10'>
                        {/* URL Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-2 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Destination URL
                            </label>
                            <input 
                                type="text"
                                value={url}
                                className='w-full px-6 py-4 rounded-2xl bg-white/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-medium'
                                placeholder='https://example.com/very-long-url-path'
                                onChange={e => seturl(e.target.value)} 
                            />
                        </div>

                        {/* Alias Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-2 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Custom Alias
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50 font-medium">bitlinks.com/</span>
                                <input 
                                    type="text"
                                    value={shorturl}
                                    className='w-full pl-32 pr-6 py-4 rounded-2xl bg-white/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-medium'
                                    placeholder='my-link'
                                    onChange={e => setshorturl(e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Advanced Options Toggle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold ml-2 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Expiry Date (Optional)
                                </label>
                                <input 
                                    type="date"
                                    value={expiresAt}
                                    className='w-full px-5 py-3 rounded-xl bg-white/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all text-sm'
                                    onChange={e => setExpiresAt(e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold ml-2 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5" />
                                    Password (Optional)
                                </label>
                                <input 
                                    type="password"
                                    value={password}
                                    className='w-full px-5 py-3 rounded-xl bg-white/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all text-sm'
                                    placeholder="••••••••"
                                    onChange={e => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold px-4 py-2 rounded-xl text-center">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            onClick={generate} 
                            disabled={loading}
                            className='btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group/btn'
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Generate Link <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>}
                        </button>
                    </div>

                    {generated && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mt-10 flex flex-col gap-6 pt-10 border-t border-border'
                        >
                            <div className='space-y-3'>
                                <p className='text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1'>Success! Here is your link:</p>
                                <div className='flex items-center gap-2 glass-card p-2 rounded-2xl'>
                                    <div className="px-4 py-3 font-bold text-brand-primary truncate flex-1">
                                        {generated}
                                    </div>
                                    <button 
                                        onClick={copyToClipboard} 
                                        className="bg-brand-primary text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                                        title="Copy Link"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                    <div className="flex gap-2 ml-2">
                                        <a 
                                            href={`https://wa.me/?text=${encodeURIComponent("Check out this link: " + generated)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-500 text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                                            title="Share on WhatsApp"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.446 4.432-9.877 9.881-9.877 2.64 0 5.122 1.028 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.446-4.435 9.877-9.883 9.877m8.415-18.293A11.085 11.085 0 0012.051 0C5.411 0 .007 5.405.005 12.046c0 2.123.554 4.197 1.604 6.04L0 24l6.105-1.602a11.037 11.037 0 005.41 1.405h.005c6.64 0 12.045-5.405 12.05-12.048a11.044 11.044 0 00-3.32-7.817"/></svg>
                                        </a>
                                        <a 
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out this link: " + generated)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-black text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/20"
                                            title="Share on X (Twitter)"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                        </a>
                                        <a 
                                            href={`mailto:?subject=${encodeURIComponent("Link Shared via Bitlinks")}&body=${encodeURIComponent("Check out this link: " + generated)}`}
                                            className="bg-blue-500 text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                                            title="Share via Email"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-brand-primary/10 p-2 rounded-lg">
                                            <Shield className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Secure Redirect</p>
                                            <p className="text-xs text-muted-foreground">Encryption enabled</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-brand-secondary/10 p-2 rounded-lg">
                                            <Zap className="w-5 h-5 text-brand-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Real-time Tracking</p>
                                            <p className="text-xs text-muted-foreground">Analytics active</p>
                                        </div>
                                    </div>
                                    <Link href="/dashboard" className="inline-block pt-2">
                                        <button className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                                            View in Dashboard <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>

                                {qrCode && (
                                    <div className="flex flex-col items-center gap-3 p-6 glass-card rounded-3xl">
                                        <img src={qrCode} alt="QR Code" className="w-32 h-32 rounded-xl shadow-lg border border-white/50" />
                                        <a href={qrCode} download={`qr-${shorturl}.png`} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                                            Download QR Code
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
                
                <p className="text-center mt-10 text-sm text-muted-foreground">
                    By using Bitlinks, you agree to our <Link href="/terms" className="underline underline-offset-4 font-semibold hover:text-foreground">Terms</Link> and <Link href="/privacy" className="underline underline-offset-4 font-semibold hover:text-foreground">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    )
}
export default Shorten
