import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, gender, password, imageUrl } = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "RentHub");
    const users = db.collection("users");

    const existingUser = await users.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
      }
      if (existingUser.phone === phone) {
        return NextResponse.json({ message: "Phone number already exists" }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      firstName,
      lastName,
      email,
      phone,
      gender,
      image: imageUrl || null,
      password: hashedPassword,
      role: "renter",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "Error registering user" },
      { status: 500 }
    );
  }
}