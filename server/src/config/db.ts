import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from your .env file!");
    }

    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${dbConnection.connection.host}`);
  } catch (error) {
    console.error(
      `❌ Error connecting to MongoDB: ${(error as Error).message}`,
    );
    process.exit(1);
  }
};
