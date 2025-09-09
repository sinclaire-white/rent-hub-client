import dbConnect from "@/lib/dbConnect";

let rentPostsCache = null;
let rentPostsCacheTimestamp = 0;
let featuredCache = null;
let featuredCacheTimestamp = 0;
const CACHE_TTL = 60 * 1000;

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    const dbConn = await dbConnect('rentPosts');
    client = dbConn.client;

    // Handle featured filter
    if (featured === "true") {
      if (featuredCache && Date.now() - featuredCacheTimestamp < CACHE_TTL) {
        client.close();
        return new Response(JSON.stringify(featuredCache), { status: 200 });
      }

      const data = await dbConn.collection.find({ featured: true }).toArray();
      client.close();

      featuredCache = data;
      featuredCacheTimestamp = Date.now();

      return new Response(JSON.stringify(data), { status: 200 });
    }

    // --- CHANGE START: Add sorting by rentalCount and rating --- (unchanged)
    if (sort === "rentalCount_desc") {
      const data = await dbConn.collection.find({}).sort({ rentalCount: -1 }).toArray();
      client.close();
      return new Response(JSON.stringify(data), { status: 200 });
    }
    if (sort === "rating_desc") {
      const data = await dbConn.collection.find({}).sort({ rating: -1 }).toArray();
      client.close();
      return new Response(JSON.stringify(data), { status: 200 });
    }
    // --- CHANGE END ---

    if (rentPostsCache && Date.now() - rentPostsCacheTimestamp < CACHE_TTL) {
      client.close();
      return new Response(JSON.stringify(rentPostsCache), { status: 200 });
    }

    const data = await dbConn.collection.find({}).toArray();
    client.close();

    rentPostsCache = data;
    rentPostsCacheTimestamp = Date.now();

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
    // --- CHANGE START: Add rentalCount, rating, and featured to new posts ---
    const newPost = await dbConn.collection.insertOne({
      ...reqBody,
      rentalCount: 0,
      rating: 0,
      featured: false,
      createdAt: new Date(),
    });
    // --- CHANGE END ---
    client.close();

    // Invalidate caches on new post
    rentPostsCache = null;
    rentPostsCacheTimestamp = 0;
    featuredCache = null;
    featuredCacheTimestamp = 0;

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    if (client) client.close();
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}