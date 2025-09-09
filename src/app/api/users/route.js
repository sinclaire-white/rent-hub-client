import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
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
    const db = client.db(process.env.DB_NAME || "RentHub");

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const email = searchParams.get("email");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isAdmin = session.user.role === "admin";

    const pipeline = (query) => [
      { $match: query },
      {
        $lookup: {
          from: "bookmarks",
          localField: "_id",
          foreignField: "userId",
          as: "bookmarks",
        },
      },
      {
        $lookup: {
          from: "rentHistory",
          localField: "_id",
          foreignField: "userId",
          as: "rentHistory",
        },
      },
      {
        $lookup: {
          from: "paymentHistory",
          localField: "_id",
          foreignField: "userId",
          as: "paymentHistory",
        },
      },
      {
        $project: {
          password: 0,
          "bookmarks.userId": 0,
          "rentHistory.userId": 0,
          "paymentHistory.userId": 0,
        },
      },
    ];

    if (userId || email) {
      // Validate userId
      if (userId && !ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const query = userId ? { _id: new ObjectId(userId) } : { email };
      const users = await db.collection("users").aggregate(pipeline(query)).toArray();

      if (!users.length) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const user = users[0];
      if (!isAdmin && user._id.toString() !== session.user.id) {
        return NextResponse.json({ error: "Forbidden: You can only access your own data" }, { status: 403 });
      }

      return NextResponse.json({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        bookmarks: user.bookmarks.map(b => ({
          id: b._id.toString(),
          listingId: b.listingId.toString(),
          createdAt: b.createdAt,
        })),
        rentHistory: user.rentHistory.map(r => ({
          id: r._id.toString(),
          listingId: r.listingId.toString(),
          startDate: r.startDate,
          endDate: r.endDate,
          status: r.status,
          createdAt: r.createdAt,
        })),
        paymentHistory: user.paymentHistory.map(p => ({
          id: p._id.toString(),
          rentId: p.rentId.toString(),
          amount: p.amount,
          paymentMethod: p.paymentMethod,
          status: p.status,
          createdAt: p.createdAt,
        })),
      });
    } else if (isAdmin) {
      const users = await db.collection("users")
        .aggregate([
          ...pipeline({}),
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ])
        .toArray();
      const total = await db.collection("users").countDocuments();
      return NextResponse.json({
        users: users.map(user => ({
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          bookmarks: user.bookmarks.map(b => ({
            id: b._id.toString(),
            listingId: b.listingId.toString(),
            createdAt: b.createdAt,
          })),
          rentHistory: user.rentHistory.map(r => ({
            id: r._id.toString(),
            listingId: r.listingId.toString(),
            startDate: r.startDate,
            endDate: r.endDate,
            status: r.status,
            createdAt: r.createdAt,
          })),
          paymentHistory: user.paymentHistory.map(p => ({
            id: p._id.toString(),
            rentId: p.rentId.toString(),
            amount: p.amount,
            paymentMethod: p.paymentMethod,
            status: p.status,
            createdAt: p.createdAt,
          })),
        })),
        total,
        page,
        limit,
      });
    } else {
      return NextResponse.json({ error: "Forbidden: Admin access required for all users" }, { status: 403 });
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}