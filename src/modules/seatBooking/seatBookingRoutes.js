const express = require("express");

const Router = express.Router();
const seatBookingController = require("./seatBookingController");

Router.get("/", seatBookingController.getSeat);

module.exports = Router;
