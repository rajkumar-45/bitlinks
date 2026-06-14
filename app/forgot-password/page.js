"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Loader2, ArrowLeft, Key } from "lucide-react"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (res.ok && data.success) {
                toast.success("OTP sent successfully!")
                
                // Construct redirection query parameters
                const params = new URLSearchParams({ email })
                if (data.demoOtp) {
                    params.set("demoOtp", data.demoOtp)
                }
                if (data.previewUrl) {
                    params.set("previewUrl", data.previewUrl)
                }

                router.push(`/reset-password?${params.toString()}`)
            } else {
                toast.error(data.message || "Email address not found")
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-md">
                <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                    <Key className="w-6 h-6" />
                </div>
                
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center mb-2">
                    Reset Password
                </h1>
                <p className="text-gray-600 text-sm text-center mb-6">
                    Enter your email address to receive a 6-digit OTP password reset code.
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 mt-2 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Send OTP Code"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link href="/login" className="inline-flex items-center gap-1 text-purple-600 font-bold hover:underline text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
