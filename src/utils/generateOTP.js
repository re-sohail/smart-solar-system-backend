const generateOTP = (email) => {
  // Generate a 4 digit random number
  const otp = Math.floor(1000 + Math.random() * 9000);

  return otp;
};

module.exports = generateOTP;
