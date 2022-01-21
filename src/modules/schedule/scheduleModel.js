const { promise } = require("../../config/mysql");
const connection = require("../../config/mysql");

module.exports = {
  getAllSchedule: (location, movieId, limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT schedule.id, schedule.premiere, schedule.price, schedule.location, schedule.dateStart, schedule.dateEnd, schedule.time, schedule.movieId, movie.name FROM schedule JOIN movie ON movie.id=schedule.movieId WHERE location LIKE ? AND movieId LIKE ? ORDER BY location ASC LIMIT ? OFFSET ?",
        [`%${location}%`, `%${movieId}%`, limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT schedule.id, schedule.premiere, schedule.price, schedule.location, schedule.dateStart, schedule.dateEnd, schedule.time, schedule.movieId, movie.name FROM schedule JOIN movie ON movie.id=schedule.movieId WHERE schedule.id = ?",
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

  getCountSchedule: (search) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule WHERE location LIKE ?",
        [`%${search}%`],
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  postSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
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

  updateSchedule: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
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
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM schedule WHERE id = ?",
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
};
