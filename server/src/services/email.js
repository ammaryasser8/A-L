import nodemailer from 'nodemailer';

let transporter;
export function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}
function getTransporter() {
  if (!emailConfigured()) return null;
  transporter ??= nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_PORT === '465', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  return transporter;
}
export async function sendEmail({ to, subject, text }) {
  const transport = getTransporter();
  if (!transport) return { delivered: false, skipped: true };
  try { await transport.sendMail({ from: process.env.SMTP_FROM, to, subject, text }); return { delivered: true }; }
  catch (error) { console.warn('Email delivery failed:', error.message); return { delivered: false, error: error.message }; }
}
