import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    // Check if the user is authenticated and an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Parse request body for userId and role
    const { userId, role } = await req.json();
    if (!userId || !ObjectId.isValid(userId) || !role || !["renter", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid user ID or role" }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "RentHub");

    // Update the user's role
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "User not found or role unchanged" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error updating role:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}