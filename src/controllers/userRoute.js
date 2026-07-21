import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'; 
import User from '../models/userModel.js'; 

const router = express.Router();

// GET CURRENTLY LOGGED-IN USER DETAILS
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user.userId comes from the verified JWT token in the middleware
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        // Return user data safely
        return res.status(200).json({
            success: true,
            user
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;