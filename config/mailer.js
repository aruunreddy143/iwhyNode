const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secureConnection: false,
    port: 587,
    auth: {
        user: "arun.reddy143@gmail.com",
        pass: "arun1234"
    }

});
module.exports = transporter;