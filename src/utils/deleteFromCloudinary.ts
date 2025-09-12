import cloudinary from './cloudinary.js';

const deleteFromCloudinary = async (url: string) => {
    try {
        const result = await cloudinary.uploader.destroy(url.split('/').pop()?.split('.')[0] as string);
        console.log(result);
        return result.result === 'ok' ? true : false;
    } catch (error) {
        console.error('Error deleting from Cloudinary', error);
        throw new Error('Error deleting from Cloudinary');
    }
};

export { deleteFromCloudinary };