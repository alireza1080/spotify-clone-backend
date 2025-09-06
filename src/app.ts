import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoute from './routes/api.route.js';
import { badJsonErrorHandler } from './middlewares/badJsonErrorHandler.middleware.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use(badJsonErrorHandler);

app.use(cors());
app.use(helmet());

app.use('/api', apiRoute);

export default app;
