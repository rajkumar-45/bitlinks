import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        const body = await request.json();
        const { shorturl, password } = body;

        if (!shorturl || !password) {
            return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("bitlinks");
        const collection = db.collection("url");

        const doc = await collection.findOne({ shorturl });

        if (!doc) {
            return Response.json({ success: false, message: "Link not found" }, { status: 404 });
        }

        if (doc.password === password) {
            // Increment clicks
            await collection.updateOne(
                { _id: doc._id },
                { $inc: { clicks: 1 } }
            );

            return Response.json({ success: true, url: doc.url });
        } else {
            return Response.json({ success: false, message: "Incorrect password" }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
