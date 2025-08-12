import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from '../http/middleware/errorHandler';
import nodeRoutes from '../http/nodeRoutes';

const app = express();
dotenv.config();

const allowedOrigins: string[] = [
  process.env.CLIENT_URL,
  'http://localhost:3000'
].filter((origin): origin is string => Boolean(origin));

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/nodes", nodeRoutes);

app.use(errorHandler);

export { app };
