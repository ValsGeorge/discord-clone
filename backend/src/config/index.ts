import { config } from 'dotenv';
// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config();
//TODO: figure out how to use multiple .env files
// export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const CREDENTIALS = true;
export const {
    NODE_ENV,
    PORT,
    DB_HOST,
    DB_NAME,
    DB_USERNAME,
    DB_PASS,
    SECRET_KEY,
    LOG_FORMAT,
    LOG_DIR,
    ORIGIN,
    COOKIE_DOMAIN,
} = process.env;
