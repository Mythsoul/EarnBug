import { CreateUser, JwtGenerator, Login } from "../models/authmodel.js";
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
        req.session.user = user; 
        const token = JwtGenerator(user);
        res.cookie("token", token, getCookieConfig());
        res.status(200).json({
            success: true,
            message: "user registered successfully", 
            user: user
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
        req.session.user = user; 
        const token = JwtGenerator(user);
        res.cookie("token", token, getCookieConfig());
    
        res.status(200).json({
            success: true,
            message: "user logged in successfully", 
            user: user
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