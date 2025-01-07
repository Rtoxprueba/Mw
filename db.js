import { createPool } from "mysql2/promise";
export const pool = createPool({
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLHOST,
  database: process.env.MYSQL_DATABASE,
});
// ||
// ||
// ||
// ||
