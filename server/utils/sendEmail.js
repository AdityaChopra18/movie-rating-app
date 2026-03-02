const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    // service: 'gmail', // Adding this helps Nodemailer auto-configure correct settings
    host: 'stm-relay.brevo.com',
    port: 587,        // Changed from 465
    secure: false,    // Must be false for port 587 (uses STARTTLS)
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS
    },
    tls: {
      // This forces the connection even if there are certificate/IPv6 resolution issues
      rejectUnauthorized: false
    },
    family: 4 // Force IPv4, can help with some network issues
  });

  // Keep the verify block, it's great for debugging!
  try {
    await transporter.verify();
    console.log('Email server connected!');

    const mailOptions = {
      from: `"Movie Rater" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your OTP for Movie Rater',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Your Verification Code</h2>
          <p>Enter this OTP to verify your account:</p>
          <h1 style="color: #e50914; letter-spacing: 8px">${otp}</h1>
          <p>This code expires in <strong>10 minutes</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error; // Re-throw so your controller knows the email failed
  }
};

module.exports = sendEmail;