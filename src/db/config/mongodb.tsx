import mongoose, { ConnectOptions } from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let cachedClient: typeof mongoose | null = null;

const dbConnect = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  const options: ConnectOptions = {
    bufferCommands: false,
  };

  cachedClient = await mongoose.connect(MONGO_URI, options);

  return cachedClient;
};

export default dbConnect;
