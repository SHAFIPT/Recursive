import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv'
import { errorHandler } from '../http/middleware/errorHandler';
import nodeRoutes from '../http/nodeRoutes';
const app = express();
dotenv.config()
app.use(helmet());
app.use(cors({ 
  origin: ["http://localhost:3000"],
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());

app.use("/nodes", nodeRoutes);

app.use(errorHandler);

export { app };
