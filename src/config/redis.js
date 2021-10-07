const redis = require("redis");

const client = redis.createClient({
  //for deploy to heroku
  // host: "redis-10368.c61.us-east-1-3.ec2.cloud.redislabs.com",
  // port: "10368",
  // password: "8piQMOg2bTx0bc5YKU3QwAVqlyDtmwvt",
});

client.on("connect", () => {
  console.log("You are now connected to db redis");
});

module.exports = client;
