const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadUser");

//Booking
Router.get("/:id", bookingController.getBookingById);
Router.get("/user-id/:id", bookingController.getBookingByUserId);
Router.post("/", bookingController.postBooking);
Router.delete("/:id", bookingController.deleteBooking);
Router.get("/dashboard", bookingController.dashboard);

//Booking Seats
// Router.post("/bookseat/", bookingController.postBookingSeat);
// Router.patch("/bookseat/:id", bookingController.updateBookingSeat);

module.exports = Router;
