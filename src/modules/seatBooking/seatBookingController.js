const seatModel = require("./seatBookingModel");
const helperWrapper = require("../../helpers/wrapper");

module.exports = {
  getSeat: async (request, response) => {
    try {
      const result = await seatModel.getSeat();
      return helperWrapper.response(response, 200, `success get data`, result);
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
