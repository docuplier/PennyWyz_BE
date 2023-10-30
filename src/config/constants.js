import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') dotenv.config();

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

export const MAILERSEND = {
  API_KEY: process.env.MAILERSEND_API_KEY,
  TEMPLATE_ID: {
    EMAIL_VERIFICATION: 'jpzkmgqneqng059v',
    LIST_SHARING: '0r83ql3e8jv4zw1j',
  },
};

export const FRONTEND = {
  BASE_URL: 'https://pennywyz-fe.vercel.app',
  LIST_ONE: '/lists/:listId',
  VERIFY_USER: '/users/:userId/verify',
};

export const EMAIL = {
  MAILER: {
    SENDER: {
      EMAIL: 'support@pennywyz.com',
      NAME: 'Support',
    },
  },
  EMAIL_VERIFICATION: {
    SUBJECT: 'Welcome to PennyWyz',
    TYPE: 'email_verification',
  },
  LIST_SHARING: {
    SUBJECT: 'Check this PennyWyz List out',
    TYPE: 'list_sharing',
  },
};
