import clientPromise from "../../lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return Response.json({ success: false, message: "Missing required fields" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("bitlinks")
        const collection = db.collection("users")

        // Check if user already exists
        const existingUser = await collection.findOne({ email })
        if (existingUser) {
            return Response.json({ success: false, message: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await collection.insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        })

        return Response.json({ success: true, message: "User registered successfully" }, { status: 201 })
    } catch (error) {
        console.error(error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
