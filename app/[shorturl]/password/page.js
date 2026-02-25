"use client"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function PasswordPage() {
    const { shorturl } = useParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/links/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shorturl, password })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Access Granted!");
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Incorrect password");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pb-40 relative overflow-hidden">
             {/* Background Decorations */}
             <div className="absolute top-40 -left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>
            <div className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "2s" }}></div>

            <div className="max-w-md w-full glass p-10 rounded-[2.5rem] shadow-2xl relative">
                <div className="bg-brand-primary w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-primary/30">
                    <Lock className="w-8 h-8 text-white" />
                </div>
                
                <h1 className="text-3xl font-black text-center mb-2">Protected Link</h1>
                <p className="text-muted-foreground text-center mb-8">This link is password protected. Enter the password to proceed.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold ml-2 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Password
                        </label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-medium"
                            placeholder="••••••••"
                            autoFocus
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Unlock & Proceed <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <p className="mt-10 text-center text-xs text-muted-foreground uppercase tracking-widest font-bold">Securely powered by Bitlinks</p>
            </div>
        </div>
    );
}
