const { SESClient } = require("@aws-sdk/client-ses");
import "dotenv/config";


const sesClient = new SESClient({
  region: process.env.AWS_REGION
});

export default sesClient;