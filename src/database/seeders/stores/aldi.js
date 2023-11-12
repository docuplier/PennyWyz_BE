/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
import puppeteer from 'puppeteer';
import axios from 'axios';
import logger from '../../../utils/logger.js';

// URL of the website you want to scrape
const getUrl = (category, page = 1) =>
  `https://groceries.aldi.co.uk/en-GB/${category}?page=${page}`;

const getPriceData = (priceString) => {
  const currency = priceString[0];
  const price = Number(priceString.split('\n')[0].replace(',', '').substring(1)) || 0;
  const lowerRange = Math.round((price * 1000 * 85) / 1000) / 100;
  const upperRange = Math.round((price * 1000 * 11) / 100) / 100;

  return {
    price,
    lowerRange,
    upperRange,
    currency,
  };
};

async function seed(savedCategory, category, currentPage, page) {
  await page.mainFrame().goto(getUrl(category, currentPage), {
    waitUntil: 'networkidle0',
  });
  if (currentPage === 1) {
    const cookies = await page.cookies();
    await page.setCookie(...cookies);
    await page.reload({ waitUntil: 'networkidle0' });
  }

  const products = await page.evaluate(() => {
    const productList = document.querySelectorAll('.product-tile');

    return Array.from(productList).map((p) => {
      const name = p.querySelector('.product-tile-text').innerText.trim();
      const price = p.querySelector('.product-tile-price').innerText.trim();

      return { name, price };
    });
  });
  console.log(JSON.stringify(products.map((x) => ({
    priceData: getPriceData(x.price),
    name: x.name,
    country: 'UK',
  })), null, 2));
  // await axios.post('https://pennywyz.com/api/v1/products', {
  //   category: savedCategory,
  //   products: products.map((x) => ({
  //     priceData: getPriceData(x.price),
  //     name: x.name,
  //     country: 'UK',
  //   })),
  // });
}

const array = [
  {
    category: 'chilled food',
    slug: 'chilled-food',
    lastPage: 30,
  },
  {
    category: 'fruits & veggies',
    slug: 'fresh-food/fruit-vegetables',
    lastPage: 7,
  },
  {
    category: 'meat & poultry',
    slug: 'fresh-food/meat-poultry',
    lastPage: 11,
  },
  {
    category: 'food cupboard',
    slug: 'food-cupboard',
    lastPage: 35,
  },
  {
    category: 'bakery',
    slug: 'bakery',
    lastPage: 7,
  },
  {
    category: 'fresh fish',
    slug: 'fresh-food/fresh-fish',
    lastPage: 3,
  },
  {
    category: 'frozen food',
    slug: 'frozen',
    lastPage: 15,
  },
  {
    category: 'drinks',
    slug: 'drinks',
    lastPage: 20,
  },
  {
    category: 'baby & toddler',
    slug: 'baby-toddler',
    lastPage: 3,
  },
  {
    category: 'household',
    slug: 'household',
    lastPage: 9,
  },
  {
    category: 'health & beauty',
    slug: 'health-beauty',
    lastPage: 7,
  },
  {
    category: 'pets care',
    slug: 'pet-care',
    lastPage: 4,
  },
];

const bufferSize = 1;
export default async function run() {
  logger.info('Seeding the Aldi store products.');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  for (let i = 0; i < array.length; i += 1) {
    const cat = array[i];

    for (let currentPage = 1; currentPage <= cat.lastPage; currentPage += bufferSize) {
      await seed(cat.category, cat.slug, currentPage, page);
    }
    logger.info(`Done with an iteration for aldi products.${cat.category} category.`);
  }
  logger.info('Done seeding products in aldi stores.');
  await browser.close();
}
