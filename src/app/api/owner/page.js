import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("RentHub");

    // Fetch all users with role "owner"
    const owners = await db
      .collection("users")
      .find({ role: "owner" }) // assuming you have a "role" field
      .project({ password: 0 }) // exclude password
      .sort({ createdAt: -1 })  // latest first
      .toArray();

    return NextResponse.json({ owners });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}