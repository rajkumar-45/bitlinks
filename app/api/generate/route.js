import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
export async function POST(request) {
    const session = await getServerSession(authOptions);
    const body = await request.json() 
    const client = await clientPromise;
    const db = client.db("blinkurl")
    const collection = db.collection("url")

    // Ensure URL has protocol
    let { url, shorturl, expiresAt, password, urls } = body;

    if (urls && Array.isArray(urls)) {
        // Bulk generation
        const newLinks = [];
        for (let u of urls) {
            let uShortText = Math.random().toString(36).substr(2, 6);
            if (!u.startsWith('http://') && !u.startsWith('https://')) {
                u = 'https://' + u;
            }
            newLinks.push({
                url: u,
                shorturl: uShortText,
                userId: session?.user?.id || null,
                clicks: 0,
                createdAt: new Date(),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                password: password || null,
                isActive: true
            });
        }
        await collection.insertMany(newLinks);
        return Response.json({ success: true, error: false, message: 'Bulk URLs Generated Successfully', links: newLinks });
    }

    if (!shorturl) {
        shorturl = Math.random().toString(36).substr(2, 6);
    }

    // Validation
    if (!url) {
        return Response.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    if (!/^[a-zA-Z0-9-]+$/.test(shorturl)) {
        return Response.json({ success: false, message: "Invalid short URL format" }, { status: 400 })
    }

    try {
        const destUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        
        // Simple Spam/Malware Blacklist
        const blacklist = ["malicious.com", "phishing-site.net", "scam-link.org"];
        if (blacklist.some(domain => destUrl.hostname.includes(domain))) {
            return Response.json({ success: false, message: "This domain is blacklisted for security reasons" }, { status: 400 })
        }
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
