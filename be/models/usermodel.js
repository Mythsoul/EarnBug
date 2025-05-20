import { Database } from "../config/db/db.js";

export function getUserById(id) {
    return Database.query("SELECT username, email FROM users WHERE id = $1", [id])
        .then((result) => {
            if (result.rows.length === 0) {
                throw new Error("User not found");
            }
            return result.rows[0];
        })
        .catch((error) => {
            throw new Error(`Database error: ${error.message}`);
        });
}    