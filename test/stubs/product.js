import { faker } from '@faker-js/faker';

export default (
  cost = faker.helpers.arrayElement([5, 10, 15, 20, 25]),
  amountAvailable = faker.datatype.number({ min: 10, max: 20 }),
  productName = faker.commerce.productName(),
) => ({
  productName, cost, amountAvailable,
});