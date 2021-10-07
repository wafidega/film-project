const { promise } = require("../../config/mysql");
const connection = require("../../config/mysql");

module.exports = {
  //Request Get
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "SELECT booking.id, booking.userId, booking.dateBooking, booking.timeBooking, booking.movieId, booking.scheduleId, booking.totalTicket, booking.totalPayment, booking.paymentMethod, booking.statusPayment, bookingseats.seat FROM booking JOIN bookingseats ON booking.id = bookingseats.bookingId WHERE booking.id = ?",
        [id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
      console.log(query.sql);
    }),

  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "SELECT booking.id, booking.userId, booking.dateBooking, booking.timeBooking, booking.movieId, booking.scheduleId, booking.totalTicket, booking.totalPayment, booking.paymentMethod, booking.statusPayment, bookingseats.seat FROM booking JOIN bookingseats ON booking.id = bookingseats.bookingId WHERE booking.userId = ?",
        [id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
      console.log(query.sql);
    }),

  //Request Post
  postBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
  //Request Delete
  deleteBooking: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM booking WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(id);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  dashboard: (movieId, location, premiere) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT MONTH(booking.createdAt) AS month, SUM(booking.totalPayment) AS total FROM booking JOIN schedule ON booking.scheduleId = schedule.id WHERE booking.movieId = ? AND schedule.location LIKE ? AND schedule.premiere LIKE ? AND YEAR(booking.createdAt) = YEAR(NOW()) GROUP BY MONTH(booking.createdAt)",
        [movieId, `%${location}%`, `%${premiere}%`],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
};
