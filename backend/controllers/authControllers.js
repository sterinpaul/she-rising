import Joi from "joi"
import jwt from 'jsonwebtoken'
import authHelpers from '../helpers/authHelpers.js';
import authService from '../utils/authService.js';
import configKeys from '../config/configKeys.js';

const authControllers = () => {
    const signIn = async (req, res) => {
        try {
            const signInSchema = Joi.object({
                email: Joi.string().email({tlds:{allow:false}}).required(),
                password: Joi.string().min(6).max(12).required()
            })
            const { error, value } = signInSchema.validate(req.body)
            
            if (error) {
                return res.status(200).json({ status: false, message: error.details[0].message })
            }
            const { email, password } = value
            const userExists = await authHelpers.getUserByEmail(email)
            if (!userExists) {
                return res.status(200).json({ status: false, message: "Admin does not exist" })
            }

            const checkPassword = await authService.comparePassword(password, userExists.password)
            if (!checkPassword) {
                return res.status(200).json({ status: false, message: "Incorrect Password" })
            }

            const token = jwt.sign({email}, configKeys.JWT_SECRET_KEY, {
                expiresIn: '24h'
            })
            
            const isProduction = process.env.NODE_ENV === 'production'
            res.cookie('authToken', token, {
                httpOnly: true,                    // Prevents XSS attacks
                secure: isProduction,             // HTTPS only in production
                sameSite: 'strict',               // CSRF protection
                maxAge: 24 * 60 * 60 * 1000,     // 24 hours in milliseconds
                path: '/',                        // Cookie available for entire app
                domain: isProduction ? undefined : undefined  // Let browser set domain automatically
            })

            // Return user data without password
            const { password: _, ...userResponse } = userExists._doc || userExists
            return res.status(200).json({ 
                status: true, 
                message: "Sign in successful",
                user: userResponse
            })

        } catch (error) {
            console.error('SignIn error:', error);
            return res.status(500).json({ status: false, message: "Error occured" })
        }
    }

    const signOut = async (req, res) => {
        try {
            // Clear authentication cookie with all original options
            const isProduction = process.env.NODE_ENV === 'production'
            res.clearCookie('authToken', {
                path: '/',                  // Must match the path used when setting
                sameSite: 'strict',        // Must match sameSite setting
                secure: isProduction,      // Must match secure setting
                httpOnly: true             // Must match httpOnly setting
            })
            
            return res.status(200).json({ status: true, message: "Signout Successful" })
        } catch (error) {
            return res.status(500).json({ status: false, message: "Signout failed" })
        }
    }

    const checkAuthStatus = async (req, res) => {
        try {
            // Get user info from token
            const { email } = req.user;
            
            // Fetch fresh user data from database
            const userExists = await authHelpers.getUserByEmail(email);
            if (!userExists) {
                return res.status(401).json({ 
                    status: false, 
                    message: "User not found"
                });
            }

            // Return user data without password
            const { password: _, ...userResponse } = userExists._doc || userExists;
            return res.status(200).json({ 
                status: true, 
                message: "User is authenticated",
                user: userResponse
            });
        } catch (error) {
            return res.status(401).json({ 
                status: false, 
                message: "Authentication failed"
            });
        }
    }


    return {
        signIn,
        signOut,
        checkAuthStatus
    }
}

export default authControllers;