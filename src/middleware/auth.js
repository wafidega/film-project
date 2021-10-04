const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please Login First");
    }
    token = token.split(" ")[1];

    redis.get(`accessToken:${token}`, (error, result) => {
      if (!error && result !== null) {
        return helperWrapper.response(
          res,
          403,
          "Your token is destroyed please login again"
        );
      }
    });
    //Validasi
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(res, 403, error.message);
      }
      req.decodeToken = result;
      next();
    });
    isAdmin: (req, res, next) => {
      console.log(req.decadeToken);
    };
    console.log("Authentication proses");
  },
};
