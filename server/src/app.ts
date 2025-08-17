import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { prisma } from "./config/prisma";
import { globalErrorHandler } from './middlewares/errorHandler';
import { requestLoggerMiddleware } from './middlewares/requestLogger';
import logger from './utils/logger';

import authRoutes from "./routes/auth.route";
import doctorRoutes from "./routes/doctor.route";
import appointmentRoutes from "./routes/appointment.route";

const app: Express = express();
app.set('etag', false);

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiter (global)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Logging & request parsing
app.use(requestLoggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    morgan('combined', {
        stream: {
            write: (message: string) => logger.info(message.trim()),
        },
    })
);

// Routes
app.get("/", async (req: Request, res: Response) => {
    const response = await prisma.$executeRaw`SELECT 1`;
    return res.json({ response });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/appointment", appointmentRoutes);

// Global error handler (should be after routes)
app.use(globalErrorHandler);

export default app;
