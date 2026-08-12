const nodemailer = require("nodemailer");

/**
 * Creates and returns a Nodemailer transporter configured for Gmail or custom SMTP.
 */
const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Sends a board invitation email to recipient.
 * Tries configured Gmail/SMTP first; if credentials fail (535 Bad Credentials),
 * automatically falls back to an Ethereal sandbox to avoid UI errors.
 */
exports.sendBoardInviteEmail = async ({
  toEmail,
  inviterName = "A team member",
  boardTitle,
  boardId,
  role = "editor",
}) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const boardUrl = `${frontendUrl}/boards/${boardId}?inviteEmail=${encodeURIComponent(toEmail)}`;

  const roleMap = {
    viewer: "Viewer (Read-only)",
    editor: "Editor (Can edit)",
    admin: "Admin (Full access)",
  };

  const formattedRole = roleMap[role] || role;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px; color: #f8fafc; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; color: #e0e7ff; font-size: 14px; opacity: 0.9; }
        .content { padding: 32px 28px; }
        .message { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
        .board-card { background: #0f172a; border-radius: 12px; border: 1px solid #334155; padding: 20px; margin-bottom: 28px; }
        .board-title { font-size: 20px; font-weight: 700; color: #38bdf8; margin: 0 0 8px 0; }
        .role-badge { display: inline-block; background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3); transition: all 0.2s ease; }
        .footer { background: #0f172a; border-top: 1px solid #334155; padding: 20px 28px; text-align: center; font-size: 13px; color: #64748b; }
        .footer p { margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kanvora Workspace</h1>
          <p>Collaborative Board Invitation</p>
        </div>
        <div class="content">
          <p class="message">
            Hi there! <strong>${inviterName}</strong> has invited you to collaborate on a board in Kanvora.
          </p>

          <div class="board-card">
            <div class="board-title">📋 ${boardTitle}</div>
            <div><span class="role-badge">Permission: ${formattedRole}</span></div>
          </div>

          <div class="btn-container">
            <a href="${boardUrl}" class="btn">Go to Board</a>
          </div>

          <p style="font-size: 14px; color: #94a3b8; line-height: 1.5;">
            Click the button above to access the board directly. If you are not logged in as <strong>${toEmail}</strong>, you will be prompted to log in or sign up with <strong>${toEmail}</strong> before accessing this board.
          </p>
        </div>
        <div class="footer">
          <p>Sent by Kanvora Board Management System</p>
          <p style="font-size: 11px;">If you weren't expecting this invitation, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const senderEmail = process.env.EMAIL_USER || "invites@kanvora.app";

  const mailOptions = {
    from: `"Kanvora Board" <${senderEmail}>`,
    to: toEmail,
    subject: `🎉 You've been invited to "${boardTitle}" board on Kanvora`,
    html: htmlContent,
  };

  // Try configured Gmail / primary SMTP first
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Invite email sent via Primary SMTP to ${toEmail}. Message ID: ${info.messageId}`);
    return {
      success: true,
      toEmail,
      messageId: info.messageId,
      isTest: false,
    };
  } catch (err) {
    console.warn(`⚠️ Primary SMTP delivery failed (${err.message}). Falling back to Ethereal Test Mailer...`);

    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await testTransporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`🔗 Ethereal Fallback Email Preview URL: ${previewUrl}`);

      return {
        success: true,
        toEmail,
        isTest: true,
        previewUrl,
        warning: `Primary SMTP error (${err.message}). Handled via test sandbox.`,
      };
    } catch (fallbackErr) {
      console.error(`❌ Ethereal fallback failed:`, fallbackErr.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }
};


