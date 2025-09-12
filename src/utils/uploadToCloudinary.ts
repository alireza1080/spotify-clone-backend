import cloudinary from '../utils/cloudinary.js';
import { config } from 'dotenv';
import { type UploadedFile } from 'express-fileupload';

config();

const uploadToCloudinary = async (
  file: UploadedFile,
  resourceType: 'image' | 'audio'
) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: process.env.CLOUDINARY_FOLDER as string,
      resource_type: resourceType === 'image' ? 'image' : 'video',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary', error);
    throw new Error('Error uploading to Cloudinary');
  }
};

export { uploadToCloudinary };
