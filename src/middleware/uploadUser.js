const multer = require("multer");
const { getFileInfo } = require("prettier");
const helperWrapper = require("../helpers/wrapper");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/upload/user");
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage }).single("image");

const uploadFilter = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return helperWrapper.response(res, 401, err.message, null);
    }
    if (err) {
      return helperWrapper.response(res, 401, err.message, null);
    }

    next();
  });
};

module.exports = upload;
