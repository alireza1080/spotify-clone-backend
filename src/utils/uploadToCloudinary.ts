import cloudinary from '../utils/cloudinary.js';
import { config } from 'dotenv';

config();

const uploadToCloudinary = async (file: any) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: process.env.CLOUDINARY_FOLDER as string,
            resource_type: 'auto',
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary', error);
        throw error;
    } 
}

export { uploadToCloudinary };