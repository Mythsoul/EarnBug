import bcrypt from "bcrypt";
import dotenv from "dotenv"; 
import { Database } from "../config/db/db.js";
import jwt from "jsonwebtoken"

dotenv.config(); 

export async function FindUserByEmail(email){ 
   if(!email) {
    throw new Error("Email is required");   
   }
   try { 
    const response = await Database.query("select * from users where email = $1" , [email]);    
    return response.rows[0];
   } catch (error) { 
    throw new Error(error); 
   }

}

export const JwtGenerator = (user) => {
    const payload = {
        user : {
            id : user.id , 
            username : user.username , 
            email : user.email
        }
    }
    return jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : "1h"})
}

export const CreateUser = async (username ,  email , password ) => {
       if(!password || !email || !username) {
        throw new Error("All fields are required");
       }
       try{ 
        const salt = Number(process.env.Salt_Rounds) ; 
        const hashedPassword = bcrypt.hashSync(password , salt);
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }
        const response = await Database.query("insert into users (username , email  , password ) values ($1 , $2 , $3) returning * " , [username , email , hashedPassword]);
       delete response.rows[0].password ; 
       const user = response.rows[0]; 
       return user ;
       
    }catch(err){ 
        throw new Error(err); 
    }
}


export const Login = async(email , password)=> { 
    if(!email || !password) {     
        throw new Error("All fields are required");  
    } 
    try { 
       const ExistingUser = await FindUserByEmail(email); 
       if(!ExistingUser) { 
        throw new Error("User does not exist"); 
       }
       const isPasswordCorrect = bcrypt.compareSync(password , ExistingUser.password);
       if(!isPasswordCorrect) { 
        throw new Error("Incorrect Password");
    }
    delete ExistingUser.password ; 
    return ExistingUser ; 
    }catch (error) { 
        throw new Error(error); 
    } 

}



export const getUserInfo = async (user_id) => { 
    try { 
       const response = await Database.query("select * from users where id = $1" , [user_id]); 
        delete response.rows[0].password ;
        delete response.rows[0].email ; 
        
       return response.rows[0];
    } catch (error) { 
        throw new Error(error); 
    }
}