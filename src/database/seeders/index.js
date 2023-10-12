import axios from 'axios';
import cheerio from 'cheerio';
import model from '../models/index.js';

// URL of the website you want to scrape
const getUrl = (category, page = 1) =>
  `https://www.supermart.ng/collections/${category}?page=${page}`;

const getPriceData = (priceString) => {
  const currency = priceString[0];
  const price = Number(priceString.replace(',', '').substring(1));
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
export default async function (category = 'toiletries', page = 1) {
  return axios
    .get(getUrl(category, page))
    .then((response) => cheerio.load(response.data))
    .then(async ($) => {
      const [savedCategory, _] = await model.Category.findOrCreate({
        where: { name: category },
        defaults: { name: category },
      });

      const products = [];
      $('.product-block__title-price').each((index, element) => {
        const nameTag = element.children[1];
        const priceTag = element.children[3];

        const priceString = $(priceTag).text().trim();
        const priceData = getPriceData(priceString);
        products.push({
          priceData,
          name: $(nameTag).text().trim(),
          categoryId: savedCategory.id,
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
