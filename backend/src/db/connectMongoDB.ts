import mongoose from 'mongoose';

export async function connectMongoDB() {
  try {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
      throw new Error('MONGO_URL is not defined');
    }
    await mongoose.connect(mongoURL);
    console.log('MongoDB connection established successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred', error);
    }
    process.exit(1);
  }
}
