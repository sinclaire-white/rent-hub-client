
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("RentHub");
    const rentHistory = await db.collection("rentHistory")
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();

    return NextResponse.json(
      rentHistory.map(r => ({
        id: r._id.toString(),
        listingId: r.listingId.toString(),
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status,
        createdAt: r.createdAt,
      }))
    );
  } catch (err) {
    console.error("Error fetching rent history:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, startDate, endDate, status } = await req.json();
    if (!listingId || !startDate || !endDate || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("RentHub");
    const result = await db.collection("rentHistory").insertOne({
      userId: new ObjectId(session.user.id),
      listingId: new ObjectId(listingId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Rent history added", rentId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding rent history:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}