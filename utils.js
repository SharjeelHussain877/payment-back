import emailTemplate from './email.template.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config()

const domainEmail = process.env.EMAIL
const password = process.env.PASSWORD
const domainPort = process.env.DOMAIN_PORT

const subject = 'Z design Logo'

const emailConfig = {
  host: 'mail.trademark-gov.us',
  port: domainPort,
  auth: {
    user: domainEmail,
    pass: password,
  },
};


async function sendEmail(prop = { customerEmail: 'sharjeelhussain877@gmail.com', customerName: "Sharjeel", message: "hello world" }) {
  const { customerEmail, customerName, message } = prop;

  const template = emailTemplate({ name: customerName, email: customerEmail, message })

  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: '"Trademark Gov" <info@trademark-gov.us>',
      to: customerEmail,
      subject: subject,
      text: template,
    };

    const info = await transporter.sendMail(mailOptions);

    return { info, success: true };
  } catch (error) {
    console.error('Error sending email:', error); // More detailed error logging
    return { error: error.message || 'Unknown error', success: false };
  }
}





export { sendEmail }