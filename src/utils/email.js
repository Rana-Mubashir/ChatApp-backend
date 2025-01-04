import nodemailer from 'nodemailer'
import { config } from 'dotenv';
import e from 'express';

config()

async function sendEmail(email, emailVerificationCode, purpose, userId) {

    let subject, textContent, htmlContent
    const resetLink = `http://localhost:5173/resetpassword/${userId}`

    if (purpose === 'reset') {
        subject = "Reset Your Password";
        textContent = `We received a request to reset your password. Click the link below to proceed:\n\n${resetLink}`;
        htmlContent = `
            <h1>Reset Your Password</h1>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        `;
    }
    else {
        subject = "Welcome to ChatMate! Confirm Your Email";
        textContent = `Thank you for signing up with us. Your confirmation code is ${emailVerificationCode}.`;
        htmlContent = `
            <h1>Welcome to ChatMate!</h1>
            <p>Thank you for signing up with us. Please use the following code to verify your email:</p>
            <h2 style="color: #4CAF50;">${emailVerificationCode}</h2>
            <p>If you did not sign up for ChatMate, please ignore this email.</p>
        `;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
    };

    const emailSendRes = await transporter.sendMail(mailOptions)
    if (emailSendRes) {
        console.log('Email sent successfully:', emailSendRes);
        return true
    }
    else {
        console.error('Error sending email:');
        return false
    }

}

export default sendEmail