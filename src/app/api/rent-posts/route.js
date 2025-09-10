// app/api/rent-posts/route.js
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from 'next/server';

export async function GET(req) {
    let client;
    try {
        const { searchParams } = new URL(req.url);
        const categoryQuery = searchParams.get("category");
        const sortQuery = searchParams.get("sort");
        const featuredQuery = searchParams.get("featured");
        const limitQuery = searchParams.get("limit"); // New limit parameter

        const dbConn = await dbConnect('rentPosts');
        client = dbConn.client;

        let query = {};
        if (categoryQuery) {
            query.category = categoryQuery;
        }
        if (featuredQuery === "true") {
            query.featured = true;
        }

        let sort = {};
        if (sortQuery === "rentalCount_desc") {
            sort.rentalCount = -1; // Descending order
        } else if (sortQuery === "rating_desc") {
            sort.rating = -1; // Descending order
        }

        // Default to 6 for featured/popular/top-rated, no limit for others unless specified
        const limit = limitQuery ? parseInt(limitQuery, 10) : (featuredQuery === "true" || sortQuery ? 6 : 0);

        const data = await dbConn.collection
            .find(query)
            .sort(sort)
            .limit(limit) // Apply dynamic limit
            .toArray();

        client.close();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// POST handler remains unchanged
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