const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // In dev, just log the OTP instead of sending
    if (process.env.NODE_ENV === "development") {
      console.log(
        `\n📧 Dev Email to: ${to}\nSubject: ${subject}\nText: ${text}\n`
      );
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // ✅ fixed
      port: 465,
      secure: true,
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
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed sending email`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
