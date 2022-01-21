const helperWrapper = require("../../helpers/wrapper");
const { v4: uuidv4 } = require("uuid");
const modelAuth = require("./authModel");
const jwt = require("jsonwebtoken");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/delete");
const authModel = require("./authModel");
const bcrypt = require("bcrypt");
const sendMail = require("../../helpers/email");
let salt = bcrypt.genSaltSync(10);

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, first_name, last_name } = req.body;
      if (
        email === "" ||
        password === "" ||
        first_name === "" ||
        last_name == ""
      ) {
        return helperWrapper.response(res, 400, "fill all the form");
      }
      const checkEmail = await modelAuth.getUserByEmail(email);
      //Pengecekan Email
      if (checkEmail.length > 0) {
        return helperWrapper.response(res, 400, "Email already exits");
      }
      // Enkrip password
      const passwordEnkrip = await bcrypt.hash(password, 10);
      const setData = {
        id: uuidv4(),
        email,
        password: passwordEnkrip,
        first_name,
        last_name,
        image: null,
      };
      const result = await modelAuth.register(setData);
      // console.log(password);
      const setDataEmail = {
        to: email,
        subject: "Verification Email",
        template: "email-verification",
        data: {
          first_name,
          last_name,
          id: result.id,
          link: `${process.env.URL_BACKEND}/auth/activation/${result.id}`,
        },
      };
      sendMail(setDataEmail);
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
  verifEmail: async (req, res) => {
    try {
      const id = req.params.id;
      const cekUser = await authModel.getUserByIdUser(id);
      if (cekUser.length < 1) {
        return helperWrapper.response(res, 400, "User not found");
      }
      // 1 = AKTIF | 0 = NONAKTIF
      const setPostData = {
        isActive: 1,
      };
      let result = await authModel.updateProfile(setPostData, id);
      // res.render("activateEmail/index.ejs");
      return helperWrapper.response(
        res,
        200,
        "Success Activated Account, Login Now",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Error handling jika email dan password kosong
      if (email === "") {
        return helperWrapper.response(res, 400, "fill email form");
      }
      if (password === "") {
        return helperWrapper.response(res, 400, "fill password form");
      }
      const checkUser = await modelAuth.getUserByEmail(email);
      console.log(checkUser);
      const isMatch = await bcrypt.compare(password, checkUser[0].password);
      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not Registered");
      }
      if (checkUser[0].isActive !== 1) {
        return helperWrapper.response(
          res,
          400,
          "Before Login, Verify Your Email"
        );
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
  // refresh Token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      redis.get(`refreshToken:${refreshToken}`, (error, result) => {
        if (!error && result !== null) {
          return helperWrapper.response(
            res,
            400,
            `your refresh token cannot be used again`
          );
        }

        jwt.verify(refreshToken, process.env.SECRETE_KEY, (error, result) => {
          if (error) {
            return helperWrapper.response(res, 403, error.message);
          }

          delete result.iat;
          delete result.exp;
          const token = jwt.sign(result, process.env.SECRETE_KEY, {
            expiresIn: "2h",
          });
          const newRefreshToken = jwt.sign(result, process.env.SECRETE_KEY, {
            expiresIn: "24h",
          });

          // redis.setex(`refreshToken:${refreshToken}`, 3600 * 24, refreshToken);
          return helperWrapper.response(res, 200, `success refresh token`, {
            id: result.id,
            token,
            refreshToken: newRefreshToken,
          });
        });
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `bad request ${error.message}`,
        null
      );
    }
  },
};
