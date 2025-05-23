import { CreateUser, forgotPassword, JwtGenerator, Login, resendVerificationEmail, resetPassword, verifyResetToken, verifyUser } from "../models/authmodel.js";
import dotenv from "dotenv" 
dotenv.config(); 


const isProduction = process.env.NODE_ENV === "production";

const getCookieConfig = (maxAge = 60 * 60 * 1000) => {
  return {
    httpOnly: true,
    maxAge: maxAge, // Defaults to 1 hour
    sameSite: isProduction ? 'none' : 'lax', // 'none' in production, 'lax' in development
    secure: isProduction, // true in production, false in development
    path: '/'
  };
};

export const RegisterUser = async (req, res) => { 
    try { 
        const {email, password, username} = req.body; 
        const user = await CreateUser(username, email, password);
        if(!user) { 
            throw new Error("Error while Registring User"); 
        } 

        // Only store minimal info for unverified users
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            verified: false
        };
        
        req.session.user = safeUser;
        const token = JwtGenerator(safeUser);
        res.cookie("token", token, getCookieConfig());
        
        res.status(200).json({
            success: true,
            message: "Please check your email for verification code", 
            user: safeUser // Only send safe user data
        });
    } catch(err){ 
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const LoginUser = async (req, res) => {  
    try { 
        const {email, password} = req.body;  
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await Login(email, password);

        if(!user) { 
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            verified: user.verified
        };
        
        req.session.user = safeUser;
        const token = JwtGenerator(safeUser);
        res.cookie("token", token, getCookieConfig());

        res.status(200).json({
            success: true,
            message: "user logged in successfully", 
            user: safeUser
        });
    } catch (error) { 
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const logout = async (req, res) => { 
    try {
        req.session.destroy(err => {
            if(err) {
                throw new Error(err); 
            }
        }); 
        
        // Clear cookies with environment-appropriate settings
        res.clearCookie("token", {
            path: '/',
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        });
        
        res.clearCookie("sessionId", {
            path: '/',
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        });

        res.status(200).json({
            success: true,
            message: "user logged out successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    } 
}

export const verifyemail = async (req, res) => {
    try {
        const {code} = req.body;
        const email = req.session.user.email;

        const result = await verifyUser(email, code);
        
        if(result.success === false) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
        // Update session with verified user info   
        const safeUser = {
            id: req.session.user.id,
            email: req.session.user.email,
            username: req.session.user.username,
            verified: true
        };

        req.session.user = safeUser;
        const token = JwtGenerator(safeUser);
        res.cookie("token", token, getCookieConfig());

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: safeUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const checkAuthstatus = async (req , res) => { 
    try {
        if(!req.session.user) {
            return res.status(401).json({
                success: false,
                message: "User not logged in"
            });
        }
        const user = req.session.user;
        res.status(200).json({
            success: true,
            message: "User is logged in",
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const resendVerificationCode = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.status(401).json({
                success: false,
                message: "User not found or not authenticated"
            });
        }

        const email = req.session.user.email;
        
        
        const result = await resendVerificationEmail(email);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message || "Failed to resend verification code"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Verification code sent successfully"
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to resend verification code"
        });
    }
};

export const sendPasswordResetCode = async (req, res) => {  
    try{ 
        const {email} = req.body;
        if(!email) { 
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        const result = await forgotPassword(email);
        if(!result.success) { 
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
        res.status(200).json({
            success: true,
            message: "Password reset code sent to your email"
        });
    } catch(err){ 
        res.status(400).json({
            success: false,
            message: err.message
        });

    }
} 


export const passwordReset = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const iscodeValid = await verifyResetToken(email , code); 
        if (!iscodeValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired code"
            });
        }
        const result = await resetPassword(email , newPassword);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
} 