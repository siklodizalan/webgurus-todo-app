import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://siklodizalan119:MongoDB12@tododb.khk7t.mongodb.net/?retryWrites=true&w=majority&appName=TodoDB";
// process.env.DATABASE_URL
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db("TodoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
}

export { connectToDatabase };
