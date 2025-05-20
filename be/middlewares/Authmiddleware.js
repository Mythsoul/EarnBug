import jwt from "jsonwebtoken"
import { JwtGenerator } from "../models/authmodel.js";

export const Authmiddleware = (req, res, next) => {
    const token = req.cookies.token;

    // Case 1: No token and no session
    if (!token && !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    // Case 2: Session exists but no token
    if (req.session.user && !token) {
        const token = JwtGenerator(req.session.user);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: "none", // fixed typo in sameSite
            secure: process.env.NODE_ENV === "production",
        });
        return next();
    }

    // Case 3: Token exists but no session
    if (token && !req.session.user) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                res.clearCookie("token");
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            req.session.user = decoded.user;
            return next();
        } catch (error) {
            res.clearCookie("token");
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
    }

    // Case 4: Both token and session exist
    return next();
}

export const preventAuthenticatedAccess = (req, res, next) => {
    const token = req.cookies.token;

    // If user has either a valid session or token, they shouldn't access auth routes
    if (token || req.session.user) {
        return res.status(403).json({
            success: false,
            message: "Already authenticated. Please logout first."
        });
    }

    // If user is not authenticated, allow them to proceed to auth routes
    return next();
};

export const preventlogout = (req, res, next) => {
    const token = req.cookies.token;

    // Check if user is authenticated (has token or session)
    if (!token && !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "You must be logged in to access this route"
        });
    }

    // Allow access to logout route if authenticated
    return next();
};