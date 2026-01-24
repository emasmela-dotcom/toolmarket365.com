import multer from 'multer'

// File type validation
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedImageTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
  
  const allowedVideoTypes = process.env.ALLOWED_VIDEO_TYPES?.split(',') || [
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/webm'
  ]
  
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false)
  }
}

// Multer configuration
export const uploadConfig = {
  storage: multer.memoryStorage(), // Use memory storage for better performance
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  }
}

export const upload = multer(uploadConfig)
export const uploadSingle = (fieldName: string) => upload.single(fieldName)
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => 
  upload.array(fieldName, maxCount)
