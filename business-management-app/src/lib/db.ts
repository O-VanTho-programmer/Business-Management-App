import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'MySql@VanTho0948',
  database: 'stock_management',
  waitForConnections: true,
  connectionLimit: 10,
});


export default pool;