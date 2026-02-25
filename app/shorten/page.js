"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import localfont from "next/font/local";
import { Link as LinkIcon, Sparkles, Copy, Check, ArrowRight, Shield, Calendar, Lock, Zap, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
                const QRCode = require('qrcode')
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
                                className='w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-medium'
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
                                    className='w-full pl-32 pr-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-medium'
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
                                    className='w-full px-5 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all text-sm'
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
                                    className='w-full px-5 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all text-sm'
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
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
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
