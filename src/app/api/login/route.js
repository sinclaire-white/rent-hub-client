import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const { email, password } = await request.json();

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return NextResponse.json({ success: false, message: "Invalid credentials" });
  }

  return NextResponse.json({
    success: true,
    user: { name: user.name, role: user.role },
  });
}
