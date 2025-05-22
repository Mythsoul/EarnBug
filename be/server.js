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

app.set('trust proxy', 1);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, false);
        
        const allowedOrigins = isProduction 
            ? ['https://earn-bug-fe.vercel.app' , 'http://localhost:5173']
            : ['http://localhost:5173', 'http://127.0.0.1:5173'];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Cookie',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200, 
    preflightContinue: false
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

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
        path: '/',
     
    }
}));

app.use(passport.initialize());
app.use(passport.session());
setupPassport(app);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.get('origin')}`);
    next();
});

// Routes
app.get("/", (req, res) => {
    res.json({ 
        message: "Server is running",
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

app.use(Authroutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ 
            error: 'CORS policy violation',
            origin: req.get('origin')
        });
    }
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
    console.log(`Allowed origins: ${isProduction ? 'https://earn-bug-fe.vercel.app' : 'http://localhost:5173'}`);
});