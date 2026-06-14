import clientPromise from "@/lib/mongodb"
import { sendResetOtpEmail } from "@/lib/mail"

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

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiry

        await collection.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    resetOtp: otp,
                    resetOtpExpiry: expiry
                }
            }
        )

        // Try to send the email
        const mailResult = await sendResetOtpEmail(email, otp)

        return Response.json({
            success: true,
            message: "OTP sent to your email!",
            demoOtp: otp, // For ease of local testing
            previewUrl: mailResult.previewUrl
        })
    } catch (error) {
        console.error("Forgot password API error:", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
