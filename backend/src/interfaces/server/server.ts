import dotenv from "dotenv";
dotenv.config();

import config from "../../config";
import { connectDB } from "../../infrastructure/db/mongoose";
import { app } from "./app";


const start = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start:", err);
});
