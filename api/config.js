import * as dotenv from "dotenv";
dotenv.config();
const { DB_USER, DB_PASS, KEY, PORT } = process.env;
export default { db_user: DB_USER, db_pass: DB_PASS, key: KEY, port: PORT };
