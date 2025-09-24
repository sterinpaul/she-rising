import {config} from 'dotenv'
config()

const configKeys = {
    PORT:process.env.PORT,
    MONGODB_ATLAS_URL:process.env.MONGODB_ATLAS_URL,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET_KEY:process.env.CLOUDINARY_SECRET_KEY,
    CLIENT_URL:process.env.CLIENT_URL,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    JWT_EXPIRY:process.env.JWT_EXPIRY,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD:process.env.ADMIN_PASSWORD
}

export default configKeys