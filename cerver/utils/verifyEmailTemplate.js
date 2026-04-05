const VerificationEmail = (name, otp) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Email Verification</title>
      </head>
      <body>
          <p>Hello ${name},</p>
          <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
          <h2>${otp}</h2>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,</p>
          <p>Your Application Team</p>
      </body>
      </html>
    `;
  };
  
  export default VerificationEmail;