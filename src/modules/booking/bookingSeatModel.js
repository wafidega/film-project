const { promise } = require("../../config/mysql");
const connection = require("../../config/mysql");

module.exports = {
  postSeatBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO bookingseats SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
      console.log(query.sql);
    }),
};
