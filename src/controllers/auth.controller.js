const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailServices = require('../services/email.service');
const userLogoutController=require('../models/blackList.model')
/**
 * User Register Controller
 * POST /api/auth/register
 */

async function userRegisterController(req, res) {
    try {

        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check existing user
        const existingUser = await UserModel.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Create new user (password auto-hashed by schema middleware)
        const newUser = await UserModel.create({
            name,
            email,
            password
        });

        //  Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (https)
            sameSite: "lax"
        });

        // Send welcome email (don't wait for it to complete)
        try {
            await emailServices.sendRegistrationEmail(newUser.email, newUser.name);
        } catch (emailError) {
            console.error('Failed to send registration email:', emailError);
            // Don't fail registration if email fails
        }

        // Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                },
                token
            }
        });

    } 
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
}

async function userloginController(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await UserModel.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (https)
            sameSite: "lax"
        });

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}



module.exports = { userRegisterController, userloginController, userLogoutController};