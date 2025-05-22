import express from "express"   
import passport from 'passport';
import { checkAuthstatus, LoginUser, logout, RegisterUser, resendVerificationCode, verifyemail } from "../controllers/Authcontroller.js"
import { Authmiddleware, preventAuthenticatedAccess, preventlogout } from "../middlewares/Authmiddleware.js";
import { JwtGenerator} from "../models/authmodel.js";
const router = express.Router();

router.post("/api/auth/register" ,preventAuthenticatedAccess ,  RegisterUser);  
router.post("/api/auth/login" , preventAuthenticatedAccess , LoginUser); 
router.post("/api/auth/logout" , preventlogout , logout);

// GitHub auth routes
router.get('/api/auth/github',
  preventAuthenticatedAccess,
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const token = JwtGenerator(req.user);
    req.session.user = req.user;
    
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production"
    });
    
    res.redirect(process.env.FE_URL);
  }
);

// Google auth routes
router.get('/api/auth/google',
  preventAuthenticatedAccess,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = JwtGenerator(req.user);
    req.session.user = req.user;
    
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production"
    });
    
    res.redirect(process.env.FE_URL);
  }
);



// verify auth 

router.get("/api/auth/verify", Authmiddleware, async (req, res) => {
  try {
    if (req.session.user) {
      return res.status(200).json({
        success: true,
        user: req.session.user
      });
    }
    res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}); 

router.post("/api/auth/verify-email", verifyemail);
router.post("/api/auth/CheckAuthStatus", Authmiddleware , checkAuthstatus);
router.post("/api/auth/resendVerificationEmail", Authmiddleware , resendVerificationCode);

export const Authroutes = router;

