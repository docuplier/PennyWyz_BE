import { faker } from '@faker-js/faker';

export default (
  role = faker.helpers.arrayElement(["buyer", "seller"]),
  username = faker.internet.userName(),
  password = faker.random.alphaNumeric(6),
) => ({ role, username, password });