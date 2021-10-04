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

      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not Registered");
      }

      if (password !== checkUser[0].password) {
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
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await modelAuth.getUserByIdUser(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      const { password, confirm_password } = req.body;
      const isMatch = await bcrypt.compareSync(password, checkId[0].password);
      if (confirm_password !== password) {
        console.log("password tidak sama");
      }
      if (checkId[0].password === isMatch) {
        const passwordEnkrip = await bcrypt.hash(password, 10);
        const setData = {
          password: passwordEnkrip,
          updateAt: new Date(Date.now()),
        };
        const result = await modelAuth.updatePassword(setData, id);
        return helperWrapper.response(
          res,
          200,
          "Success Update Password user",
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
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await modelAuth.getUserByIdUser(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      const { first_name, last_name } = req.body;
      const setData = {
        first_name,
        last_name,
        updateAt: new Date(Date.now()),
      };
      const result = await modelAuth.updateProfile(setData, id);
      return helperWrapper.response(
        res,
        200,
        "Success Update Profile user",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  updateImage: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await modelAuth.getUserByIdUser(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      const { image } = req.body;
      const setData = {
        image: req.file ? req.file.filename : null,
        updateAt: new Date(Date.now()),
      };
      const result = await modelAuth.updateImage(setData, id);
      return helperWrapper.response(
        res,
        200,
        "Success Update Image Profile user",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await authModel.deleteUser(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      deleteFile(`public/upload/user/${checkId[0].image}`);
      const result = await authModel.deleteUser(id);
      return helperWrapper.response(res, 200, "Delete Sucess", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  dashboard: async (request, response) => {
    try {
      let { movieId, location, premiere } = request.query;
      const result = await authModel.dashboard(movieId, location, premiere);

      // redis.setex(
      //   `dashboard:${JSON.stringify(request.query)}`,
      //   3600,
      //   JSON.stringify({ result, pageInfo })
      // );
      // response.status(200).send(result);
      return helperWrapper.response(response, 200, "Success get data", result);
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request (${error.message})`,
        null
      );
      // response.status(400).send(error.message);
    }
  },
};
