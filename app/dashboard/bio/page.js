"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Plus, Trash2, Save, User, Settings, ArrowLeft, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"

export default function BioDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState({
        username: "",
        displayName: "",
        bio: "",
        theme: "light",
        links: []
    })

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login")
        else if (status === "authenticated") fetchProfile()
    }, [status])

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/bio")
            const data = await res.json()
            if (data.success && data.profile) {
                setProfile({
                    username: data.profile.username || "",
                    displayName: data.profile.displayName || "",
                    bio: data.profile.bio || "",
                    theme: data.profile.theme || "light",
                    links: data.profile.links || []
                })
            }
        } catch (error) {
            toast.error("Failed to fetch bio profile")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!profile.username) {
            toast.error("Username is required for the public link")
            return
        }

        setSaving(true)
        const loadingToast = toast.loading("Saving profile...")
        try {
            const res = await fetch("/api/bio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Profile saved successfully!", { id: loadingToast })
            } else {
                toast.error(data.message || "Failed to save profile", { id: loadingToast })
            }
        } catch (error) {
            toast.error("Failed to save profile", { id: loadingToast })
        } finally {
            setSaving(false)
        }
    }

    const addLink = () => {
        setProfile({ ...profile, links: [...profile.links, { title: "", url: "" }] })
    }

    const updateLink = (index, field, value) => {
        const newLinks = [...profile.links]
        newLinks[index][field] = value
        setProfile({ ...profile, links: newLinks })
    }

    const removeLink = (index) => {
        const newLinks = [...profile.links]
        newLinks.splice(index, 1)
        setProfile({ ...profile, links: newLinks })
    }

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse">Loading bio profile...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black">Smart Bio Page</h1>
                    <p className="text-muted-foreground">Create your personalized Linktree-style page.</p>
                </div>
                {profile.username && (
                    <a 
                        href={`/${profile.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-auto flex items-center gap-2 bg-brand-light text-brand-primary px-4 py-2 rounded-xl font-bold hover:bg-brand-primary/20 transition-colors cursor-pointer"
                    >
                        View Page <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Profile Details */}
                <div className="glass-card p-6 md:p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="w-5 h-5" /> Profile Details</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-muted-foreground mb-1">Username (URL Path)</label>
                            <div className="flex items-center bg-white rounded-xl border px-4 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                                <span className="text-muted-foreground mr-1">blinkurl.app/</span>
                                <input 
                                    type="text" 
                                    value={profile.username} 
                                    onChange={(e) => setProfile({...profile, username: e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()})}
                                    placeholder="your-name"
                                    className="w-full py-3 outline-none bg-transparent font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-muted-foreground mb-1">Display Name</label>
                            <input 
                                type="text" 
                                value={profile.displayName} 
                                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-muted-foreground mb-1">Bio Description</label>
                            <textarea 
                                value={profile.bio} 
                                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                placeholder="Developer, Designer, Creator..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Links Management */}
                <div className="glass-card p-6 md:p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5" /> Your Links</h2>
                        <button type="button" onClick={addLink} className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-4 py-2 rounded-lg font-bold transition-colors">
                            <Plus className="w-4 h-4" /> Add Link
                        </button>
                    </div>

                    <div className="space-y-4">
                        {profile.links.map((link, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-3 bg-slate-50 p-4 rounded-2xl border items-start md:items-center relative group">
                                <div className="flex-1 w-full space-y-3 md:space-y-0 md:flex md:gap-3">
                                    <div className="flex-1">
                                        <input 
                                            type="text" 
                                            value={link.title} 
                                            onChange={(e) => updateLink(i, 'title', e.target.value)}
                                            placeholder="Link Title (e.g. GitHub)"
                                            className="w-full px-3 py-2 border-b bg-transparent outline-none focus:border-brand-primary transition-colors font-medium text-sm md:text-base"
                                        />
                                    </div>
                                    <div className="flex-[2]">
                                        <input 
                                            type="url" 
                                            value={link.url} 
                                            onChange={(e) => updateLink(i, 'url', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 border-b bg-transparent outline-none focus:border-brand-primary transition-colors text-sm md:text-base text-muted-foreground"
                                        />
                                    </div>
                                </div>
                                <button type="button" onClick={() => removeLink(i)} className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {profile.links.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-2xl">
                                No links added yet. Click &quot;Add Link&quot; to start building your page.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8 py-4 text-lg w-full md:w-auto justify-center disabled:opacity-50">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? "Saving..." : "Save Bio Profile"}
                    </button>
                </div>
            </form>
        </div>
    )
}
