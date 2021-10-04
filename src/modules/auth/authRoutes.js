const express = require("express");

const Router = express.Router();

const authController = require("./authController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadUser");

Router.post("/register", middlewareUpload, authController.register);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.get("/user-byid/:id", authController.getUserByIdUser);
Router.patch("/update_password/:id", authController.updatePassword);
Router.patch("/update_profile/:id", authController.updateProfile);
Router.patch("/update-image/:id", middlewareUpload, authController.updateImage);
Router.delete(
  "/delete-user/:id",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  authController.deleteUser
);
Router.get(
  "/dashboard/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  middlewareRedis.clearMovieRedis,
  authController.dashboard
);
module.exports = Router;
