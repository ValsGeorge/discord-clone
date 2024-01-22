import { config } from "dotenv";
// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config();
//TODO: figure out how to use multiple .env files
// export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export var CREDENTIALS = true;
var _process_env = process.env;
export var NODE_ENV = _process_env.NODE_ENV, PORT = _process_env.PORT, DB_HOST = _process_env.DB_HOST, DB_NAME = _process_env.DB_NAME, DB_USERNAME = _process_env.DB_USERNAME, DB_PASS = _process_env.DB_PASS, SECRET_KEY = _process_env.SECRET_KEY, LOG_FORMAT = _process_env.LOG_FORMAT, LOG_DIR = _process_env.LOG_DIR, ORIGIN = _process_env.ORIGIN;

//# sourceMappingURL=index.js.map