export default {
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRESIN: 1000 * 60 * 5, // 5 minutues
  ACCEPTED_COINS: [100, 50, 20, 10, 5],
  ID_LENGTH: 16,
  SUPPORTED_COUNTRIES: ['NG', 'US', 'UK'],
};
export const USER_ROLES = {
  SELLER: 'seller',
  BUYER: 'buyer',
};

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  PURCHASE: 'purchase',
  RESET: 'reset',
};
