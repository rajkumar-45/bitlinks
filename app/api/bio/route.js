import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const client = await clientPromise
        const db = client.db("blinkurl")
        const collection = db.collection("profiles")

        const profile = await collection.findOne({ userId: session.user.id })
        
        return Response.json({ success: true, profile })
    } catch (error) {
        console.error("GET Profile Error", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { username, displayName, bio, links, theme } = body

        if (!username) {
            return Response.json({ success: false, message: "Username is required" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("blinkurl")
        const collection = db.collection("profiles")

        // Check if username is taken by another user
        const existing = await collection.findOne({ username: username.toLowerCase() })
        if (existing && existing.userId !== session.user.id) {
            return Response.json({ success: false, message: "Username is already taken" }, { status: 400 })
        }

        // Also check if shorturl in 'url' collection matches
        const urlCollection = db.collection("url")
        if (await urlCollection.findOne({ shorturl: username.toLowerCase() })) {
            return Response.json({ success: false, message: "Username is unavailable (used as a shortlink)" }, { status: 400 })
        }

        const updateData = {
            username: username.toLowerCase(),
            displayName: displayName || "",
            bio: bio || "",
            links: Array.isArray(links) ? links : [],
            theme: theme || "light",
            updatedAt: new Date()
        }

        const result = await collection.updateOne(
            { userId: session.user.id },
            { 
                $set: updateData,
                $setOnInsert: { createdAt: new Date(), userId: session.user.id }
            },
            { upsert: true }
        )

        return Response.json({ success: true, message: "Profile saved successfully", profile: updateData })
    } catch (error) {
        console.error("POST Profile Error", error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
