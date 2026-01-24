import { sql } from '@/lib/db'

export interface Upload {
  id: string
  user_id: string
  file_name: string
  file_url: string
  cloudinary_public_id: string | null
  file_type: string | null
  file_size: number | null
  width: number | null
  height: number | null
  duration: number | null
  tags: string[]
  description: string | null
  created_at: string
  updated_at: string
}

// Insert upload for user
export async function insertUpload(data: {
  user_id: string
  file_name: string
  file_url: string
  cloudinary_public_id?: string
  file_type?: string
  file_size?: number
  width?: number
  height?: number
  duration?: number
  tags?: string[]
  description?: string
}): Promise<Upload | null> {
  try {
    if (!sql) return null

    const result = await sql`
      INSERT INTO uploads (
        user_id, file_name, file_url, cloudinary_public_id, 
        file_type, file_size, width, height, duration, tags, description
      )
      VALUES (
        ${data.user_id},
        ${data.file_name},
        ${data.file_url},
        ${data.cloudinary_public_id || null},
        ${data.file_type || null},
        ${data.file_size || null},
        ${data.width || null},
        ${data.height || null},
        ${data.duration || null},
        ${data.tags || []},
        ${data.description || null}
      )
      RETURNING *
    `

    return result[0] as Upload
  } catch (error) {
    console.error('Error inserting upload:', error)
    return null
  }
}

// Get all uploads for user
export async function getUserUploads(userId: string): Promise<Upload[]> {
  try {
    if (!sql) return []

    const result = await sql`
      SELECT * FROM uploads
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return result as Upload[]
  } catch (error) {
    console.error('Error getting user uploads:', error)
    return []
  }
}

// Get upload by ID
export async function getUploadById(id: string): Promise<Upload | null> {
  try {
    if (!sql) return null

    const result = await sql`
      SELECT * FROM uploads
      WHERE id = ${id}
    `

    return result[0] as Upload || null
  } catch (error) {
    console.error('Error getting upload by id:', error)
    return null
  }
}

// Get uploads by type
export async function getUserUploadsByType(
  userId: string,
  fileType: string
): Promise<Upload[]> {
  try {
    if (!sql) return []

    const result = await sql`
      SELECT * FROM uploads
      WHERE user_id = ${userId} AND file_type = ${fileType}
      ORDER BY created_at DESC
    `

    return result as Upload[]
  } catch (error) {
    console.error('Error getting uploads by type:', error)
    return []
  }
}

// Search uploads by file name
export async function searchUserUploads(
  userId: string,
  searchTerm: string
): Promise<Upload[]> {
  try {
    if (!sql) return []

    const search = `%${searchTerm}%`
    const result = await sql`
      SELECT * FROM uploads
      WHERE user_id = ${userId} AND file_name ILIKE ${search}
      ORDER BY created_at DESC
    `

    return result as Upload[]
  } catch (error) {
    console.error('Error searching uploads:', error)
    return []
  }
}

// Get uploads by tag
export async function getUserUploadsByTag(
  userId: string,
  tag: string
): Promise<Upload[]> {
  try {
    if (!sql) return []

    const result = await sql`
      SELECT * FROM uploads
      WHERE user_id = ${userId} AND ${tag} = ANY(tags)
      ORDER BY created_at DESC
    `

    return result as Upload[]
  } catch (error) {
    console.error('Error getting uploads by tag:', error)
    return []
  }
}

// Update upload
export async function updateUpload(
  id: string,
  data: Partial<Omit<Upload, 'id' | 'user_id' | 'created_at'>>
): Promise<Upload | null> {
  try {
    if (!sql) return null

    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    })

    if (updates.length === 0) return null

    updates.push(`updated_at = NOW()`)
    values.push(id)

    const query = `
      UPDATE uploads
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await sql.unsafe(query, values)
    return result[0] as Upload || null
  } catch (error) {
    console.error('Error updating upload:', error)
    return null
  }
}

// Delete upload
export async function deleteUpload(id: string): Promise<boolean> {
  try {
    if (!sql) return false

    await sql`
      DELETE FROM uploads
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error('Error deleting upload:', error)
    return false
  }
}

// Delete upload by Cloudinary public ID
export async function deleteUploadByCloudinaryId(publicId: string): Promise<boolean> {
  try {
    if (!sql) return false

    await sql`
      DELETE FROM uploads
      WHERE cloudinary_public_id = ${publicId}
    `

    return true
  } catch (error) {
    console.error('Error deleting upload by cloudinary id:', error)
    return false
  }
}

// Get total storage used by user (in bytes)
export async function getUserStorageUsed(userId: string): Promise<number> {
  try {
    if (!sql) return 0

    const result = await sql`
      SELECT SUM(file_size) as total FROM uploads
      WHERE user_id = ${userId} AND file_size IS NOT NULL
    `

    return result[0]?.total || 0
  } catch (error) {
    console.error('Error getting user storage used:', error)
    return 0
  }
}

// Get upload count for user
export async function getUserUploadCount(userId: string): Promise<number> {
  try {
    if (!sql) return 0

    const result = await sql`
      SELECT COUNT(*) as count FROM uploads
      WHERE user_id = ${userId}
    `

    return result[0]?.count || 0
  } catch (error) {
    console.error('Error getting upload count:', error)
    return 0
  }
}

// Get uploads with user info
export async function getUploadWithUserInfo(uploadId: string): Promise<any> {
  try {
    if (!sql) return null

    const result = await sql`
      SELECT
        uploads.id,
        uploads.file_name,
        uploads.file_url,
        uploads.cloudinary_public_id,
        uploads.file_type,
        uploads.file_size,
        uploads.width,
        uploads.height,
        uploads.duration,
        uploads.tags,
        uploads.description,
        uploads.created_at,
        uploads.updated_at,
        users.email,
        users.name,
        users.id as user_id
      FROM uploads
      JOIN users ON uploads.user_id = users.id
      WHERE uploads.id = ${uploadId}
    `

    return result[0] || null
  } catch (error) {
    console.error('Error getting upload with user info:', error)
    return null
  }
}

// Get all uploads for user with pagination
export async function getUserUploadsWithPagination(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ uploads: Upload[], total: number }> {
  try {
    if (!sql) return { uploads: [], total: 0 }

    const offset = (page - 1) * limit

    const uploads = await sql`
      SELECT * FROM uploads
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as Upload[]

    const countResult = await sql`
      SELECT COUNT(*) as count FROM uploads
      WHERE user_id = ${userId}
    `

    const total = countResult[0]?.count || 0

    return { uploads, total }
  } catch (error) {
    console.error('Error getting uploads with pagination:', error)
    return { uploads: [], total: 0 }
  }
}

// Add tags to upload
export async function addTagsToUpload(id: string, newTags: string[]): Promise<Upload | null> {
  try {
    if (!sql) return null

    const result = await sql`
      UPDATE uploads
      SET tags = array_cat(tags, ${newTags})
      WHERE id = ${id}
      RETURNING *
    `

    return result[0] as Upload || null
  } catch (error) {
    console.error('Error adding tags to upload:', error)
    return null
  }
}

// Remove tags from upload
export async function removeTagsFromUpload(id: string, tagsToRemove: string[]): Promise<Upload | null> {
  try {
    if (!sql) return null

    const result = await sql`
      UPDATE uploads
      SET tags = array_remove(tags, ANY(${tagsToRemove}))
      WHERE id = ${id}
      RETURNING *
    `

    return result[0] as Upload || null
  } catch (error) {
    console.error('Error removing tags from upload:', error)
    return null
  }
}
