const connection = require("../../config/mysql");

module.exports = {
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email = ?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  getUserByIdUser: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  updatePassword: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  updateImage: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  updateProfile: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  deleteUser: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM user WHERE id = ?", id, (error, result) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
  dashboard: (movieId, location, premiere) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT MONTH(schedule.createdAt) AS month, SUM(totalPayment) AS total FROM booking JOIN schedule WHERE schedule.movieId = ? AND schedule.location = ? AND schedule.premiere = ? AND YEAR(booking.createdAt) = YEAR(NOW()) GROUP BY MONTH(booking.createdAt)",
        [movieId, `%${location}%`, `%${premiere}%`],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }), //Pindahin ke booking
};
