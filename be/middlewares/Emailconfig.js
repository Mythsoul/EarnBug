import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD, 
            },
        });

        const mailOptions = {
            from: { 
                name: 'EarnBug Team',
                address: process.env.GMAIL_USER 
            },
            to,
            subject,
                html: text, 
            contentType: 'text/html' 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export default sendEmail;

