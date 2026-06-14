import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

// GET: Verifies if the OTP is valid for a given email
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get("email")?.toLowerCase().trim()
        const otp = searchParams.get("otp")?.trim()

        if (!email || !otp) {
            return Response.json({ success: false, message: "Email and OTP are required" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("blinkurl")
        const collection = db.collection("users")

        const user = await collection.findOne({
            email,
            resetOtp: otp,
            resetOtpExpiry: { $gt: new Date() }
        })

        if (!user) {
            return Response.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 })
        }

        return Response.json({ success: true, message: "OTP is valid" })
    } catch (error) {
        console.error("Verify OTP error:", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

// POST: Resets password if email, OTP, and password are correct and valid
export async function POST(request) {
    try {
        const { email: rawEmail, otp, password } = await request.json()

        if (!rawEmail || !otp || !password) {
            return Response.json({ success: false, message: "Missing required fields" }, { status: 400 })
        }

        const email = rawEmail.toLowerCase().trim()
        const client = await clientPromise
        const db = client.db("blinkurl")
        const collection = db.collection("users")

        const user = await collection.findOne({
            email,
            resetOtp: otp?.trim(),
            resetOtpExpiry: { $gt: new Date() }
        })

        if (!user) {
            return Response.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await collection.updateOne(
            { _id: user._id },
            { 
                $set: { password: hashedPassword },
                $unset: { resetOtp: "", resetOtpExpiry: "" }
            }
        )

        return Response.json({ success: true, message: "Password reset successfully!" })
    } catch (error) {
        console.error("Reset password POST error:", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
