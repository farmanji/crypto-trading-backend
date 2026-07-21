import jwt from 'jsonwebtoken'
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js'; 

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        // 1. Destructure confirmPassword from req.body
        const { fullName, email, password, confirmPassword, isTermsAccepted } = req.body;

        // 2. Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match!'
            });
        }

        // 3. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please register with another email.'
            });
        }

        // 4. Encrypt the password safely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create new user (confirmPassword is NOT sent to database)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            isTermsAccepted
        });
        
        await newUser.save();
        
        return res.status(201).json({
            success: true,
            message: 'Signup is successful!'
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//Login api

router.post('/login', async(req,res)=>{

try {
   const { email, password } = req.body;
   // 1. Check if user exists AND explicitly select the hidden password
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password!'
            });
        }
 // 2. Compare the incoming password with encrypted database password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password!'
            });
        }
         // 3. Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token valid for 1 day
        );

// 4. Send response with token (excluding password for security)
        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        }); 

} catch (error) {
    return res.status(500).json({
            success: false,
            message: error.message
        });
}
})

// ==================== Google login ====================
router.post('/google', async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({
                success: false,
                message: 'Access token missing!'
            });
        }

        // Fetch the user's profile from Google using the access token
        const googleRes = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );
        const profile = await googleRes.json();

        if (!profile?.email) {
            return res.status(400).json({
                success: false,
                message: 'Could not retrieve email from Google.'
            });
        }

        let user = await User.findOne({ email: profile.email });

        if (!user) {
            // New user via Google — no password field is set
            user = new User({
                fullName: profile.name,
                email: profile.email,
                authProvider: 'google',
                isTermsAccepted: true, // consent already covered by the Google OAuth flow
            });
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Google login successful!',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;