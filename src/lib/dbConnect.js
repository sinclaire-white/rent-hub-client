import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function dbConnect(collectionName) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "RentHub");
    const collection = db.collection(collectionName);
    return { client, collection };
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

export default dbConnect;