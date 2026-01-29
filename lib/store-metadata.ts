import { sql } from '@/lib/db'

export interface StoreMetadata {
  id: string
  user_id: string | null
  title: string
  tags: string[]
  type: string
  cloudinary_public_id: string | null
  cloudinary_url: string | null
  file_size: number | null
  format: string | null
  width: number | null
  height: number | null
  duration: number | null
  description: string | null
  created_at: string
  updated_at: string
}

// Insert store metadata
export async function insertStoreMetadata(data: {
  user_id?: string | null
  title: string
  tags?: string[]
  type: string
  cloudinary_public_id?: string
  cloudinary_url?: string
  file_size?: number
  format?: string
  width?: number
  height?: number
  duration?: number
  description?: string
}): Promise<StoreMetadata | null> {
  try {
    if (!sql) return null

    const result = await sql`
      INSERT INTO store_metadata (
        user_id, title, tags, type, cloudinary_public_id, 
        cloudinary_url, file_size, format, width, height, 
        duration, description
      )
      VALUES (
        ${data.user_id || null},
        ${data.title},
        ${data.tags || []},
        ${data.type},
        ${data.cloudinary_public_id || null},
        ${data.cloudinary_url || null},
        ${data.file_size || null},
        ${data.format || null},
        ${data.width || null},
        ${data.height || null},
        ${data.duration || null},
        ${data.description || null}
      )
      RETURNING *
    `

    return result[0] as StoreMetadata
  } catch (error) {
    console.error('Error inserting store metadata:', error)
    return null
  }
}

// Get all metadata
export async function getAllStoreMetadata(userId?: string): Promise<StoreMetadata[]> {
  try {
    if (!sql) return []

    let result
    if (userId) {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM store_metadata
        ORDER BY created_at DESC
      `
    }

    return result as StoreMetadata[]
  } catch (error) {
    console.error('Error getting store metadata:', error)
    return []
  }
}

// Get metadata by ID
export async function getStoreMetadataById(id: string): Promise<StoreMetadata | null> {
  try {
    if (!sql) return null

    const result = await sql`
      SELECT * FROM store_metadata
      WHERE id = ${id}
    `

    return result[0] as StoreMetadata || null
  } catch (error) {
    console.error('Error getting store metadata by id:', error)
    return null
  }
}

// Get metadata by type
export async function getStoreMetadataByType(
  type: string,
  userId?: string
): Promise<StoreMetadata[]> {
  try {
    if (!sql) return []

    let result
    if (userId) {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE type = ${type} AND user_id = ${userId}
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE type = ${type}
        ORDER BY created_at DESC
      `
    }

    return result as StoreMetadata[]
  } catch (error) {
    console.error('Error getting store metadata by type:', error)
    return []
  }
}

// Search metadata by tags
export async function searchStoreMetadataByTag(
  tag: string,
  userId?: string
): Promise<StoreMetadata[]> {
  try {
    if (!sql) return []

    let result
    if (userId) {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE ${tag} = ANY(tags) AND user_id = ${userId}
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE ${tag} = ANY(tags)
        ORDER BY created_at DESC
      `
    }

    return result as StoreMetadata[]
  } catch (error) {
    console.error('Error searching store metadata by tag:', error)
    return []
  }
}

// Search metadata by title
export async function searchStoreMetadataByTitle(
  title: string,
  userId?: string
): Promise<StoreMetadata[]> {
  try {
    if (!sql) return []

    const searchTerm = `%${title}%`
    let result
    if (userId) {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE title ILIKE ${searchTerm} AND user_id = ${userId}
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE title ILIKE ${searchTerm}
        ORDER BY created_at DESC
      `
    }

    return result as StoreMetadata[]
  } catch (error) {
    console.error('Error searching store metadata by title:', error)
    return []
  }
}

// Update metadata
export async function updateStoreMetadata(
  id: string,
  data: Partial<Omit<StoreMetadata, 'id' | 'created_at' | 'updated_at'>>
): Promise<StoreMetadata | null> {
  try {
    if (!sql) return null

    const existing = await sql`
      SELECT * FROM store_metadata WHERE id = ${id}
    `
    const row = (existing as StoreMetadata[])[0]
    if (!row) return null

    const merged = {
      user_id: data.user_id !== undefined ? data.user_id : row.user_id,
      title: data.title !== undefined ? data.title : row.title,
      tags: data.tags !== undefined ? data.tags : row.tags,
      type: data.type !== undefined ? data.type : row.type,
      cloudinary_public_id: data.cloudinary_public_id !== undefined ? data.cloudinary_public_id : row.cloudinary_public_id,
      cloudinary_url: data.cloudinary_url !== undefined ? data.cloudinary_url : row.cloudinary_url,
      file_size: data.file_size !== undefined ? data.file_size : row.file_size,
      format: data.format !== undefined ? data.format : row.format,
      width: data.width !== undefined ? data.width : row.width,
      height: data.height !== undefined ? data.height : row.height,
      duration: data.duration !== undefined ? data.duration : row.duration,
      description: data.description !== undefined ? data.description : row.description
    }

    const result = await sql`
      UPDATE store_metadata
      SET user_id = ${merged.user_id}, title = ${merged.title}, tags = ${merged.tags},
          type = ${merged.type}, cloudinary_public_id = ${merged.cloudinary_public_id},
          cloudinary_url = ${merged.cloudinary_url}, file_size = ${merged.file_size},
          format = ${merged.format}, width = ${merged.width}, height = ${merged.height},
          duration = ${merged.duration}, description = ${merged.description},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return (result as StoreMetadata[])[0] ?? null
  } catch (error) {
    console.error('Error updating store metadata:', error)
    return null
  }
}

// Delete metadata
export async function deleteStoreMetadata(id: string): Promise<boolean> {
  try {
    if (!sql) return false

    await sql`
      DELETE FROM store_metadata
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error('Error deleting store metadata:', error)
    return false
  }
}

// Get metadata count
export async function getStoreMetadataCount(userId?: string): Promise<number> {
  try {
    if (!sql) return 0

    let result
    if (userId) {
      result = await sql`
        SELECT COUNT(*) as count FROM store_metadata
        WHERE user_id = ${userId}
      `
    } else {
      result = await sql`
        SELECT COUNT(*) as count FROM store_metadata
      `
    }

    return result[0]?.count || 0
  } catch (error) {
    console.error('Error getting store metadata count:', error)
    return 0
  }
}

// Get total storage used (in bytes)
export async function getStorageUsed(userId?: string): Promise<number> {
  try {
    if (!sql) return 0

    let result
    if (userId) {
      result = await sql`
        SELECT SUM(file_size) as total FROM store_metadata
        WHERE user_id = ${userId} AND file_size IS NOT NULL
      `
    } else {
      result = await sql`
        SELECT SUM(file_size) as total FROM store_metadata
        WHERE file_size IS NOT NULL
      `
    }

    return result[0]?.total || 0
  } catch (error) {
    console.error('Error getting storage used:', error)
    return 0
  }
}

// Get metadata by multiple tags (ANY match)
export async function getStoreMetadataByTags(
  tags: string[],
  userId?: string
): Promise<StoreMetadata[]> {
  try {
    if (!sql) return []

    let result
    if (userId) {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE (tags && ${tags})::boolean AND user_id = ${userId}
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM store_metadata
        WHERE tags && ${tags}
        ORDER BY created_at DESC
      `
    }

    return result as StoreMetadata[]
  } catch (error) {
    console.error('Error getting store metadata by tags:', error)
    return []
  }
}
