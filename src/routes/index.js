const { request, response } = require("express");
const express = require("express");
const Router = express.Router();
const helloRoutes = require("../modules/hello/helloRoutes");
const movieRoutes = require("../modules/movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");

// Router.get("/hello", (request, response) => {
//   response.send("Hello World");
// });

Router.use("/hello", helloRoutes);
Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", bookingRoutes);

module.exports = Router;
