const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Test the connection first
  await transporter.verify();
  console.log('Email server connected!');

  const mailOptions = {
    from: `"Movie Rater" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OTP for Movie Rater',
    html: `
      <h2>Your Verification Code</h2>
      <p>Enter this OTP to verify your account:</p>
      <h1 style="color: #e50914; letter-spacing: 8px">${otp}</h1>
      <p>This code expires in <strong>10 minutes</strong></p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;