import app from './app.js';
import { connectToDB } from './services/db.service.js';
import dotenv from 'dotenv';
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
  connectToDB();
});
