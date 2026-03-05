import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { headers } from "next/headers";

export default async function Page({ params }) {
  const { shorturl } = await params;
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const ip = headerList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

  const client = await clientPromise;
  const db = client.db("bitlinks");
  const collection = db.collection("url");
  const clicksCollection = db.collection("clicks");

  const doc = await collection.findOne({ shorturl });

  if (!doc) {
    redirect("/");
  }

  // Check if active
  if (doc.isActive === false) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <h1 className="text-4xl font-black mb-4">Link Deactivated</h1>
            <p className="text-muted-foreground">This link has been deactivated by the owner.</p>
        </div>
    )
  }

  // Check expiry
  if (doc.expiresAt && new Date(doc.expiresAt) < new Date()) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <h1 className="text-4xl font-black mb-4">Link Expired</h1>
            <p className="text-muted-foreground">This link is no longer available as it has reached its expiry date.</p>
        </div>
    )
  }

  // Check password
  if (doc.password) {
    redirect(`/${shorturl}/password`);
  }

  // Log click analytics
  let device = "Desktop";
  if (/mobile/i.test(userAgent)) device = "Mobile";
  if (/tablet/i.test(userAgent)) device = "Tablet";

  // Basic country detection (could be enhanced with a real geo-IP service)
  let country = "Unknown";
  try {
      // Use a simple fetch to a geo-IP service if needed, 
      // but for performance, we might just store IP and process later 
      // OR use a fast lookup.
      if (ip !== "127.0.0.1" && ip !== "::1") {
          const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`);
          const geoData = await geoRes.json();
          if (geoData.status === "success") {
              country = geoData.country;
          }
      }
  } catch (e) {
      console.warn("Geo lookup failed", e);
  }

  // Update total clicks and log detailed entry
  await Promise.all([
    collection.updateOne(
      { _id: doc._id },
      { $inc: { clicks: 1 } }
    ),
    clicksCollection.insertOne({
        linkId: doc._id,
        shorturl: doc.shorturl,
        userId: doc.userId,
        timestamp: new Date(),
        ip,
        country,
        device,
        userAgent
    })
  ]);

  redirect(doc.url);
}
