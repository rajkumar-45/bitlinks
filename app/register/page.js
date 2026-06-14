"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace("/login?tab=signup")
    }, [router])

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center justify-center min-h-[200px] gap-4">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                <p className="text-gray-500 font-medium">Redirecting to Sign Up...</p>
            </div>
        </div>
    )
}
