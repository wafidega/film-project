const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

//Booking
Router.get("/:id", bookingController.getBookingById);
Router.get("/user-id/:id", bookingController.getBookingByUserId);
Router.post("/", bookingController.postBooking);
Router.delete("/:id", bookingController.deleteBooking);

//Booking Seats
// Router.post("/bookseat/", bookingController.postBookingSeat);
// Router.patch("/bookseat/:id", bookingController.updateBookingSeat);

module.exports = Router;
