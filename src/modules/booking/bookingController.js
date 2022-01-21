const { request, response } = require("express");
const bookingModel = require("./bookingModel");
const helperWrapper = require("../../helpers/wrapper");
const bookingSeatModel = require("./bookingSeatModel");
const scheduleModel = require("../schedule/scheduleModel");
const midtrans = require("../../helpers/midtrans");

module.exports = {
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingById(id);
      for (const item of result) {
        console.log(item);
        // get booking seat by booking id
        const seat = await bookingModel.getBookingSeatByBookingId(id);
        console.log(seat);
        const newSeat = seat;
        const dataSeat = newSeat.map((item) => {
          return item.seat;
        });
        item.seat = dataSeat;
      }

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
        totalTicket,
        scheduleId,
        paymentMethod,
        seat,
      } = req.body;
      let price = await scheduleModel.getScheduleById(scheduleId);
      price = price[0].price;
      const totalPayment = price * seat.length;
      const setData = {
        userId,
        dateBooking,
        timeBooking,
        movieId,
        scheduleId,
        totalTicket,
        totalPayment: totalPayment,
        paymentMethod,
        statusPayment: "PENDING",
        bookingStatus: "notActive",
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
      const resultMidtrans = await midtrans.post(
        result.id,
        setData.totalPayment
      );
      result = { ...result, seat };
      console.log(resultMidtrans);
      return helperWrapper.response(res, 200, "Success create data", {
        ...result,
        urlRedirect: resultMidtrans,
      });
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
  dashboard: async (request, response) => {
    try {
      let { movieId, location, premiere } = request.query;
      const result = await bookingModel.dashboard(movieId, location, premiere);
      if (result.length < 1) {
        return helperWrapper.response(response, 404, "Data not found", result);
      }
      // console.log(result);
      return helperWrapper.response(
        response,
        200,
        "Success get dashboard data",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
  postMidtransNotif: async (req, res) => {
    try {
      const result = await midtrans.notif(req.body);
      console.log(result);
      const {
        order_id: id,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
        payment_type: paymentMethod,
      } = result;

      const setData = {
        paymentMethod,
        statusPayment: transactionStatus,
      };

      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          setData.statusPayment = "FAILED";
          await bookingModel.updateBooking(setData, id);
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your databaase to 'success'
          setData.statusPayment = "SUCCESS";
          await bookingModel.updateBooking(setData, id);
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your databaase to 'success'
        setData.statusPayment = "SUCCESS";
        await bookingModel.updateBooking(setData, id);
        return helperWrapper.response(
          res,
          200,
          `succes create your booking`,
          result
        );
      } else if (transactionStatus == "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        setData.statusPayment = "FAILED";
        await bookingModel.updateBooking(setData, id);
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        setData.statusPayment = "EXPIRED";
        await bookingModel.updateBooking(setData, id);
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        setData.statusPayment = "PENDING";
        await bookingModel.updateBooking(setData, id);
      }
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
  bookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const status = "ticket used";

      // const idd = "bookingID-" + uuidv4();
      // console.log(idd);
      const dataBooking = await bookingModel.getBookingById(id);

      if (dataBooking[0].booking_status !== "active") {
        return helperWrapper.response(res, 400, `ticket cannot be used`, null);
      }
      const result = await bookingModel.updateStatus(status, id);

      return helperWrapper.response(res, 200, "ticket scanned..!", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request (${error.message})`,
        null
      );
    }
  },
};
