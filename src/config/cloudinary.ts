import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
    });

    const { url } = result;

    if (!url) {
      return {
        isSuccess: false,
        message: 'Image upload failed',
        statusCode: 400,
      };
    }

    return {
      isSuccess: true,
      message: 'Image uploaded successfully',
      statusCode: 200,
      url,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Internal server error',
      statusCode: 500,
    };
  }
}

export { cloudinary, uploadImage };
