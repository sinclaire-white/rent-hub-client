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
    const paymentHistory = await db.collection("paymentHistory")
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();

    return NextResponse.json(
      paymentHistory.map(p => ({
        id: p._id.toString(),
        rentId: p.rentId.toString(),
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        status: p.status,
        createdAt: p.createdAt,
      }))
    );
  } catch (err) {
    console.error("Error fetching payment history:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rentId, amount, paymentMethod, status } = await req.json();
    if (!rentId || !amount || !paymentMethod || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ObjectId.isValid(rentId)) {
      return NextResponse.json({ error: "Invalid rent ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("RentHub");
    const result = await db.collection("paymentHistory").insertOne({
      userId: new ObjectId(session.user.id),
      rentId: new ObjectId(rentId),
      amount,
      paymentMethod,
      status,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Payment history added", paymentId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding payment history:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}