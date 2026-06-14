"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Loader2, ArrowLeft, Mail, ShieldCheck, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const urlEmail = searchParams.get("email") || ""
    const urlDemoOtp = searchParams.get("demoOtp") || ""
    const urlPreviewUrl = searchParams.get("previewUrl") || ""

    const [email, setEmail] = useState(urlEmail)
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    // Sync state if URL searchParams load asynchronously
    useEffect(() => {
        if (urlEmail) setEmail(urlEmail)
    }, [urlEmail])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP code")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password })
            })

            const data = await res.json()

            if (res.ok && data.success) {
                toast.success("Password reset successfully!")
                router.push("/login?reset=success")
            } else {
                toast.error(data.message || "Failed to reset password")
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white shadow-md">
                <ShieldCheck className="w-6 h-6" />
            </div>

            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center mb-2">
                Enter OTP Code
            </h1>
            <p className="text-gray-600 text-sm text-center mb-6">
                Please enter the 6-digit OTP code sent to your email and your new password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="6-Digit OTP Code"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium tracking-widest text-center text-lg"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 mt-2 flex items-center justify-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                </button>
            </form>

            {/* Local Testing / Demo Helper Banners */}
            {(urlDemoOtp || urlPreviewUrl) && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl flex flex-col gap-3">
                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider">Demo Mode Helper:</p>
                    
                    {urlDemoOtp && (
                        <div>
                            <span className="text-xs text-gray-500 block">Your OTP Code:</span>
                            <span className="font-mono text-lg font-extrabold text-purple-700 bg-white px-2 py-0.5 border border-purple-200 rounded">{urlDemoOtp}</span>
                        </div>
                    )}
                    
                    {urlPreviewUrl && (
                        <div>
                            <span className="text-xs text-gray-500 block">Ethereal Mailbox Email Link:</span>
                            <a 
                                href={urlPreviewUrl} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-purple-600 font-bold hover:underline"
                            >
                                View Sent Email Inbox <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    )}
                </div>
            )}

            <div className="text-center mt-6">
                <Link href="/forgot-password" className="inline-flex items-center gap-1 text-purple-600 font-bold hover:underline text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Forgot Password
                </Link>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-md">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                        <p className="text-gray-500 font-medium">Loading...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
