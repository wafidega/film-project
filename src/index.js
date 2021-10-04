const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const routerNavigation = require("./routes"); // ./routes/index.js
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(xss());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public")); // localhost:3001/upload/movie/namagambar

app.use("/", routerNavigation);
app.use("/*", (Request, Response) => {
  Response.status(404).send("Path not Found !");
});
// app.get("/", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

app.listen(port, () => {
  console.log(`Express app is listen on port ${port} !`);
});
