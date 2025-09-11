import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  let client;
  try {
    const dbConn = await dbConnect("rentPosts");
    client = dbConn.client;

    // যদি params.id থাকে → single post fetch
    if (params?.id) {
      const post = await dbConn.collection.findOne({
        _id: new ObjectId(params.id),
      });
      client.close();

      if (!post)
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
        });
      return new Response(JSON.stringify(post), { status: 200 });
    }

    // অন্যথায় → multiple posts fetch (existing logic)
    const { searchParams } = new URL(req.url);
    const categoryQuery = searchParams.get("category");
    const sortQuery = searchParams.get("sort");
    const featuredQuery = searchParams.get("featured");
    const limitQuery = searchParams.get("limit");

    let query = {};
    if (categoryQuery) query.category = categoryQuery;
    if (featuredQuery === "true") query.featured = true;

    let sort = {};
    if (sortQuery === "rentalCount_desc") sort.rentalCount = -1;
    else if (sortQuery === "rating_desc") sort.rating = -1;

    const limit = limitQuery
      ? parseInt(limitQuery, 10)
      : featuredQuery === "true" || sortQuery
      ? 6
      : 0;

    const data = await dbConn.collection
      .find(query)
      .sort(sort)
      .limit(limit)
      .toArray();

    client.close();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    if (client) client.close();
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// POST handler remains unchanged
export async function POST(request) {
  let client;
  try {
    const dbConn = await dbConnect("rentPosts");
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
