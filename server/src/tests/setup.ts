import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Give the fake database more time (60 seconds) to download and start up the first time
jest.setTimeout(60000);

let mongoServer: MongoMemoryServer;

// 1. BEFORE ALL tests run, start the fake database and connect to it
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// 2. AFTER EACH individual test finishes, clean up the data.
// This ensures that test A doesn't accidentally affect test B.
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// 3. AFTER ALL tests are completely done, disconnect and turn off the fake database
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
