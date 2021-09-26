const { request, response } = require("express");
const express = require("express");
const Router = express.Router();
const helloController = require("./helloController");

// Router.get("/", (request, response) => {
//   response.send("Hello World");
// });

Router.get("/", helloController.getHello);
module.exports = Router;
