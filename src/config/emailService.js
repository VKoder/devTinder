const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("./sesClient");

const sendEmail = async (to, subject, body) => {
  try {
    const params = {
      Source: process.env.SES_SENDER_EMAIL,

      Destination: {
        ToAddresses: [to],
      },

      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },

        Body: {
          Text: {
            Data: body,
            Charset: "UTF-8",
          },
        },
      },
    };

    const command = new SendEmailCommand(params);

    const response = await sesClient.send(command);

    console.log("Email sent successfully:", response.MessageId);

    return response;

  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = { sendEmail };