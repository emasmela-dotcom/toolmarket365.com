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
      UPDATE store_metadata
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await sql.unsafe(query, values)
    return result[0] as StoreMetadata || null
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
