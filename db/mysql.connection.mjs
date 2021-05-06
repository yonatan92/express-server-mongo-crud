import mysql from 'mysql2/promise';

const {
  DB_HOST,
  DB_USER_NAME,
  DB_USER_PASSWORD,
  DB_NAME,
  DB_PORT,
} = process.env;
// create the connection to database
const connection = await mysql.createConnection({
  host: DB_HOST,
  user: DB_USER_NAME,
  password: DB_USER_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});
await connection.connect();
export default connection;
