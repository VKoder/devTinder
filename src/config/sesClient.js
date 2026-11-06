const { SESClient } = require("@aws-sdk/client-ses");
require('dotenv/config');

const sesClient = new SESClient({
  region: process.env.AWS_REGION
});

module.exports = sesClient;