import { getUserById } from "../models/usermodel.js";

export const GetuserFromId = async (req, res) => { 
    try {
        const { user_id } = req.params;
        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}