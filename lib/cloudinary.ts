import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Upload preset configurations
export const uploadPresets = {
  // Profile images
  profile: {
    folder: 'profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    max_file_size: 2000000, // 2MB
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  },
  
  // Product images
  product: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    max_file_size: 5000000, // 5MB
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  },
  
  // Gallery images
  gallery: {
    folder: 'gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    max_file_size: 10000000, // 10MB
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  },
  
  // Videos
  video: {
    folder: 'videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
    max_file_size: 50000000, // 50MB
    eager: [
      { width: 1280, height: 720, crop: 'limit', format: 'mp4' },
      { width: 640, height: 360, crop: 'limit', format: 'mp4' }
    ],
    eager_async: true
  }
}

export default cloudinary
