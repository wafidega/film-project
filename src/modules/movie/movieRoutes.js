const express = require("express");

const Router = express.Router();

const movieController = require("./movieControlller");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadMovie");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  middlewareRedis.clearMovieRedis,
  movieController.getAllMovie
);

Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  middlewareUpload,
  movieController.postMovie
);
Router.patch("/:id", movieController.updateMovie);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  movieController.deleteMovie
);

module.exports = Router;
