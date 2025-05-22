import pg from "pg" 
import dotenv from "dotenv"

dotenv.config(); 



export const Database = new pg.Pool({
    connectionString : process.env.DATABASE_URL , 
    connectionTimeoutMillis : 10000, // Timeout after 10 seconds
    ssl : {
        rejectUnauthorized : false
    } 
}); 

Database.connect((err, client, release) => {
    if (err) {  
        console.log("Error while connecting to the database" , err);
        process.exit(1); 
    } 
    else {
        console.log("Connected to the database");
        release(); 
    }
} )

