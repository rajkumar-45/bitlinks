"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2, ExternalLink, BarChart3, QrCode, Copy, Check } from "lucide-react"

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [links, setLinks] = useState([])
    const [loading, setLoading] = useState(true)
    const [copiedId, setCopiedId] = useState(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated") {
            fetchLinks()
        }
    }, [status])

    const fetchLinks = async () => {
        try {
            const res = await fetch("/api/links")
            const data = await res.json()
            if (data.success) {
                setLinks(data.links)
            }
        } catch (error) {
            console.error("Failed to fetch links", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteLink = async (id) => {
        if (!confirm("Are you sure you want to delete this link?")) return

        try {
            const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                setLinks(links.filter(link => link._id !== id))
            }
        } catch (error) {
            console.error("Failed to delete link", error)
        }
    }

    const copyToClipboard = (shortUrl) => {
        const fullUrl = `${window.location.origin}/${shortUrl}`
        navigator.clipboard.writeText(fullUrl)
        setCopiedId(shortUrl)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const editLink = async (id, currentUrl) => {
        const newUrl = prompt("Enter new destination URL:", currentUrl)
        if (!newUrl || newUrl === currentUrl) return

        try {
            const res = await fetch("/api/links", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, newUrl })
            })
            const data = await res.json()
            if (data.success) {
                setLinks(links.map(link => link._id === id ? { ...link, url: newUrl.startsWith('http') ? newUrl : 'https://' + newUrl } : link))
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error("Failed to update link", error)
        }
    }

    if (status === "loading" || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Your Bitlinks</h1>
                <Link href="/shorten">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                        + New Link
                    </button>
                </Link>
            </div>

            {links.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md rounded-2xl p-12 text-center border border-white/40">
                    <p className="text-gray-600 text-lg mb-4">You haven't generated any links yet.</p>
                    <Link href="/shorten" className="text-purple-600 font-bold hover:underline">
                        Start shortening now
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {links.map((link) => (
                        <div key={link._id} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="flex-1 min-w-0 w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-purple-600 font-bold text-lg truncate">
                                        /{link.shorturl}
                                    </span>
                                    <button 
                                        onClick={() => copyToClipboard(link.shorturl)}
                                        className="p-1 hover:bg-purple-100 rounded transition-colors"
                                    >
                                        {copiedId === link.shorturl ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm truncate flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    {link.url}
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Clicks</p>
                                    <p className="text-lg font-black text-purple-700">{link.clicks || 0}</p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => editLink(link._id, link.url)}
                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                        title="Edit Destination"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                    <button 
                                        onClick={() => deleteLink(link._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                        title="Analytics"
                                    >
                                        <BarChart3 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const fullUrl = `${window.location.protocol}//${window.location.host}/${link.shorturl}`
                                            const QRCode = require('qrcode')
                                            QRCode.toDataURL(fullUrl).then(qr => {
                                                const win = window.open();
                                                win.document.write(`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
                                                    <h2 style="color:#7c3aed;">QR Code for /${link.shorturl}</h2>
                                                    <img src="${qr}" style="width:256px;height:256px;margin:20px;border:1px solid #ddd;border-radius:10px;" />
                                                    <p style="color:#666;">${fullUrl}</p>
                                                    <button onclick="window.print()" style="margin-top:20px;padding:10px 20px;background:#7c3aed;color:white;border:none;border-radius:5px;cursor:pointer;">Print QR</button>
                                                </div>`);
                                            })
                                        }}
                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                        title="QR Code"
                                    >
                                        <QrCode className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
