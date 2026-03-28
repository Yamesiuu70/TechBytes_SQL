// testEmail.js
import transporter from './config/emailService.js';

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Failed:', error);
  } else {
    console.log('✅ SMTP Connection Successful, Ready to Send Emails!');
  }
});