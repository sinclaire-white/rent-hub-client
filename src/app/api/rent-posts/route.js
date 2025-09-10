// `app/api/rent-posts/route.js`
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from 'next/server';

export async function GET(req) {
    let client;
    try {
        const { searchParams } = new URL(req.url);
        const categoryQuery = searchParams.get("category");

        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;

        let query = {};
        if (categoryQuery) {
            query.category = categoryQuery;
        }

        const data = await dbConn.collection.find(query).toArray();
        
        client.close();
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(request) {
    let client;
    try {
        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;
        const reqBody = await request.json();
        const newPost = await dbConn.collection.insertOne({
            ...reqBody,
            rentalCount: 0,
            rating: 0,
            featured: false,
            createdAt: new Date(),
        });
        
        client.close();

        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}