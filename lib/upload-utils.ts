import cloudinary from './cloudinary'
import { Readable } from 'stream'

interface UploadResult {
  success: boolean
  data?: {
    public_id: string
    secure_url: string
    url: string
    format: string
    width?: number
    height?: number
    bytes: number
    duration?: number
    resource_type: string
    created_at: string
  }
  error?: string
}

// Upload from buffer
export async function uploadFromBuffer(
  buffer: Buffer,
  options: any = {}
): Promise<UploadResult> {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            reject({ success: false, error: error.message })
          } else if (result) {
            resolve({
              success: true,
              data: {
                public_id: result.public_id,
                secure_url: result.secure_url,
                url: result.url,
                format: result.format,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
                duration: result.duration,
                resource_type: result.resource_type,
                created_at: result.created_at
              }
            })
          }
        }
      )
      
      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)
      readable.pipe(stream)
    })
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed' }
  }
}

// Upload from base64
export async function uploadFromBase64(
  base64String: string,
  options: any = {}
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(base64String, options)
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        duration: result.duration,
        resource_type: result.resource_type,
        created_at: result.created_at
      }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed' }
  }
}

// Upload from URL
export async function uploadFromUrl(
  url: string,
  options: any = {}
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(url, options)
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        duration: result.duration,
        resource_type: result.resource_type,
        created_at: result.created_at
      }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed' }
  }
}

// Delete asset
export async function deleteAsset(
  publicId: string,
  resourceType: string = 'image'
): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Delete failed' }
  }
}

// Get asset info
export async function getAssetInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get asset info' }
  }
}

// Create transformation URL
export function createTransformationUrl(
  publicId: string,
  transformations: any[] = [],
  resourceType: string = 'image'
): string {
  const transformationString = transformations.map(t => {
    const keys = Object.keys(t)
    return keys.map(key => `${key}_${t[key]}`).join(',')
  }).join('/')

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    transformation: transformationString,
    secure: true
  })
}
