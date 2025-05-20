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
    delete response.rows[0].password ; 

    return response.rows[0];
   } catch (error) { 
    throw new Error(error); 
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

export const CreateUser = async (username, email, password) => {
       if(!password || !email || !username) {
        throw new Error("All fields are required");
       }
       try{ 
        const salt = Number(process.env.Salt_Rounds) ; 
        const hashedPassword = bcrypt.hashSync(password , salt);
        // Validate email format

        
        const verified = false ; 
        const verificationCode = generateVerificationCode();
        const response = await Database.query(
            "INSERT INTO users (username, email, password, verified, verification_code) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, verified",
            [username, email, hashedPassword, verified, verificationCode]
        );

        // Send verification email
        const emailText = `Welcome to EarnBug!\nYour verification code is: ${verificationCode}\nPlease verify your account to continue.`;
        await sendEmail(email, "Verify Your EarnBug Account", emailText);

        return response.rows[0]; 
       
    }catch(err){ 
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