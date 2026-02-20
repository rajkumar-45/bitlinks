import { redirect } from "next/navigation";
import clientPromise from "../lib/mongodb";

export default async function Page({ params }) {
  const { shorturl } = await params;

  const client = await clientPromise;
  const db = client.db("bitlinks");
  const collection = db.collection("url");

  const doc = await collection.findOne({ shorturl });

  if (doc) {
    redirect(doc.url); // 🔁 redirect to original URL
  } else {
    redirect(process.env.NEXT_PUBLIC_HOST || "/"); // 🔁 fallback
  }
}
