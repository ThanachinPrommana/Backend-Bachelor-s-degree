import nodemailer from 'nodemailer';
import { getVerifyEmailHtml } from '../Sendemail/emailTemplate.js';
import { createResetPasswordTemplate } from '../Sendemail/createResetPasswordTemplate.js';



export const sendResetEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'คำขอรีเซ็ตรหัสผ่าน (Yuu Yenn Property)',
    html:createResetPasswordTemplate(link)
  });
};

export const verifyemail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Please verify your email",
    html:getVerifyEmailHtml(link)
  })
}