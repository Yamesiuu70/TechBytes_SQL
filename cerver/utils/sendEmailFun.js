import transporter from "../config/emailService.js";

const sendEmailFun = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `TechBytes Support <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

export default sendEmailFun;