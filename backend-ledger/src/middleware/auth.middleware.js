const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const tokenBlackListModel =require('../models/blackList.model')

async function authMiddleware (req, res, next) {
    try {
        
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const isBlacklisted = await tokenBlackListModel.findOne({ token })

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Unauthorized access, token is invalid"
            })
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded.userId)

        req.user = user

        return next();

    } 
    catch (error) {
        console.error('JWT verification error:', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

async function authSystemUserMiddleware(req, res, next) {

    try {

        const token =
        req.cookies.token ||
        req.headers.authorization?.split(" ")[1];

        if (!token) {

            return res.status(401).json({

                success:false,
                message:'Access denied. No token provided.'

            });

        }

        const isBlacklisted =
        await tokenBlackListModel.findOne({ token });

        if (isBlacklisted) {

            return res.status(401).json({

                success:false,
                message:"Token expired, login again"

            });

        }

        // verify token
        const decoded =
        jwt.verify(token, process.env.JWT_SECRET);

        // get user from database
        const user =
        await UserModel
        .findById(decoded.userId)
        .select("+systemUser");

        // check user exists
        if (!user) {

            return res.status(401).json({

                success:false,
                message:"User not found"

            });

        }

        // check systemUser role from DB
        if (!user.systemUser) {

            return res.status(403).json({

                success:false,
                message:"Only system user (bank) allowed"

            });

        }

        // attach user to request
        req.user = user;

        next();

    }

    catch (error) {

        console.error(error);

        return res.status(401).json({

            success:false,
            message:'Invalid or expired token'

        });

    }

}

module.exports = {authMiddleware,authSystemUserMiddleware};