import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

export default async function Page({ params }) {
  const { shorturl } = await params;

  const client = await clientPromise;
  const db = client.db("bitlinks");
  const collection = db.collection("url");

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

  // Increment clicks and redirect
  await collection.updateOne(
    { _id: doc._id },
    { $inc: { clicks: 1 } }
  );

  redirect(doc.url);
}
