import app from './app';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB';

const PORT = process.env.PORT || 3000;

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
