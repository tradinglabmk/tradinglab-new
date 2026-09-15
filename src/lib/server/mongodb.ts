import { MongoClient } from "mongodb";

const uri = process.env["MONGODB_URI"];
const dbName = process.env["MONGODB_DB"] || "tradinglab";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 8000,
  socketTimeoutMS: 8000,
};

// Reuse the client across hot-reloads in dev and across invocations in prod
const globalForMongo = global as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalForMongo._mongoClientPromise) {
  globalForMongo._mongoClientPromise = new MongoClient(uri, options).connect();
}

const clientPromise: Promise<MongoClient> = globalForMongo._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}
