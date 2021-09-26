const { request, response } = require("express");
const bookingModel = require("./bookingModel");
const helperWrapper = require("../../helpers/wrapper");
const bookingSeatModel = require("./bookingSeatModel");

module.exports = {
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      } else {
        return helperWrapper.response(
          res,
          200,
          "Sukses get data by Id",
          result
        );
      }
      console.log(result);
      console.log("GET MOVIE BY ID");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  getBookingByUserId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingByUserId(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      } else {
        return helperWrapper.response(
          res,
          200,
          "Sukses get data by UserId",
          result
        );
      }
      console.log(result);
      console.log("GET MOVIE BY ID");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  postBooking: async (req, res) => {
    try {
      const {
        userId,
        dateBooking,
        timeBooking,
        movieId,
        scheduleId,
        totalPayment,
        paymentMethod,
        statusPayment,
        seat,
      } = req.body;

      const setData = {
        userId,
        dateBooking,
        timeBooking,
        movieId,
        scheduleId,
        totalPayment,
        paymentMethod,
        statusPayment,
      };
      let result = await bookingModel.postBooking(setData);
      seat.forEach(async (item) => {
        const setDataSeat = {
          bookingId: result.id,
          movieId,
          scheduleId,
          dateSchedule: dateBooking,
          timeSchedule: timeBooking,
          seat: item,
        };
        await bookingSeatModel.postSeatBooking(setDataSeat);
        // console.log(setDataSeat);
      });

      result = { ...result, seat };
      return helperWrapper.response(res, 400, "Success create data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await bookingModel.getBookingById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      const result = await bookingModel.deleteBooking(id);
      return helperWrapper.response(res, 200, "Delete Sucess", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
};
