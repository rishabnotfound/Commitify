import { MongoClient, Db } from 'mongodb';

const DB_NAME = 'commitify';

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

let cached: MongoConnection | null = null;

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cached) {
    return cached;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  cached = { client, db };
  return cached;
}

export async function getCollection<T extends Document>(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}
