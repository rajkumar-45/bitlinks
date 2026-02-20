import clientPromise from "../../lib/mongodb";

export async function POST(request) {

    const body = await request.json() 
    const client = await clientPromise;
    const db = client.db("bitlinks")
    const collection = db.collection("url")

    // Ensure URL has protocol
    let { url, shorturl } = body;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // Check if the short url exists
    const doc = await collection.findOne({shorturl: shorturl})
    if(doc){
        return Response.json({success: false, error: true,  message: 'URL already exists!' })
    }

    const result = await collection.insertOne({
        url: url,
        shorturl: shorturl
    })

    return Response.json({success: true, error: false,  message: 'URL Generated Successfully' })
  }
