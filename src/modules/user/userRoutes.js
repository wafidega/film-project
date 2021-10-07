const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadUser");

Router.get("/user-byid/:id", userController.getUserByIdUser);
Router.patch("/update_password/:id", userController.updatePassword);
Router.patch("/update_profile/:id", userController.updateProfile);
Router.patch("/update-image/:id", middlewareUpload, userController.updateImage);
Router.delete(
  "/delete-user/:id",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  userController.deleteUser
);
Router.get(
  "/dashboard/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  middlewareRedis.clearMovieRedis,
  userController.dashboard
);
module.exports = Router;
