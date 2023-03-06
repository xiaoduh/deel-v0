const nodemailer = require("nodemailer");

module.exports.sendEmail = async (email, subject, text) => {
  try {
    const transporter = await nodemailer.createTransport({
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent successfully");
  } catch (err) {
    console.log("email not sent" + err);
  }
};
