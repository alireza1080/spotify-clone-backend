import app from './app.js';
import { connectToDB } from './services/db.service.js';

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
  connectToDB();
});
