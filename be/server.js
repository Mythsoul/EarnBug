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

const app = express(); 
const port = 3000; 
dotenv.config(); 

const isProduction = process.env.NODE_ENV === "production";
console.log("isProduction", isProduction); 

const getCookieConfig = () => {
  return {
    httpOnly: true,
    secure: isProduction, // true in production, false in development
    sameSite: isProduction ? 'none' : 'lax', // 'none' in production (requires secure:true), 'lax' in development
    path: '/'
  };
};
app.use(cookieParser())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
app.use(express.static("public")) 


// Updated CORS configuration - dynamic in development, restricted in production
app.use(cors({ 
    origin: isProduction 
        ? [process.env.FRONTEND_URL] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
}))

const pgSession = connectPgSimple(session); 

app.use(session({
    store: new pgSession({ 
        pool: Database, 
        tableName: "session",  
        createTableIfMissing: true 
    }), 
    name: "sessionId",
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
   proxy: true,
    cookie: {  
        maxAge: 1000 * 60 * 60 * 24 * 1, 
        ...getCookieConfig() 
    }
}))

app.use(passport.initialize())
app.use(passport.session())

setupPassport(app);

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/api/ping", (req, res) => {
    res.send("pong") 
})

app.use(Authroutes);

app.listen(port, () => { 
    console.log("The server is running at port", port)
});