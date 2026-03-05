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
        const clicksCollection = db.collection("clicks")

        const links = await collection.find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray()

        // Calculate basic stats
        const totalLinks = links.length;
        const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0);
        const topLink = links.length > 0 ? [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0] : null;

        // Fetch detailed analytics
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Click History (Last 7 Days)
        const historyEntries = await clicksCollection.aggregate([
            { $match: { userId: session.user.id, timestamp: { $gte: sevenDaysAgo } } },
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                clicks: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]).toArray();

        // Format history for Chart.js/Recharts
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const history = last7Days.map(date => {
            const entry = historyEntries.find(h => h._id === date);
            return {
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                date: date,
                clicks: entry ? entry.clicks : 0
            };
        });

        // Country Distribution (Top 5)
        const countryStats = await clicksCollection.aggregate([
            { $match: { userId: session.user.id } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).toArray();

        // Device Distribution
        const deviceStats = await clicksCollection.aggregate([
            { $match: { userId: session.user.id } },
            { $group: { _id: "$device", count: { $sum: 1 } } }
        ]).toArray();

        return Response.json({ 
            success: true, 
            links,
            stats: {
                totalLinks,
                totalClicks,
                topLink: topLink ? { shorturl: topLink.shorturl, clicks: topLink.clicks } : null,
                history,
                countries: countryStats.map(c => ({ label: c._id, count: c.count })),
                devices: deviceStats.map(d => ({ label: d._id, count: d.count }))
            }
        })
    } catch (error) {
        console.error(error)
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { id, newUrl, isActive } = body

        if (!id) {
            return Response.json({ success: false, message: "Missing link ID" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("bitlinks")
        const collection = db.collection("url")

        const updateData = {}
        if (newUrl !== undefined) {
            let formattedUrl = newUrl;
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl;
            }
            updateData.url = formattedUrl
        }
        
        if (isActive !== undefined) {
            updateData.isActive = isActive
        }

        if (Object.keys(updateData).length === 0) {
            return Response.json({ success: false, message: "No fields to update" }, { status: 400 })
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id), userId: session.user.id },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return Response.json({ success: false, message: "Link not found or unauthorized" }, { status: 404 })
        }

        return Response.json({ success: true, message: "Link updated successfully" })
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
