import nodemailer from 'nodemailer';



export const sendResetEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
  await transporter.sendMail({
    to,
    subject: 'Reset Your Password',
    html: `<p>Click the link to reset your password: <a href="${link}">Reset Password</a></p>`
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
    to,
    subject: "Please verify your email",
    html: `<p>Click the link below to verify your email:</p>
    <a href="${link}">Verify Email</a>`,
  })
}