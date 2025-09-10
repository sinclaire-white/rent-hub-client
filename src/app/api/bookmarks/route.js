import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("RentHub");
    const bookmarks = await db.collection("bookmarks")
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();
    
    return NextResponse.json(
      bookmarks.map(bookmark => ({
        id: bookmark._id.toString(),
        listingId: bookmark.listingId.toString(),
      })),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { listingId } = await request.json();
    const client = await clientPromise;
    const db = client.db("RentHub");
    const result = await db.collection("bookmarks").insertOne({
      userId: new ObjectId(session.user.id),
      listingId: new ObjectId(listingId),
      createdAt: new Date(),
    });

    return NextResponse.json(
      { bookmarkId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookmarkId } = await request.json();
    const client = await clientPromise;
    const db = client.db("RentHub");
    const result = await db.collection("bookmarks").deleteOne({
      _id: new ObjectId(bookmarkId),
      userId: new ObjectId(session.user.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bookmark deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}