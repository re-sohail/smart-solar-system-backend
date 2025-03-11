const nodeMailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  // Send the OTP to the user
  const transporter = nodeMailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP", error);
    } else {
      console.log("OTP sent successfully", info.response);
    }
  });
};

module.exports = sendOTP;
