import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
export async function POST(request) {
    const session = await getServerSession(authOptions);
    const body = await request.json() 
    const client = await clientPromise;
    const db = client.db("bitlinks")
    const collection = db.collection("url")

    // Ensure URL has protocol
    let { url, shorturl, expiresAt, password } = body;

    // Validation
    if (!url || !shorturl) {
        return Response.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    if (!/^[a-zA-Z0-9-]+$/.test(shorturl)) {
        return Response.json({ success: false, message: "Invalid short URL format" }, { status: 400 })
    }

    try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
        return Response.json({ success: false, message: "Invalid destination URL" }, { status: 400 })
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // Check if the short url exists
    const doc = await collection.findOne({shorturl: shorturl})
    if(doc){
        return Response.json({success: false, error: true,  message: 'URL already exists!' })
    }

    const newLink = {
        url: url,
        shorturl: shorturl,
        userId: session?.user?.id || null,
        clicks: 0,
        createdAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        password: password || null,
        isActive: true
    }

    const result = await collection.insertOne(newLink)

    return Response.json({success: true, error: false,  message: 'URL Generated Successfully', link: newLink })
  }
