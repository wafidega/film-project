const multer = require("multer");
const helperWrapper = require("../helpers/wrapper");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/upload/movie");
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const maxSize = 1 * 1024 * 1024; // limit file adalah 1 mb
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only file png, jpg, jpeg format allowed"));
    }
  },
  limits: { fileSize: maxSize },
}).single("image");

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
