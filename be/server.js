import express from "express" 
import { Database } from "./config/db/db.js";
import cors from "cors"; 
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { Authroutes } from "./routes /authroutes.js";
import cookieParser from "cookie-parser";
import { setupPassport } from './config/passport/passport.js';
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Enable trust proxy for secure cookies in production
app.set('trust proxy', 1);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// CORS configuration
app.use(cors({
    origin: isProduction 
        ? ['https://earn-bug-fe.vercel.app']
        : ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Additional CORS headers
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': isProduction 
            ? 'https://earn-bug-fe.vercel.app'
            : 'http://localhost:5173'
    });
    next();
});

// Handle OPTIONS requests
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

// Session configuration
const pgSession = connectPgSimple(session);
app.use(session({
    store: new pgSession({
        pool: Database,
        tableName: 'session',
        createTableIfMissing: true,
        ttl: 24 * 60 * 60
    }),
    name: 'sessionId',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
setupPassport(app);

// Routes
app.use(Authroutes);

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
});