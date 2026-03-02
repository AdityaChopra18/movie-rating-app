const { Resend } = require('resend');

const sendEmail = async (toEmail, otp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'MovieRater <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Your OTP for MovieRater',
    html: `
      <h2>Your Verification Code</h2>
      <p>Enter this OTP to verify your account:</p>
      <h1 style="color: #e50914; letter-spacing: 8px">${otp}</h1>
      <p>This code expires in <strong>10 minutes</strong></p>
    `
  });
};

module.exports = sendEmail;