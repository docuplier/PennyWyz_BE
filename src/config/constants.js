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
  // BASE_URL: 'https://pennywyz-fe.vercel.app',
  BASE_URL: 'https://pennywyz.com',
  SOCIAL_AUTH: '/auth',
  LIST_ONE: '/list/public/:listId',
  VERIFY_USER: '/auth/:userId/verify',
};

export const GOOGLE = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  project_id: 'pennywyz',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
};

export const EMAIL = {
  MAILER: {
    SENDER: {
      EMAIL: 'support@pennywyz.com',
      NAME: 'PennyWyz',
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
