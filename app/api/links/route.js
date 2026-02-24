import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { ObjectId } from "mongodb"

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const client = await clientPromise
        const db = client.db("bitlinks")
        const collection = db.collection("url")

        const links = await collection.find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray()

        return Response.json({ success: true, links })
    } catch (error) {
        console.error(error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return Response.json({ success: false, message: "Missing ID" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("bitlinks")
        const collection = db.collection("url")

        const result = await collection.deleteOne({ 
            _id: new ObjectId(id),
            userId: session.user.id
        })

        if (result.deletedCount === 0) {
            return Response.json({ success: false, message: "Link not found or unauthorized" }, { status: 404 })
        }

        return Response.json({ success: true, message: "Link deleted successfully" })
    } catch (error) {
        console.error(error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
