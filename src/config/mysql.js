require("dotenv/config");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  //For develop
  host: "localhost",
  user: "root",
  password: "",
  database: "film",
  // Env
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  //for deploy to heroku
  // host: "ec2-54-236-24-175.compute-1.amazonaws.com",
  // user: "fw11dega",
  // password: "LAvfhh",
  // database: "fw11dega_dbfilm",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("You Are now connected db mysql...");
});

module.exports = connection;
