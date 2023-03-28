const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: "no-reply Tekos",
      to: email,
      subject: subject,
      text: text + link,
    });

    console.log("email sent successfully");
  } catch (err) {
    console.log("email not sent" + err);
  }
};

module.exports = sendEmail;
