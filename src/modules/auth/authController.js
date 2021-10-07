const helperWrapper = require("../../helpers/wrapper");
const { v4: uuidv4 } = require("uuid");
const modelAuth = require("./authModel");
const jwt = require("jsonwebtoken");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/delete");
const authModel = require("./authModel");
const bcrypt = require("bcrypt");
let salt = bcrypt.genSaltSync(10);

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, first_name, last_name, image } = req.body;
      // Proses Pengecekan sudah terdaftar atau belum

      //Enkrip password
      const passwordEnkrip = await bcrypt.hash(password, 10);
      const setData = {
        id: uuidv4(),
        email,
        password: passwordEnkrip,
        first_name,
        last_name,
        image: req.file ? req.file.filename : null,
      };

      const result = await modelAuth.register(setData);
      console.log(password);
      return helperWrapper.response(res, 200, "Success register user", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await modelAuth.getUserByEmail(email);
      const isMatch = await bcrypt.compare(password, checkUser[0].password);
      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not Registered");
      }
      if (!isMatch) {
        return helperWrapper.response(res, 400, "Wrong Password");
      }
      // console.log(checkUser);
      //proses utama membuat token jwt(data yang mau diubah, kata kunci, lama token yang bisa digunakan )
      const payload = checkUser[0];
      delete payload.password;
      const token = jwt.sign({ ...payload }, "RAHASIA", {
        expiresIn: "24h",
      });
      return helperWrapper.response(res, 200, "Success Login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      redis.setex(`accessToken:${token}`, 86400, token);
      return helperWrapper.response(res, 200, "Success Logout", null);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
  getUserByIdUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await modelAuth.getUserByIdUser(id);
      //nympen data di redis
      redis.setex(`getUser:${id}`, 3600, JSON.stringify(result));
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      } else {
        return helperWrapper.response(
          res,
          200,
          "Sukses get User by Id",
          result
        );
      }
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
};
