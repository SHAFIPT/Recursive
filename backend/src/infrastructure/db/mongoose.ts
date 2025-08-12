import mongoose from "mongoose";
import config from "../../config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};