import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { headers } from "next/headers";

export default async function Page(props) {
  const { shorturl } = await props.params;
  const searchParams = await props.searchParams;
  const isPreview = searchParams?.preview;

  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const ip = headerList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

  const client = await clientPromise;
  const db = client.db("blinkurl");
  const collection = db.collection("url");
  const clicksCollection = db.collection("clicks");

  const doc = await collection.findOne({ shorturl });

  if (!doc) {
    const profile = await db.collection("profiles").findOne({ username: shorturl.toLowerCase() });
    
    if (profile) {
      // Render Bio Linktree style page
      return (
        <div className={`min-h-screen ${profile.theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-brand-light to-white text-slate-900'} py-12 px-4 flex flex-col items-center`}>
            <div className="w-full max-w-md flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {profile.displayName?.charAt(0)?.toUpperCase() || profile.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-black font-poppins tracking-tight">{profile.displayName || profile.username}</h1>
                    {profile.bio && <p className="text-sm opacity-80 max-w-sm mx-auto">{profile.bio}</p>}
                </div>
                
                <div className="w-full space-y-4 mt-8">
                    {profile.links?.map((link, i) => (
                        <a 
                            key={i} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full py-4 px-6 bg-white/60 backdrop-blur-md hover:bg-white border border-white/60 rounded-2xl shadow-sm hover:shadow-md transition-all text-center font-semibold font-inter text-brand-primary hover:scale-[1.02]"
                        >
                            {link.title}
                        </a>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <a href="/" className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
                        Powered by BlinkURL
                    </a>
                </div>
            </div>
        </div>
      );
    }
    
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

  // Handle Link Preview
  if (isPreview) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-brand-light/30">
            <h1 className="text-3xl font-black mb-4">Link Preview</h1>
            <p className="text-muted-foreground mb-6">You are about to be redirected to:</p>
            <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 max-w-lg w-full break-all font-mono text-brand-primary">
                {doc.url}
            </div>
            <a href={doc.url} className="px-8 py-3 bg-brand-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                Continue to Destination
            </a>
        </div>
    )
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
