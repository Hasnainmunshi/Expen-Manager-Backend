const bcrypt = require("bcrypt");

const generateOTP = async () => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log("Hashed OTP:", hashedOTP);
    return { otp, hashedOTP };
  } catch (error) {
    throw new Error(`Failed to generate OTP: ${error.message}`);
  }
};

module.exports = generateOTP;
