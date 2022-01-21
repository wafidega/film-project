const connection = require("../../config/mysql");

module.exports = {
  getSeat: (idSchedule, idMovie, date, time) =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM bookingseats", (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
};
