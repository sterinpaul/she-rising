import jwt from 'jsonwebtoken';
import configKeys from "../config/configKeys.js";
import authService from "../utils/authService.js";

const authMiddleware = async (req, res, next) => {
    let token = null;
    
    // First, try to get token from cookies (preferred method)
    if (req.cookies && req.cookies.authToken) {
        token = req.cookies.authToken;
    }
    // Fallback to Authorization header for backward compatibility
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    
    try {
        if (typeof token === "string") {
            try {
                const decoded = jwt.verify(token, configKeys.JWT_SECRET_KEY);
                req.user = decoded;
                next();
            } catch (error) {
                // Token is invalid or expired
                return res.status(401).json({ 
                    status: false, 
                    message: "Invalid or expired token. Please login again." 
                });
            }
        } else {
            return res.status(401).json({ 
                status: false, 
                message: "Authentication required. Please login." 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ 
            status: false, 
            message: "Authentication failed. Please login again." 
        });
    }
}


export default authMiddleware