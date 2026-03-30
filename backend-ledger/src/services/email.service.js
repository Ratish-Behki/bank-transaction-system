
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank Transaction System" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    try {
        const subject = 'Welcome to Bank Transaction System!';
        const text = `Hello ${name},\n\nWelcome to our Bank Transaction System! Your account has been successfully created.\n\nYou can now log in and start managing your transactions.\n\nBest regards,\nBank Transaction System Team`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to Bank Transaction System!</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Welcome to our Bank Transaction System! Your account has been successfully created.</p>
                <p>You can now log in and start managing your transactions.</p>
                <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Log in to your account</li>
                        <li>View your account details</li>
                        <li>Start making transactions</li>
                    </ul>
                </div>
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                <p>Best regards,<br>Bank Transaction System Team</p>
            </div>
        `;

        await sendEmail(userEmail, subject, text, html);
        console.log(`Registration email sent successfully to ${userEmail}`);
    } catch (error) {
        console.error('Error sending registration email:', error);
        // Don't re-throw, just log - email failure shouldn't crash the app
    }
}

async function sendTransactionEmail(userEmail, name, amount, fromAccount, toAccount, transactionId) {
    try {
        const subject = 'Transaction Successful - Bank Transaction System';
        const text = `Hello ${name},\n\nYour transaction has been successfully processed.\n\nTransaction Details:\n- Amount: ${amount}\n- From Account: ${fromAccount}\n- To Account: ${toAccount}\n- Transaction ID: ${transactionId}\n\nBest regards,\nBank Transaction System Team`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Transaction Successful</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your transaction has been successfully processed.</p>
                <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                    <p><strong>Transaction Details:</strong></p>
                    <ul>
                        <li><strong>Amount:</strong> ${amount}</li>
                        <li><strong>From Account:</strong> ${fromAccount}</li>
                        <li><strong>To Account:</strong> ${toAccount}</li>
                        <li><strong>Transaction ID:</strong> ${transactionId}</li>
                    </ul>
                </div>
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                <p>Best regards,<br>Bank Transaction System Team</p>
            </div>
        `;

        await sendEmail(userEmail, subject, text, html);
        console.log(`Transaction email sent successfully to ${userEmail}`);
    } catch (error) {
        console.error('Error sending transaction email:', error);
        // Don't re-throw, just log - email failure shouldn't crash the app
    }
}

async function sendTransactionFailureEmail(userEmail, name, amount, fromAccount, toAccount, reason) {
    try {
        const subject = 'Transaction Failed - Bank Transaction System';
        const text = `Hello ${name},\n\nUnfortunately, your transaction could not be processed.\n\nTransaction Details:\n- Amount: ${amount}\n- From Account: ${fromAccount}\n- To Account: ${toAccount}\n- Reason: ${reason}\n\nPlease try again or contact support if the issue persists.\n\nBest regards,\nBank Transaction System Team`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Transaction Failed</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Unfortunately, your transaction could not be processed.</p>
                <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
                    <p><strong>Transaction Details:</strong></p>
                    <ul>
                        <li><strong>Amount:</strong> ${amount}</li>
                        <li><strong>From Account:</strong> ${fromAccount}</li>
                        <li><strong>To Account:</strong> ${toAccount}</li>
                        <li><strong>Reason:</strong> ${reason}</li>
                    </ul>
                </div>
                <p>Please try again or contact support if the issue persists.</p>
                <p>Best regards,<br>Bank Transaction System Team</p>
            </div>
        `;

        await sendEmail(userEmail, subject, text, html);
        console.log(`Transaction failure email sent successfully to ${userEmail}`);
    } catch (error) {
        console.error('Error sending transaction failure email:', error);
        // Don't re-throw, just log - email failure shouldn't crash the app
    }
}

module.exports = { transporter, sendEmail, sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail };