const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
  console.log("You are now connected to db redis");
});

module.exports = client;
