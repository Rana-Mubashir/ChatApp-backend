import nodemailer from 'nodemailer'
import { config } from 'dotenv';

config()

async function sendEmail(email, emailVerificationCode) {
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
        subject: 'Welcome to ChatMate! Confirm Your Email',
        text: `Thank you for signing up with us. Your confirmation code is ${emailVerificationCode}.`,
        html: `
            <h1>Welcome to ChatMate!</h1>
            <p>Thank you for signing up with us. Please use the following code to verify your email:</p>
            <h2 style="color: #4CAF50;">${emailVerificationCode}</h2>
            <p>If you did not sign up for ChatMate, please ignore this email.</p>
        `,
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

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.error('Error sending email:', error);
    //         return false
    //     } else {
    //         console.log('Email sent successfully:', info.response);
    //         return true
    //     }
    // });

}

export default sendEmail