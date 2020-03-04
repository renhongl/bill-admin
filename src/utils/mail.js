const nodemailer = require("nodemailer");

const { MAIL_SERVER, MAIL_PASS } = require('../config/email.config');

// async..await is not allowed in global scope, must use a wrapper
async function send({ from, to, text, subject, html }) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: MAIL_SERVER, // generated ethereal user
            pass: MAIL_PASS // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: from || MAIL_SERVER, // sender address
        to: to || "1075220132@qq.com", // list of receivers
        subject: subject || "Hello ✔", // Subject line
        // text: text || "Hello world?", // plain text body
        html: html || "<b>Hello world?</b>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

function getHtml(userName, code) {
    return `Hello <b>${userName}</b>,<br/>you are trying to regist an account for bill management system. <br/>
    you verify code is: <b style="color: red">${code}</b>, please verify it in 30 minutes.`;
}

module.exports = {
    send,
    getHtml,
}