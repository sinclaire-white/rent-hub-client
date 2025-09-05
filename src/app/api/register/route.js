import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await dbConnect();
    const { name, email, password, role } = await request.json();

    try {
        const user = await User.create({ name, email, password, role });
        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
