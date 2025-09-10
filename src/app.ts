import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoute from './routes/api.route.js';
import { badJsonErrorHandler } from './middlewares/badJsonErrorHandler.middleware.js';
import { clerkMiddleware } from '@clerk/express';
import temporaryFileUpload from './utils/temporaryFileUpload.js';
import { errorHandler } from 'middlewares/errorHandler.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use(temporaryFileUpload);

app.use(badJsonErrorHandler);

app.use(cors());
app.use(helmet());

app.use('/api', apiRoute);

app.use(errorHandler);

export default app;
