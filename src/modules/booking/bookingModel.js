const { promise } = require("../../config/mysql");
const connection = require("../../config/mysql");

module.exports = {
  //Request Get
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "SELECT booking.id, booking.userId, booking.dateBooking, booking.timeBooking, booking.movieId, booking.scheduleId, booking.totalTicket, booking.totalPayment, booking.paymentMethod, booking.statusPayment FROM booking WHERE booking.id = ?",
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
        "SELECT booking.id, booking.userId, booking.dateBooking, booking.timeBooking, booking.movieId, booking.scheduleId, booking.totalTicket, booking.totalPayment, booking.paymentMethod, booking.statusPayment,booking.bookingStatus, bookingseats.seat, movie.name FROM booking JOIN bookingseats ON booking.id = bookingseats.bookingId JOIN movie ON booking.movieId = movie.id WHERE booking.userId = ?",
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
  // Update
  updateBooking: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
  dashboard: (movieId, location, premiere) =>
    new Promise((resolve, reject) => {
      console.log(movieId);
      const query = connection.query(
        "SELECT MONTH(booking.createdAt) AS month, SUM(booking.totalPayment) AS total FROM booking JOIN schedule ON booking.scheduleId = schedule.id WHERE booking.movieId = ? AND schedule.location LIKE ? AND schedule.premiere LIKE ? AND booking.statusPayment LIKE ? AND YEAR(booking.createdAt) = YEAR(NOW()) GROUP BY MONTH(booking.createdAt)",
        [movieId, `%${location}%`, `%${premiere}%`, `%SUCCESS%`],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getBookingSeatByBookingId: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "SELECT seat FROM bookingseats WHERE bookingId = ?",
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
  updateStatus: (status, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET statusPayment = ? WHERE id = ?",
        [status, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id,
              status,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  midtransNotif: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET paymentMethod	 = ?, statusPayment = ?, bookingStatus = ? WHERE id = ?",
        [data.paymentMethod, data.statusPayment, data.bookingStatus, data.id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  paymentUrl: (url, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET paymentUrl = ? WHERE id = ?",
        [url, id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  bookingDataEmail: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT id, dateBooking, timeBooking, movieId, scheduleId, totalPayment, paymentMethod, statusPayment, user.email, user.first_name, totalTicket FROM booking JOIN user ON booking.userId=user.id WHERE booking.id= ${id} `,
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
