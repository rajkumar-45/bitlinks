"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            })

            const data = await res.json()

            if (data.success) {
                router.push("/login?registered=true")
            } else {
                setError(data.message || "Registration failed")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center mb-8">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 mt-2 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-600 font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
