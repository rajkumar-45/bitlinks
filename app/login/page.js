"use client"
import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

function AuthForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    // Read default tab from URL parameter if present
    const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login"
    
    const [activeTab, setActiveTab] = useState(defaultTab)
    
    // Login State
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [showLoginPassword, setShowLoginPassword] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)
    
    // Register State
    const [regName, setRegName] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [showRegPassword, setShowRegPassword] = useState(false)
    const [regLoading, setRegLoading] = useState(false)
    
    const [error, setError] = useState("")

    useEffect(() => {
        const tab = searchParams.get("tab")
        if (tab === "signup" || tab === "login") {
            setActiveTab(tab)
        }
    }, [searchParams])

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setError("")
        router.push(`/login?tab=${tab}`, { scroll: false })
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setLoginLoading(true)
        setError("")

        try {
            console.log("Attempting login for:", loginEmail.toLowerCase())
            const res = await signIn("credentials", {
                email: loginEmail.toLowerCase(),
                password: loginPassword,
                redirect: false
            })

            if (res.error) {
                console.error("Login error:", res.error)
                setError("Invalid email or password")
                toast.error("Invalid email or password")
            } else {
                toast.success("Welcome back!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            console.error("Login exception:", err)
            setError("Something went wrong")
            toast.error("Something went wrong")
        } finally {
            setLoginLoading(false)
        }
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault()
        setRegLoading(true)
        setError("")

        if (regPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            toast.error("Password must be at least 6 characters long")
            setRegLoading(false)
            return
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: regName,
                    email: regEmail,
                    password: regPassword
                })
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Registration successful! Please sign in.")
                // Switch to login tab and populate email field
                setLoginEmail(regEmail)
                handleTabChange("login")
                
                // Reset signup inputs
                setRegName("")
                setRegEmail("")
                setRegPassword("")
            } else {
                setError(data.message || "Registration failed")
                toast.error(data.message || "Registration failed")
            }
        } catch (err) {
            console.error("Registration error:", err)
            setError("Something went wrong")
            toast.error("Something went wrong")
        } finally {
            setRegLoading(false)
        }
    }

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-md">
            {/* Tab Selection */}
            <div className="flex border-b border-gray-200 mb-8 gap-4 justify-center">
                <button
                    onClick={() => handleTabChange("login")}
                    className={`pb-3 font-bold text-lg transition-all border-b-2 px-4 ${
                        activeTab === "login"
                            ? "border-purple-600 text-purple-600"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => handleTabChange("signup")}
                    className={`pb-3 font-bold text-lg transition-all border-b-2 px-4 ${
                        activeTab === "signup"
                            ? "border-purple-600 text-purple-600"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Create Account
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl p-3 text-center mb-6">
                    {error}
                </div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                        <input
                            type={showLoginPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                            {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="text-right -mt-2">
                        <Link href="/forgot-password" className="text-xs text-purple-600 font-bold hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 mt-2 flex items-center justify-center"
                    >
                        {loginLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </button>
                </form>
            )}

            {/* Signup Form */}
            {activeTab === "signup" && (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 w-5 h-5" />
                        <input
                            type={showRegPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                            {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={regLoading}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 mt-2 flex items-center justify-center"
                    >
                        {regLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </button>
                </form>
            )}
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center justify-center min-h-[350px] gap-4">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Loading...</p>
                </div>
            }>
                <AuthForm />
            </Suspense>
        </div>
    )
}
