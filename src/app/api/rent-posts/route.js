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

        const data = await dbConn.collection
            .find(query)
            .sort(sort)
            .limit(6) // Limit to 6 results
            .toArray();

        client.close();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        if (client) client.close();
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}