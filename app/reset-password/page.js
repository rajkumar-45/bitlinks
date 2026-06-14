"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Loader2, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [verifying, setVerifying] = useState(true)
    const [tokenValid, setTokenValid] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            setVerifying(false)
            setTokenValid(false)
            return
        }

        const verifyToken = async () => {
            try {
                const res = await fetch(`/api/auth/reset-password?token=${token}`)
                const data = await res.json()
                if (res.ok && data.success) {
                    setTokenValid(true)
                } else {
                    setTokenValid(false)
                }
            } catch (err) {
                setTokenValid(false)
            } finally {
                setVerifying(false)
            }
        }

        verifyToken()
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()

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
                body: JSON.stringify({ token, password })
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

    if (verifying) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                <p className="text-gray-500 font-medium">Verifying reset token...</p>
            </div>
        )
    }

    if (!tokenValid) {
        return (
            <div className="text-center py-6">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Invalid or Expired Link</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                    This password reset link is invalid, expired, or has already been used. Please request a new link.
                </p>
                <Link href="/forgot-password" className="inline-flex items-center gap-1 text-purple-600 font-bold hover:underline text-sm">
                    <ArrowLeft className="w-4 h-4" /> Forgot Password
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center mb-2">
                New Password
            </h1>
            <p className="text-gray-600 text-sm text-center mb-6">
                Create a secure new password for your account.
            </p>

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
