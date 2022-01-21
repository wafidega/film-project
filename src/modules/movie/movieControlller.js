const { request, response } = require("express");
const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/delete");

module.exports = {
  // get Data
  getAllMovie: async (request, response) => {
    try {
      let { search, sort, order, page, limit } = request.query;
      //Mengubah data menjadi number karena datanya masih String
      page = Number(page);
      limit = Number(limit);
      // TAMBAHKAN PROSES PEMBERIAN NILAI DEFAULT VALUE
      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(search);
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      if (request.query.sort === "") {
        sort = "name";
        console.log(true);
      }

      const result = await movieModel.getAllMovie(
        search,
        sort,
        order,
        limit,
        offset
      );

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
  getMovieByMonth: async (req, res) => {
    try {
      const { month } = req.params;
      const result = await movieModel.getMovieByMonth(month);
      //nympen data di redis
      // redis.setex(`getMovie:${month}`, 3600, JSON.stringify(result));
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by Id ${month} Not FOund`,
          null
        );
      } else {
        return helperWrapper.response(
          res,
          200,
          "Sukses get data by Month",
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
  // post Data
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
  // Update Data
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
        image: req.file ? req.file.filename : null,
        updatedAt: new Date(Date.now()),
      };

      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      if (checkId[0].image && req.file) {
        deleteFile(`public/upload/movie/${checkId[0].image}`);
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
  // Delete
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
      if (checkId[0].image) {
        deleteFile(`public/upload/movie/${checkId[0].image}`);
      }
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
