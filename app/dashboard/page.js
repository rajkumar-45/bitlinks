"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2, ExternalLink, QrCode, Copy, Check, Plus, Edit3, Loader2, MousePointer2, Link as LinkIcon, BarChart } from "lucide-react"
import toast from "react-hot-toast"
import QRCode from 'qrcode'
import AnalyticsChart from "../components/AnalyticsChart"

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [links, setLinks] = useState([])
    const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, topLink: null })
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
                setStats(data.stats)
            }
        } catch (error) {
            toast.error("Failed to fetch links")
        } finally {
            setLoading(false)
        }
    }

    const deleteLink = async (id) => {
        if (!confirm("Are you sure you want to delete this link?")) return

        const loadingToast = toast.loading("Deleting link...")
        try {
            const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                setLinks(links.filter(link => link._id !== id))
                toast.success("Link deleted successfully", { id: loadingToast })
            } else {
                toast.error(data.message, { id: loadingToast })
            }
        } catch (error) {
            toast.error("Failed to delete link", { id: loadingToast })
        }
    }

    const copyToClipboard = (shortUrl) => {
        const fullUrl = `${window.location.origin}/${shortUrl}`
        navigator.clipboard.writeText(fullUrl)
        setCopiedId(shortUrl)
        toast.success("Copied to clipboard!")
        setTimeout(() => setCopiedId(null), 2000)
    }

    const editLink = async (id, currentUrl) => {
        const newUrl = prompt("Enter new destination URL:", currentUrl)
        if (!newUrl || newUrl === currentUrl) return

        const loadingToast = toast.loading("Updating link...")
        try {
            const res = await fetch("/api/links", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, newUrl })
            })
            const data = await res.json()
            if (data.success) {
                const formattedUrl = newUrl.startsWith('http') ? newUrl : 'https://' + newUrl
                setLinks(links.map(link => link._id === id ? { ...link, url: formattedUrl } : link))
                toast.success("Link updated successfully", { id: loadingToast })
            } else {
                toast.error(data.message, { id: loadingToast })
            }
        } catch (error) {
            toast.error("Failed to update link", { id: loadingToast })
        }
    }

    const toggleStatus = async (id, currentStatus) => {
        const loadingToast = toast.loading(`${currentStatus ? "Deactivating" : "Activating"} link...`)
        try {
            const res = await fetch("/api/links", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive: !currentStatus })
            })
            const data = await res.json()
            if (data.success) {
                setLinks(links.map(link => link._id === id ? { ...link, isActive: !currentStatus } : link))
                toast.success(`Link ${!currentStatus ? "activated" : "deactivated"}`, { id: loadingToast })
            } else {
                toast.error(data.message, { id: loadingToast })
            }
        } catch (error) {
            toast.error("Failed to update status", { id: loadingToast })
        }
    }

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Manage and track your shortened links.</p>
                </div>
                <Link href="/shorten">
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create New Link
                    </button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                    icon={<LinkIcon className="w-5 h-5 text-brand-primary" />}
                    label="Total Links"
                    value={stats.totalLinks}
                />
                <StatCard 
                    icon={<MousePointer2 className="w-5 h-5 text-brand-secondary" />}
                    label="Total Clicks"
                    value={stats.totalClicks}
                />
                <StatCard 
                    icon={<BarChart className="w-5 h-5 text-brand-accent" />}
                    label="Best Link"
                    value={stats.topLink ? `/${stats.topLink.shorturl}` : "N/A"}
                    subValue={stats.topLink ? `${stats.topLink.clicks} clicks` : ""}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Link List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        Recent Links
                        <span className="text-xs font-normal bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                            {links.length} total
                        </span>
                    </h2>
                    
                    {links.length === 0 ? (
                        <div className="glass-card p-20 text-center rounded-[2rem]">
                            <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <LinkIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No links found</h3>
                            <p className="text-muted-foreground mb-8 text-balance">Create your first shortened link to see it here and start tracking analytics.</p>
                            <Link href="/shorten">
                                <button className="btn-secondary">Start shortening</button>
                            </Link>
                        </div>
                    ) : (
                        links.map((link) => (
                            <LinkItem 
                                key={link._id} 
                                link={link} 
                                onCopy={() => copyToClipboard(link.shorturl)}
                                onEdit={() => editLink(link._id, link.url)}
                                onDelete={() => deleteLink(link._id)}
                                onToggle={() => toggleStatus(link._id, link.isActive !== false)}
                                copiedId={copiedId}
                            />
                        ))
                    )}
                </div>

                {/* Analytics Sidebar */}
                <div className="space-y-6">
                   <div className="glass-card p-6 rounded-3xl sticky top-32">
                        <h2 className="text-xl font-bold mb-2">Click Trends</h2>
                        <p className="text-sm text-muted-foreground mb-6">Visual performance overview for the last 7 days.</p>
                        <AnalyticsChart statsData={stats.history} />
                        <div className="mt-8 pt-8 border-t border-border">
                            <h3 className="font-bold mb-4">Top Countries</h3>
                            <div className="space-y-3">
                                {stats.countries && stats.countries.length > 0 ? (
                                    stats.countries.map((c, i) => (
                                        <ReferrerItem 
                                            key={i} 
                                            label={c.label} 
                                            value={`${Math.round((c.count / stats.totalClicks) * 100) || 0}%`} 
                                            color={i === 0 ? "bg-brand-primary" : i === 1 ? "bg-brand-secondary" : "bg-brand-accent"} 
                                        />
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground">No data available yet</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-border">
                            <h3 className="font-bold mb-4">Device Types</h3>
                            <div className="space-y-3">
                                {stats.devices && stats.devices.length > 0 ? (
                                    stats.devices.map((d, i) => (
                                        <ReferrerItem 
                                            key={i} 
                                            label={d.label} 
                                            value={`${Math.round((d.count / stats.totalClicks) * 100) || 0}%`} 
                                            color="bg-slate-400" 
                                        />
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground">No data available yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, subValue }) {
    return (
        <div className="glass-card p-6 rounded-3xl">
            <div className="bg-background w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-shallow">
                {icon}
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{value}</span>
                {subValue && <span className="text-sm text-brand-primary font-bold">{subValue}</span>}
            </div>
        </div>
    )
}

function LinkItem({ link, onCopy, onEdit, onDelete, onToggle, copiedId }) {
    const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
    const isActive = link.isActive !== false;

    return (
        <div className={`glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group transition-all ${!isActive || isExpired ? 'opacity-60 saturate-50' : ''}`}>
            <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-brand-primary font-black text-xl hover:underline cursor-pointer">
                        /{link.shorturl}
                    </span>
                    <div className="flex items-center gap-1">
                        {link.password && <Lock className="w-3.5 h-3.5 text-orange-500" title="Password protected" />}
                        {link.expiresAt && <Calendar className="w-3.5 h-3.5 text-blue-500" title={`Expires: ${new Date(link.expiresAt).toLocaleDateString()}`} />}
                        {isExpired && <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-md font-bold uppercase">Expired</span>}
                        {!isActive && <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-md font-bold uppercase">Inactive</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm truncate max-w-md">
                        {link.url}
                    </p>
                    <button 
                        onClick={onCopy}
                        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                        title="Copy link"
                    >
                        {copiedId === link.shorturl ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <a 
                        href={`/${link.shorturl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group/link"
                    >
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/link:text-brand-primary" />
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Clicks</span>
                    <span className="text-xl font-black text-foreground">{link.clicks || 0}</span>
                </div>
                
                <div className="flex gap-2 ml-auto">
                    <button 
                        onClick={onToggle}
                        className={`p-2.5 rounded-xl transition-all ${isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
                        title={isActive ? "Deactivate" : "Activate"}
                    >
                        <Zap className="w-5 h-5" fill={isActive ? "currentColor" : "transparent"} />
                    </button>
                    <button 
                        onClick={onEdit}
                        className="p-2.5 text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                        title="Edit Destination"
                    >
                        <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => {
                            const fullUrl = `${window.location.protocol}//${window.location.host}/${link.shorturl}`
                            QRCode.toDataURL(fullUrl).then(qr => {
                                toast((t) => (
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="font-bold">QR Code for /{link.shorturl}</p>
                                        <img src={qr} className="w-48 h-48 border rounded-xl" />
                                        <button 
                                            onClick={() => toast.dismiss(t.id)}
                                            className="btn-primary py-2 px-4 text-xs"
                                        >
                                            Close
                                        </button>
                                    </div>
                                ), { duration: 5000 });
                            })
                        }}
                        className="p-2.5 text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                        title="QR Code"
                    >
                        <QrCode className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={onDelete}
                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function ReferrerItem({ label, value, color }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span>{label}</span>
                <span className="text-muted-foreground">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: value }}></div>
            </div>
        </div>
    )
}
