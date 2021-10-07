const helperWrapper = require("../../helpers/wrapper");
const { v4: uuidv4 } = require("uuid");
const modelUser = require("./userModule");
const jwt = require("jsonwebtoken");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/delete");
const bcrypt = require("bcrypt");
let salt = bcrypt.genSaltSync(10);

module.exports = {
  getUserByIdUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await modelUser.getUserByIdUser(id);
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
      const checkId = await modelUser.getUserByIdUser(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      const { old_password, password, confirm_password } = req.body;
      //JIKA PASSWORD LAMA DENGAN PASSWORD BARU SAMA

      if (old_password === password) {
        return helperWrapper.response(res, 400, `Password Sama`, null);
      }

      //Jika password dengan confirm password TIDAK SAMA
      if (password !== confirm_password) {
        // Ganti menggunakan response
        const passwordEnkrip = await bcrypt.hash(password, 10);
        const setData = {
          password: passwordEnkrip,
          updateAt: new Date(Date.now()),
        };
        const result = await modelUser.updatePassword(setData, id);
        return helperWrapper.response(
          res,
          200,
          "Success Update Password user",
          result
        );
      } else {
        return helperWrapper.response(res, 400, `Password Harus Sama`, null);
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
    // email(done), nomor telepon
    try {
      const { id } = req.params;
      const checkId = await modelUser.getUserByIdUser(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      const { email, first_name, last_name } = req.body;
      const setData = {
        email,
        first_name,
        last_name,
        updateAt: new Date(Date.now()),
      };
      const result = await modelUser.updateProfile(setData, id);
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
      const checkId = await modelUser.getUserByIdUser(id);
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
      const result = await modelUser.updateImage(setData, id);
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
      const checkId = await modelUser.getUserByIdUser(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      deleteFile(`public/upload/user/${checkId[0].image}`);
      const result = await modelUser.deleteUser(id);
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
      const result = await modelUser.dashboard(movieId, location, premiere);
      return helperWrapper.response(response, 200, "Success get data", result);
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
};
