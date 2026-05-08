import { resolve } from "path"; 
import dotenv from "dotenv";

const envPath ={
    dev:".env",
}
dotenv.config({ path: resolve(`./config/${envPath.dev}`) });
export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const WHITE_LIST = process.env.WHITE_LIST;
export const SALT = process.env.SALT;
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
export const TOKEN_ACCESS_USER_SECRET_KEY = process.env.TOKEN_ACCESS_USER_SECRET_KEY;
export const TOKEN_REFRESH_USER_SECRET_KEY = process.env.TOKEN_REFRESH_USER_SECRET_KEY;
export const TOKEN_ACCESS_ADMIN_SECRET_KEY = process.env.TOKEN_ACCESS_ADMIN_SECRET_KEY;
export const TOKEN_REFRESH_ADMIN_SECRET_KEY = process.env.TOKEN_REFRESH_ADMIN_SECRET_KEY;
export const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES;
export const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES;
export const CLIENT_ID = process.env.CLIENT_ID;
export const USER_EMAIL = process.env.USER_EMAIL;
export const USER_PASSWORD = process.env.USER_PASSWORD; 
