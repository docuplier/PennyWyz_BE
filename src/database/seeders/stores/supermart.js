/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import cheerio from 'cheerio';
import model from '../../models/index.js';
import logger from '../../../utils/logger.js';

// URL of the website you want to scrape
const getUrl = (category, page = 1) =>
  `https://www.supermart.ng/collections/${category}?page=${page}`;

const getPriceData = (priceString) => {
  const currency = priceString[0];
  const price = Number(priceString.replace(',', '').substring(1)) || 0;
  const lowerRange = (price * 85) / 100;
  const upperRange = (price * 11) / 10;

  return {
    price,
    lowerRange,
    upperRange,
    currency,
  };
};

// Make an HTTP GET request to fetch the HTML content
async function seed(savedCategoryId, category, page) {
  return axios
    .get(getUrl(category, page))
    .then((response) => cheerio.load(response.data))
    .then(async ($) => {
      const products = [];
      $('.product-block__title-price').each((index, element) => {
        const nameTag = element.children[1];
        const priceTag = element.children[3];

        const priceString = $(priceTag).text().trim();
        const priceData = getPriceData(priceString);
        products.push({
          priceData,
          name: $(nameTag).text().trim(),
          categoryId: savedCategoryId,
          country: 'NG',
        });
      });

      return products;
    })
    .then((products) => model.Product.bulkCreate(products))
    .catch((error) => {
      throw new Error(`Error fetching data: ${error.message}`);
    });
}

const array = [
  {
    category: 'toiletries',
    slug: 'toiletries',
    lastPage: 169,
  },
  {
    category: 'cleaning',
    slug: 'cleaning',
    lastPage: 25,
  },
  {
    category: 'household',
    slug: 'household',
    lastPage: 11,
  },
  {
    category: 'frozen food',
    slug: 'frozen',
    lastPage: 11,
  },
  {
    category: 'kitchen & dining',
    slug: 'kitchen-dining',
    lastPage: 30,
  },
  {
    category: 'health & wellness',
    slug: 'health-wellness',
    lastPage: 57,
  },
  {
    category: 'babies & kids',
    slug: 'baby-kids',
    lastPage: 29,
  },
  {
    category: 'electronics & devices',
    slug: 'electronics',
    lastPage: 48,
  },
  {
    category: 'office supplies',
    slug: 'office-supplies',
    lastPage: 56,
  },
  {
    category: 'alcohol',
    slug: 'alcohol',
    lastPage: 40,
  },
  {
    category: 'drinks',
    slug: 'drinks',
    lastPage: 55,
  },
  {
    category: 'snacks',
    slug: 'snacks',
    lastPage: 79,
  },
  {
    category: 'oil & sauces',
    slug: 'oil-sauces',
    lastPage: 30,
  },
  {
    category: 'food cupboard',
    slug: 'food-cupboard',
    lastPage: 79,
  },
  {
    category: 'local nigerian food',
    slug: 'naija-food',
    lastPage: 7,
  },
  {
    category: 'fresh food & drinks',
    slug: 'fresh-food',
    lastPage: 27,
  },
];

const bufferSize = 3;
export default async function run() {
  logger.info('Seeding the Supermart store products.');
  for (let i = 0; i < array.length; i += 1) {
    const cat = array[i];

    const [savedCategory, _] = await model.Category.findOrCreate({
      where: { name: cat.category },
      defaults: { name: cat.category },
    });

    for (let page = 1; page <= cat.lastPage; page += bufferSize) {
      const size = cat.lastPage < page + bufferSize ? cat.lastPage - page : bufferSize;
      const promiseArr = new Array(size)
        .fill(0)
        .map((__, idx) => seed(savedCategory.id, cat.slug, page + idx));

      await Promise.all(promiseArr);
      logger.info(`Done with an iteration for supermart products. ${cat.category} category.`);
    }
  }
  logger.info('Done seeding supermart products.');
}
