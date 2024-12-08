const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(mailOPtions) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: mailOPtions.from, // sender address
    to: mailOPtions.to, // list of receivers
    subject: mailOPtions.subject, // Subject line
    text: mailOPtions.text, // plain text body
    html: mailOPtions.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = sendMail
