import bcrypt from "bcrypt";
import dotenv from "dotenv"; 
import { Database } from "../config/db/db.js";
import jwt from "jsonwebtoken"
import crypto from 'crypto';
import sendEmail from '../middlewares/Emailconfig.js';

dotenv.config(); 

export async function FindUserByEmail(email){ 
   if(!email) {
    throw new Error("Email is required");   
   }
   try { 
    const response = await Database.query("select * from users where email = $1" , [email]);    
    
    // Check if user exists
    if (!response.rows[0]) {
      return null;
    }

    // Only delete password if user exists
    delete response.rows[0].password;
    return response.rows[0];
   } catch (error) { 
    throw new Error(error.message || 'Database error'); 
   }
}

export const JwtGenerator = (user) => {
    const payload = {
        user : {
            id : user.id,
            email : user.email,
            username: user.username,
            verified: user.verified
        }
    }
    return jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : "1h"})
}

const generateVerificationCode = () => {
    
    const buffer = crypto.randomBytes(3);
    
    const number = buffer.readUIntBE(0, 3) % 900000 + 100000;
    return number.toString();
};

export const CreateUser = async (username, email, password , verified = false) => {
       if(!password || !email || !username) {
        throw new Error("All fields are required");
       }
       try{ 
        const salt = Number(process.env.Salt_Rounds); 
        const hashedPassword = bcrypt.hashSync(password, salt);
         
        const verificationCode = verified ? null : generateVerificationCode();

        const response = await Database.query(
            "INSERT INTO users (username, email, password, verified, verification_code) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, verified",
            [username, email, hashedPassword, verified, verificationCode]
        );

        const newUser = response.rows[0];

        const emailText = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
        }
        .header {
            background: linear-gradient(to right, #9333EA, #DB2777);
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
        }
        .verification-code {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
            color: #9333EA;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(to right, #9333EA, #DB2777);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to EarnBug</h1>
        </div>
        <div class="content">
            <p>Dear ${username},</p>
            
            <p>Welcome to EarnBug! We're excited to have you on board.</p>
            
            <p>To complete your registration, please use the verification code below:</p>
            
            <div class="verification-code">
                ${verificationCode}
            </div>
            
            <p>Kindly verify your account to unlock all the features we offer.</p>
            
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>The EarnBug Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;


        await verified ? null : sendEmail(email, "Verify Your EarnBug Account", emailText);
        return newUser;
       
    } catch(err){ 
        if (err.code === '23505') { // Unique violation error code
            throw new Error("Email already exists");
        }
        throw new Error(`User creation failed: ${err.message}`); 
    }
}


export const Login = async(email, password) => { 
    if(!email || !password) {     
        throw new Error("All fields are required");  
    } 
    try { 
        // Get full user data including password
        const result = await Database.query(
            "SELECT id, email, username, password, verified FROM users WHERE email = $1",
            [email]
        );

        if (!result.rows[0]) {
            throw new Error("User does not exist");
        }

        const user = result.rows[0];

        // Check password before verification check
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
        }

        // if (!user.verified) {
        //     throw new Error("Please verify your email before logging in");
        // }

        delete user.password;
        return user;
    } catch (error) { 
        throw new Error(error.message); 
    } 
}


export const getUserInfo = async (user_id) => { 
    try { 
       const response = await Database.query("select * from users where id = $1" , [user_id]); 
        delete response.rows[0].password ;

        
       return response.rows[0];
    } catch (error) { 
        throw new Error(error); 
    }
}

export const verifyUser = async (email, code) => {
    try {
        const result = await Database.query(
            "SELECT verification_code, verified, username FROM users WHERE email = $1",
            [email]
        );

        if (!result.rows[0]) {
            throw new Error("User not found");
        }

        const user = result.rows[0];

        if (user.verified) {
            return { success: false, message: "User already verified" };
        }

        if (user.verification_code !== code) {
            return { success: false, message: "Invalid verification code" };
        }

        const updateResult = await Database.query(
            "UPDATE users SET verified = true, verification_code = null WHERE email = $1 RETURNING id, username, email, verified",
            [email]
        );

        if (!updateResult.rows[0]) {
            throw new Error("Failed to update user verification status");
        }

        return { 
            success: true, 
            message: "Email verified successfully",
            user: updateResult.rows[0]
        };
    } catch (error) {
        // Handle error without trying to stringify circular structures
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(`Verification failed: ${errorMessage}`);
    }
}

export const resendVerificationEmail = async (email) => {
    try {
        const user = await FindUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.verified) {
            return { success: false, message: "User already verified" };
        }

        const verificationCode = generateVerificationCode();
        await Database.query(
            "UPDATE users SET verification_code = $1 WHERE email = $2",
            [verificationCode, email]
        );

      
const emailText = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
        }
        .header {
            background: linear-gradient(to right, #9333EA, #DB2777);
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
        }
        .verification-code {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
            color: #9333EA;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(to right, #9333EA, #DB2777);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to EarnBug</h1>
        </div>
        <div class="content">
            <p>Dear ${user.username},</p>
            
            <p>Welcome to EarnBug! We're excited to have you on board.</p>
            
            <p>To complete your registration, please use the verification code below:</p>
            
            <div class="verification-code">
                ${verificationCode}
            </div>
            
            <p>Kindly verify your account to unlock all the features we offer.</p>
            
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>The EarnBug Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;


        await sendEmail(email, "Verify Your EarnBug Account", emailText);

        return { success: true, message: "Verification email resent successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}

export const forgotPassword = async (email) => { 
    try {
        const user = await FindUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        const resetToken = generateVerificationCode();
        await Database.query(
            "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
            [resetToken, Date.now() + 3600000, email]
        );

        const emailText = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
        }
        .header {
            background: linear-gradient(to right, #9333EA, #DB2777);
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
        }
        .reset-code {
            background-color: #f3f4f6;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
            color: #9333EA;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(to right, #9333EA, #DB2777);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>  
        <div class="content">
            <p>Dear ${user.username},</p>
            
            <p>We received a request to reset your password. Please use the code below to reset your password:</p>
            
            <div class="reset-code">
                ${resetToken}
            </div>
            <p>This code is valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The EarnBug Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;
        await sendEmail(email, "Reset Your EarnBug Password", emailText);
        return { success: true, message: "Password reset email sent successfully" };
    }
    catch (error) {
        throw new Error(error.message);
    }
}


export const verifyResetToken = async (email, token) => { 
    try {
        const user = await FindUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.reset_token !== token) {
            throw new Error("Invalid reset token");
        }
        if (Date.now() > user.reset_token_expiry) {
            throw new Error("Reset token has expired");
        }
        return { success: true, message: "Reset token is valid" };
    } catch (error) {
        throw new Error(error.message);
    }
}

export const resetPassword = async (email, newPassword) => { 
    try {
        const user = await FindUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        const salt = Number(process.env.Salt_Rounds); 
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        await Database.query(
            "UPDATE users SET password = $1, reset_token = null, reset_token_expiry = null WHERE email = $2",
            [hashedPassword, email]
        );

        return { success: true, message: "Password reset successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
} 