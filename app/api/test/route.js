import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bitlinks");

    await db.collection("test").insertOne({
      name: "Rajkumar",
      createdAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Mongo error:", error);
    return Response.json({ error: error.message });
  }
}