import sendEmailFun from './utils/sendEmailFun.js'; 
// তোমার path অনুযায়ী ঠিক করো

const runTest = async () => {
  try {
    await sendEmailFun({
      to: "danialhossain2023@gmail.com",  // নিজের email দাও
      subject: "Test Email from Node.js",
      html: "<h2>Hello 👋</h2><p>This is a test email.</p>"
    });

    console.log("✅ Test email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
  }
};

runTest();