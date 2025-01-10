import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // MongoDB connection string
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db();
}
