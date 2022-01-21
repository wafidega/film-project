const express = require("express");

const Router = express.Router();

const movieController = require("./movieControlller");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadMovie");
const { clearMovieRedis } = require("../../middleware/redis");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  movieController.getAllMovie
);

Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.get(
  "/month/:month",
  middlewareAuth.authentication,
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieByMonth
);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  middlewareUpload,
  movieController.postMovie
);
Router.patch(
  "/:id",
  middlewareRedis.clearMovieRedis,
  middlewareUpload,
  movieController.updateMovie
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  movieController.deleteMovie
);

module.exports = Router;
