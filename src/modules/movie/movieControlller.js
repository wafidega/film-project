const { request, response } = require("express");
const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/delete");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { search, page, limit } = request.query;
      //Mengubah data menjadi number karena datanya masih String
      page = Number(page);
      limit = Number(limit);
      // TAMBAHKAN PROSES PEMBERIAN NILAI DEFAULT VALUE
      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie();
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(search, limit, offset);

      redis.setex(
        `getMovie:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );
      // response.status(200).send(result);
      return helperWrapper.response(
        response,
        200,
        "Success get data",
        result,
        pageInfo
      );
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
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getMovieById(id);
      //nympen data di redis
      redis.setex(`getMovie:${id}`, 3600, JSON.stringify(result));
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
          "Sukses get data by Id",
          result
        );
      }

      console.log(result);
      console.log("GET MOVIE BY ID");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  postMovie: async (req, res) => {
    try {
      const { name, genre, director, duration, cast, synopsis, releaseDate } =
        req.body;
      const setData = {
        name,
        genre,
        director,
        duration,
        cast,
        synopsis,
        releaseDate,
        image: req.file ? req.file.filename : null,
      };
      const result = await movieModel.postMovie(setData);
      return helperWrapper.response(res, 200, "Success create data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      const { name, genre, director, duration, cast, synopsis, releaseDate } =
        req.body;
      const setData = {
        name,
        genre,
        director,
        duration,
        cast,
        synopsis,
        releaseDate,
        updatedAt: new Date(Date.now()),
      };

      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await movieModel.updateMovie(setData, id);
      return helperWrapper.response(res, 200, "Sucess update data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message}`,
        null
      );
    }
  },

  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${id} Not FOund`,
          null
        );
      }
      deleteFile(`public/upload/movie/${checkId[0].image}`);
      const result = await movieModel.deleteMovie(id);
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
};
