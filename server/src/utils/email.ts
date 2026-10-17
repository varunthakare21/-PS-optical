import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const createTransporter = () => {
  if (!process.env.EMAIL_HOST) {
    console.warn('[Email] Email service not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env');
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email] SIMULATED: To: ${options.to} | Subject: ${options.subject}`);
    return true;
  }
  try {
    await transporter.sendMail({
      from: `"PS OPTICAL" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('[Email] Send failed:', error);
    return false;
  }
};

export const emailTemplates = {
  verification: (name: string, link: string) => `
    <!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#F6F1E8;padding:40px;">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:40px;">
      <h2 style="color:#30251F;font-family:Georgia,serif;">Welcome to PS OPTICAL, ${name}!</h2>
      <p style="color:#4A3A33;">Please verify your email address to activate your account.</p>
      <a href="${link}" style="display:inline-block;background:#B65E43;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:20px 0;">Verify Email</a>
      <p style="color:#A89C8C;font-size:13px;">This link expires in 24 hours. If you did not create this account, please ignore this email.</p>
    </div></body></html>
  `,
  resetPassword: (name: string, link: string, role: string) => `
    <!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#F6F1E8;padding:40px;">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:40px;">
      <h2 style="color:#30251F;font-family:Georgia,serif;">Password Reset — PS OPTICAL</h2>
      <p style="color:#4A3A33;">Hello ${name}, we received a request to reset your ${role} account password.</p>
      <a href="${link}" style="display:inline-block;background:#B65E43;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:20px 0;">Reset Password</a>
      <p style="color:#A89C8C;font-size:13px;">This link expires in 1 hour and can only be used once. If you did not request this, please ignore this email. Do not share this link with anyone.</p>
    </div></body></html>
  `,
  orderConfirmation: (name: string, orderNumber: string, total: number) => `
    <!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#F6F1E8;padding:40px;">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:40px;">
      <h2 style="color:#30251F;font-family:Georgia,serif;">Order Confirmed — PS OPTICAL</h2>
      <p style="color:#4A3A33;">Thank you, ${name}! Your order has been confirmed.</p>
      <div style="background:#F6F1E8;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="margin:0;color:#30251F;"><strong>Order #:</strong> ${orderNumber}</p>
        <p style="margin:8px 0 0;color:#30251F;"><strong>Total:</strong> ₹${total.toFixed(2)}</p>
      </div>
      <p style="color:#A89C8C;font-size:13px;">You can track your order in your customer dashboard.</p>
    </div></body></html>
  `,
};
