import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

// Global Cache to Reuse Connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If already connected, return cached connection
  if (cached.conn) {
    console.log(" Using cached MongoDB connection");
    return cached.conn;
  }

  // If no connection promise, create a new one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 100,             
               
    }).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection failed:", error);
      throw error;
    });
  }

  // ✅ Wait for the connection to establish and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
