const nodemailer = require('nodemailer');

//Cấu hình thông tin mail gốc để gửi
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mail.demo@gmail.com',
        pass: 'app password',
    },
});

module.exports = { transporter };