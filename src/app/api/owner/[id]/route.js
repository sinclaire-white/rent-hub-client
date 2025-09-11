import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  let client;
  try {
    const ownerId = params?.id;
    if (!ownerId) {
      return new Response(JSON.stringify({ error: "Owner ID not provided" }), { status: 400 });
    }

    client = await clientPromise;
    const db = client.db("RentHub");

    // ✅ Try to fetch owner by ObjectId
    let owner = null;
    try {
      owner = await db.collection("users").findOne(
        { _id: new ObjectId(ownerId) },
        { projection: { password: 0 } } // hide password
      );
    } catch (err) {
      console.error("Invalid ObjectId, trying string match:", err);
      owner = await db.collection("users").findOne(
        { _id: ownerId },
        { projection: { password: 0 } }
      );
    }

    if (!owner) {
      return new Response(JSON.stringify({ error: "Owner not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(owner), { status: 200 });
  } catch (err) {
    console.error("Error in owner route:", err);
    return new Response(JSON.stringify({ error: err.message || "Something went wrong" }), { status: 500 });
  }
}
