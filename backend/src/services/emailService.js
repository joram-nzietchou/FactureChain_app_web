const nodemailer = require('nodemailer');
require('dotenv').config();

// Désactiver complètement l'envoi d'emails en développement
const EMAIL_ENABLED = process.env.NODE_ENV === 'production';

// Simuler l'envoi d'email sans vraiment envoyer
const mockSendEmail = async (to, subject, html) => {
  console.log('📧 [MOCK EMAIL] - Envoi simulé (mode développement)');
  console.log(`   À: ${to}`);
  console.log(`   Sujet: ${subject}`);
  console.log(`   Contenu: ${html.substring(0, 100)}...`);
  return { messageId: 'mock-' + Date.now() };
};

// Configurer le vrai transporteur uniquement si nécessaire
let transporter = null;
if (EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.API_URL}/api/auth/verify/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a344;">FactureChain</h1>
      <p>Bienvenue ! Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
      <a href="${verificationUrl}" style="background: #16a344; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Vérifier mon email</a>
      <p style="margin-top: 20px;">Ce lien expire dans 24 heures.</p>
    </div>
  `;
  
  if (EMAIL_ENABLED && transporter) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'FactureChain - Vérifiez votre email',
      html
    };
    return transporter.sendMail(mailOptions);
  } else {
    // Mode développement : simuler l'envoi
    return mockSendEmail(email, 'FactureChain - Vérifiez votre email', html);
  }
};

exports.sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a344;">FactureChain</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <a href="${resetUrl}" style="background: #16a344; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Réinitialiser mon mot de passe</a>
      <p style="margin-top: 20px;">Ce lien expire dans 1 heure.</p>
    </div>
  `;
  
  if (EMAIL_ENABLED && transporter) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'FactureChain - Réinitialisation de votre mot de passe',
      html
    };
    return transporter.sendMail(mailOptions);
  } else {
    return mockSendEmail(email, 'FactureChain - Réinitialisation de votre mot de passe', html);
  }
};