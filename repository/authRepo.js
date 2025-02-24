import bcrypt from "bcryptjs"
import db from "../db/db.js";
import AppError from "../error/AppError.js";

const addUser = async( name, email, password ) => {
    const hashedPassword = await bcrypt.hash(password,10);
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.execute(
            `INSERT INTO users (name, email, password) VALUES (?,?,?)`,
            [name, email, hashedPassword]
        );
        await conn.commit();
        console.log("User added successfully!");
        return result.insertId;
    } catch (error) {
        await conn.rollback();
        console.error("Error adding user:", error);
        throw new AppError("Error adding user:", error);
    }
    finally {
        conn.release();
    }
}
const loginUser = async( email, password) => {
    try {
        const db_password_hashed = await db.query(`SELECT password FROM users where email = ?;`,[email]);
        const db_password=db_password_hashed[0][0]['password'];
        
        if(!bcrypt.compare(db_password,password)){
            return null;
        }
        const [result] = await db.execute(
            `SELECT * FROM users WHERE email =? AND password =?`,
            [email, db_password]
        );
        if (result.length > 0) {
            console.log("User logged in successfully!");
            return result[0];
        } else {
            console.error("Invalid email or password.");
            return null;
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        return null;
    }
}

export default { 
    addUser,
    loginUser
 };