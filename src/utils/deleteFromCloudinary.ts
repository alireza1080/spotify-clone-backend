import cloudinary from './cloudinary.js';

const deleteFromCloudinary = async (url: string, resourceType: 'image' | 'audio') => {
    try {
        const result = await cloudinary.uploader.destroy(url.split('/').pop()?.split('.')[0] as string, {
            resource_type: resourceType === 'image' ? 'image' : 'video',
        });
        return result.result === 'ok' ? true : false;
    } catch (error) {
        console.error('Error deleting from Cloudinary', error);
        throw new Error('Error deleting from Cloudinary');
    }
};

export { deleteFromCloudinary };