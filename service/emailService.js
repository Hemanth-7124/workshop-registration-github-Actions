
import nodemailer from 'nodemailer';

// ✅ Create transporter correctly
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.NUXT_SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || process.env.NUXT_SMTP_PORT) || 587,
    secure: false, // true for port 465
    auth: {
      user: process.env.SMTP_USER || process.env.NUXT_SMTP_USER,
      pass: process.env.SMTP_PASS || process.env.NUXT_SMTP_PASS
    }
  });
};

// ✅ Generate Thank You Email HTML
const generateThankYouEmail = ({ student_name, workshop_name, mode }) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Workshop Registration Confirmation</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
      .content {
        background: #f9f9f9;
        padding: 30px;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .workshop-details {
        background: white;
        padding: 20px;
        border-left: 4px solid #667eea;
        margin: 20px 0;
        border-radius: 5px;
      }
      .detail-item {
        margin: 10px 0;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .detail-item:last-child {
        border-bottom: none;
      }
      .detail-label {
        font-weight: bold;
        color: #555;
        display: inline-block;
        min-width: 120px;
      }
      .mode-badge {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
      }
      .mode-online {
        background-color: #e8f5e8;
        color: #2d5a2d;
      }
      .mode-offline {
        background-color: #fff3cd;
        color: #856404;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        color: #666;
        font-size: 14px;
      }
      .welcome-text {
        font-size: 18px;
        margin-bottom: 20px;
        color: #444;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🎓 Workshop Registration Confirmed!</h1>
      <p>Thank you for registering with us</p>
    </div>

    <div class="content">
      <p class="welcome-text">
        Dear <strong>${student_name}</strong>,
      </p>

      <p>
        We're excited to confirm your registration for the workshop. Your spot has been successfully reserved, and we look forward to seeing you there!
      </p>

      <div class="workshop-details">
        <h3>📋 Registration Details</h3>
        <div class="detail-item">
          <span class="detail-label">Workshop:</span>
          <span>${workshop_name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Mode:</span>
          <span class="mode-badge mode-${mode.toLowerCase()}">${mode}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Student Name:</span>
          <span>${student_name}</span>
        </div>
      </div>

      <p>
        <strong>Next Steps:</strong><br>
        ${
          mode === 'Online'
            ? 'You will receive a separate email with the meeting link and access instructions 24 hours before the workshop.'
            : 'Please arrive at the venue 15 minutes before the scheduled start time. The exact location details will be sent to you via email.'
        }
      </p>

      <p>If you have any questions or need to make changes, please contact our support team.</p>

      <p>Best regards,<br>The Workshop Registration Team</p>
    </div>

    <div class="footer">
      <p>This email was sent as part of the workshop registration process.</p>
      <p>© 2025 Workshop Registration System. All rights reserved.</p>
    </div>
  </body>
  </html>
`;

// ✅ Send thank-you email
export async function sendThankYouEmail(registration) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.FROM_NAME || process.env.NUXT_FROM_NAME || 'Workshop Registration System'}" <${process.env.FROM_EMAIL || process.env.NUXT_FROM_EMAIL}>`,
      to: registration.student_email,
      subject: `Workshop Registration Confirmation - ${registration.workshop_name}`,
      html: generateThankYouEmail(registration),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Thank you email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    console.error('❌ Error sending thank you email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// ✅ Test email configuration (optional route)
export async function testEmailConfiguration() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return false;
  }
}

export default {
  sendThankYouEmail,
  testEmailConfiguration,
};
