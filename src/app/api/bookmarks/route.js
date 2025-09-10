import { connectToDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { userEmail, rentalId } = await request.json();
    if (!userEmail || !rentalId)
        return NextResponse.json(
            { error: 'Missing userEmail or rentalId' },
            { status: 400 },
        );

    const db = await connectToDB();
    const bookmarks = db.collection('bookmarks');

    const existing = await bookmarks.findOne({ userEmail, rentalId });

    if (existing) {
        await bookmarks.deleteOne({ _id: existing._id });
        return NextResponse.json({
            message: 'Bookmark removed',
            removed: true,
        });
    } else {
        const result = await bookmarks.insertOne({
            userEmail,
            rentalId,
            createdAt: new Date(),
        });
        return NextResponse.json({
            message: 'Bookmark added',
            removed: false,
            insertedId: result.insertedId,
        });
    }
}

export async function GET(request) {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail');
    if (!userEmail)
        return NextResponse.json(
            { error: 'Missing userEmail' },
            { status: 400 },
        );

    const db = await connectToDB();
    const bookmarks = db.collection('bookmarks');
    const data = await bookmarks.find({ userEmail }).toArray();
    return NextResponse.json(data);
}
