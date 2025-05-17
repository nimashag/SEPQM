// db.test.ts - handle in memory DB lifecycle
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

//create an isolated DB instance in memory
let mongoServer: MongoMemoryServer;

export const connectMockDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const closeMockDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearMockDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
