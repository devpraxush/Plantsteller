import mongoose from 'mongoose';

import { loadEnv, config } from '../src/config/env.ts';
import { Product } from '../src/models/Product.ts';
import { plants } from '../../Frontend/src/app/data/plants.ts';

loadEnv();

const products = plants.map(({ id, aiRecommended, badge, ...plant }) => ({
  ...plant,
  stock: plant.inStock ? 50 : 0,
}));

try {
  await mongoose.connect(config.mongoUri, {
    retryWrites: true,
    w: 'majority',
  });

  const operations = products.map(product => ({
    updateOne: {
      filter: { name: product.name, scientificName: product.scientificName },
      update: { $set: product },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(operations);

  console.log(`Seed complete: ${products.length} products processed`);
  console.log(`Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}`);
} catch (error) {
  console.error('Seed failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
