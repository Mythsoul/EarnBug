import express from "express";
import dotenv from "dotenv"; 
import { Database } from "./config/db/db.js";
import cors from "cors"; 
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Authroutes } from "./routes /authroutes.js";
import { setupPassport } from "./config/passport/passport.js";
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000; 
const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'; // Fixed the environment variable

// Enable CORS 
app.use(cors({
    origin: isProduction 
        ? ['https://earn-bug-fe.vercel.app']    
        : ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Enable trust proxy
app.set('trust proxy', 1);

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': isProduction 
            ? 'https://earn-bug-fe.vercel.app'
            : 'http://localhost:5173'
    });
    next();
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Session configuration
const PgSession = connectPgSimple(session);
app.use(session({
    store: new PgSession({
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
        secure: String(process.env.NODE_ENV) === 'production', // Always secure in production
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    }
}));

// Passport initialization
setupPassport();
app.use(passport.initialize());
app.use(passport.session());

// Basic routes
app.get('/', (req, res) => { 
    res.send("The app is running"); 
});

// API routes
app.use(Authroutes);

// Start server
app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`); 
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend origin: ${FRONTEND_ORIGIN}`);
});

export default app;