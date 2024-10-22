import nodemailer from 'nodemailer'
import emailTemplate from './email.template.js';

const domainEmail = process.env.EMAIL
const password = process.env.PASSWORD
const domainPort = process.env.DOMAIN_PORT

const subject = 'Z design Logo'

const emailConfig = {
  host: 'mail.trademark-gov.us', // Your SMTP server
  port: process.env.DOMAIN_PORT, // Usually 587 for TLS
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD, // Your email password
  },
};


async function sendEmail(prop = { customerEmail: 'touseefabid47@gmail.com', customerName: "Sharjeel", message: "hello world" }) {
  const { customerEmail, customerName, message } = prop;

  try {
    const transporter = nodemailer.createTransport({
      ...emailConfig,
      logger: true, // Log information about the transport
      debug: true, // Include debug output
    });

    const mailOptions = {
      from: '"Trademark Gov" <info@trademark-gov.us>',
      to: "touseefabid47@gmail.com",
      subject: subject,
      text: emailTemplate({ name: customerName, email: customerEmail, message: message }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info); // Log the info object for more details
    return { info, success: true };
  } catch (error) {
    console.error('Error sending email:', error); // More detailed error logging
    return { error: error.message || 'Unknown error', success: false };
  }
}





export { sendEmail }