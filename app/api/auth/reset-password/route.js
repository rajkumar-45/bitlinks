import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get("token")

        if (!token) {
            return Response.json({ success: false, message: "Token is required" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("blinkurl")
        const collection = db.collection("users")

        const user = await collection.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        })

        if (!user) {
            return Response.json({ success: false, message: "Token is invalid or has expired" }, { status: 400 })
        }

        return Response.json({ success: true, message: "Token is valid" })
    } catch (error) {
        console.error("Verify reset token error:", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return Response.json({ success: false, message: "Missing required fields" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("blinkurl")
        const collection = db.collection("users")

        const user = await collection.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        })

        if (!user) {
            return Response.json({ success: false, message: "Invalid or expired token" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await collection.updateOne(
            { _id: user._id },
            { 
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpiry: "" }
            }
        )

        return Response.json({ success: true, message: "Password reset successfully!" })
    } catch (error) {
        console.error("Reset password error:", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
