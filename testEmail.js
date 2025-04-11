const nodemailer = require('nodemailer');

// Set up nodemailer transporter to send an email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Can be changed if using other providers
  auth: {
    user: 'qpgeneratorbvrit@gmail.com', // Your Gmail account email
    pass: 'your-app-password', // Your Gmail app password (for Gmail accounts with 2FA enabled)
  },
});

// Set up mail options (what the email will contain)
const mailOptions = {
  from: 'qpgeneratorbvrit@gmail.com', // Sender's email
  to: 'your-email@example.com', // Replace with your email
  subject: 'Test Email from Nodemailer', // Subject of the email
  text: 'This is a test email to check if the email is sent correctly!', // Plain text content of the email
  html: '<p>This is a <strong>test email</strong> to check if the email is sent correctly!</p>', // HTML content
};

// Send the email
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('Error occurred:', error); // If there’s an error
  } else {
    console.log('Email sent: ' + info.response); // If email is sent successfully
  }
});
