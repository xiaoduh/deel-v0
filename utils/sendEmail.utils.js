const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "therealbigdeeel@gmail.com",
        pass: "swkenxwkmmiyyyqn",
      },
    });

    await transporter.sendMail({
      from: "no-reply deeel.fr",
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
