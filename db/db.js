// db.js
import mysql from "mysql2"

// Create a connection to the database
const connection = mysql.createConnection({
  host: '127.0.0.1',        // The hostname of the database (or IP address)
  user: 'root',     // Your MySQL username
  password: '', // Your MySQL password
  database: 'autobre1_autobreeze'  // The name of the database
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database as ID ' + connection.threadId);
});

export default connection;
