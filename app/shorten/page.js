"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import localfont from "next/font/local";

const poppins = localfont({
    src: "../fonts/Poppins-ExtraBold.ttf",
    variable: "--font-Poppins",
    weight: "800",
});

const Shorten = () => {
    const [url, seturl] = useState("")
    const [shorturl, setshorturl] = useState("")
    const [generated, setgenerated] = useState("")
    const [originalUrl, setOriginalUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [qrCode, setQrCode] = useState("")

    const generate = async () => {
        if (!url || !shorturl) {
            setError("Please enter both URL and short text!")
            return
        }

        // Basic URL validation
        try {
            new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch (e) {
            setError("Invalid URL format!")
            return
        }

        // Alias validation (alphanumeric and hyphens only)
        if (!/^[a-zA-Z0-9-]+$/.test(shorturl)) {
            setError("Short text can only contain letters, numbers, and hyphens!")
            return
        }

        setError("")
        setLoading(true)
        
        try {
            const response = await fetch("/api/generate/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, shorturl })
            })
            const result = await response.json()
            
            setLoading(false)
            if (result.success) {
                const fullUrl = `${window.location.protocol}//${window.location.host}/${shorturl}`
                setgenerated(fullUrl)
                setOriginalUrl(url)
                
                // Generate QR Code
                const QRCode = require('qrcode')
                const qr = await QRCode.toDataURL(fullUrl)
                setQrCode(qr)

                seturl("")
                setshorturl("")
                setError("")
            } else {
                setError(result.message)
            }
        } catch (error) {
            setLoading(false)
            console.error(error)
            setError("An error occurred! Please try again.")
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generated)
        alert("Copied to clipboard!") 
    }

    return (
        <div className='min-h-screen bg-purple-50 flex items-center justify-center p-4 relative overflow-hidden'>
            {/* Background Blurs */}
            <div className="fixed top-20 right-0 w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-3xl -z-10 animate-blob"></div>

            <div className='bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6 transform hover:scale-[1.01] transition-transform duration-300'>
                <h1 className={`font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center ${poppins.className}`}>
                    Generate Short URL
                </h1>
                
                <div className='flex flex-col gap-4'>
                    <input 
                        type="text"
                        value={url}
                        className='px-5 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition-all font-medium text-gray-700'
                        placeholder='Enter your long URL (https://...)'
                        onChange={e => seturl(e.target.value)} 
                    />

                    <div className="flex flex-col gap-1">
                        <input 
                            type="text"
                            value={shorturl}
                            className='px-5 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500 transition-all font-medium text-gray-700'
                            placeholder='Enter preferred short text'
                            onChange={e => setshorturl(e.target.value)} 
                        />
                        <p className="text-[10px] text-gray-500 ml-1">Example: my-cool-link (Letters, numbers, and hyphens only)</p>
                    </div>

                    {error && <p className="text-red-500 text-sm font-semibold text-center animate-pulse">{error}</p>}
                    
                    <button 
                        onClick={generate} 
                        disabled={loading}
                        className='bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-lg'
                    >
                        {loading ? "Generating..." : "Generate Link"}
                    </button>
                </div>

                {generated && (
                    <div className='flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                        {/* Success & Copy Section */}
                        <div className='bg-green-50/50 backdrop-blur-sm border border-green-200 p-4 rounded-lg flex flex-col gap-3'>
                            <span className='font-bold text-green-800 flex items-center gap-2'>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Link Ready!
                            </span>
                            <div className='flex items-center gap-2 bg-white p-2 rounded border border-green-100'>
                                <Link target='_blank' href={generated} className="text-purple-600 font-bold hover:underline truncate flex-1">
                                    {generated}
                                </Link>
                                <button onClick={copyToClipboard} className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-md transition-colors" title="Copy to clipboard">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        {qrCode && (
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/50 rounded-lg border border-purple-100">
                                <p className="text-sm font-bold text-purple-800">Scan QR Code</p>
                                <img src={qrCode} alt="QR Code" className="w-32 h-32 shadow-sm rounded-lg" />
                                <a href={qrCode} download={`qr-${shorturl}.png`} className="text-xs text-purple-600 font-bold hover:underline">Download QR</a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default Shorten
