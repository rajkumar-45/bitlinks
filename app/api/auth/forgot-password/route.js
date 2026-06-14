import clientPromise from "@/lib/mongodb"
import crypto from "crypto"

export async function POST(request) {
    try {
        const { email: rawEmail } = await request.json()
        if (!rawEmail) {
            return Response.json({ success: false, message: "Email is required" }, { status: 400 })
        }

        const email = rawEmail.toLowerCase().trim()
        const client = await clientPromise
        const db = client.db("blinkurl")
        const collection = db.collection("users")

        const user = await collection.findOne({ email })
        if (!user) {
            return Response.json({ success: false, message: "Email address not found" }, { status: 404 })
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expiry = new Date(Date.now() + 3600000) // 1 hour expiry

        await collection.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    resetToken: token,
                    resetTokenExpiry: expiry
                }
            }
        )

        // Generate the reset link
        const host = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000"
        const resetLink = `${host}/reset-password?token=${token}`

        return Response.json({
            success: true,
            message: "Reset link generated!",
            resetLink
        })
    } catch (error) {
        console.error("Forgot password error:", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
