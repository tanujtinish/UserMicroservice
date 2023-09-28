const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const nodemailer = require('nodemailer');

const two_factor_admin_email = process.env.TWO_FACTOR_ADMIN_EMAIL
const two_factor_admin_email_password = process.env.TWO_FACTOR_ADMIN_EMAIL_PASSWORD

// Create a nodemailer transporter
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: two_factor_admin_email,
        pass: two_factor_admin_email_password
    }
};
module.exports = nodemailer.createTransport(smtpConfig);
