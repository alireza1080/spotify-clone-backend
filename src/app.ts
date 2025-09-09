import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoute from './routes/api.route.js';
import { badJsonErrorHandler } from './middlewares/badJsonErrorHandler.middleware.js';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp',
    createParentPath: true,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    abortOnLimit: true,
    responseOnLimit: 'File too large',
    debug: true,
    safeFileNames: true,
    preserveExtension: true,
    uploadTimeout: 10000,
  })
);

app.use(clerkMiddleware());

app.use(badJsonErrorHandler);

app.use(cors());
app.use(helmet());

app.use('/api', apiRoute);

export default app;
