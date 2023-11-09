import seedSupermartProducts from './stores/supermart.js';
import seedAldiProducts from './stores/aldi.js';
import models from '../models/index.js';
import logger from '../../utils/logger.js';

export default async function seed() {
  logger.info('Checking the Product table for data');
  const count = await models.Product.count();
  logger.info(`Total count of Products ${count}`);
  if (count > 0) return [];

  logger.info('Seeding Products.');
  try {
    await seedAldiProducts();
    await seedSupermartProducts();
  } catch (error) {
    logger.error(error.message);
  }
  return [];
}
seed();