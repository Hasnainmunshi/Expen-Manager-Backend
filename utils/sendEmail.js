const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    console.log(`email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed sending email`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
