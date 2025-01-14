import { SMTP } from '../constants/index.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: SMTP.SMTP_HOST,
  port: Number(SMTP.SMTP_PORT),
  auth: {
    user: SMTP.SMTP_USER,
    pass: SMTP.SMTP_PASSWORD,
  },
});

export const sendMail = async (options) => {
  return await transporter.sendMail(options);
};
