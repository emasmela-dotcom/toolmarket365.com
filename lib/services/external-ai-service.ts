/**
 * External AI Service
 * Optional enhancement for bots - uses creator's own API keys
 * Falls back to template-based generation if no keys provided
 * All costs are at creator's expense
 */

import { sql } from '@/lib/db'
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

export interface UserAPIKeys {
  openai?: string
  anthropic?: string
  google?: string
}

const scryptAsync = promisify(scrypt)
const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const SALT_LENGTH = 16

/**
 * Encrypt API key (basic encryption - in production use proper key management)
 */
async function encryptKey(key: string, userId: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH)
  const keyMaterial = await scryptAsync(userId + (process.env.ENCRYPTION_SALT || 'default-salt'), salt, KEY_LENGTH) as Buffer
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, keyMaterial, iv)
  
  let encrypted = cipher.update(key, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Return: salt:iv:authTag:encrypted
  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Decrypt API key
 */
async function decryptKey(encryptedData: string, userId: string): Promise<string> {
  const parts = encryptedData.split(':')
  if (parts.length !== 4) throw new Error('Invalid encrypted data format')
  
  const [saltHex, ivHex, authTagHex, encrypted] = parts
  const salt = Buffer.from(saltHex, 'hex')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const keyMaterial = await scryptAsync(userId + (process.env.ENCRYPTION_SALT || 'default-salt'), salt, KEY_LENGTH) as Buffer
  const decipher = createDecipheriv(ALGORITHM, keyMaterial, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Get user's API keys for a specific service
 */
export async function getUserAPIKey(userId: string, serviceName: 'openai' | 'anthropic' | 'google'): Promise<string | null> {
  if (!sql) return null

  try {
    const result = await sql`
      SELECT api_key_encrypted, is_active
      FROM user_api_keys
      WHERE user_id = ${userId}
        AND service_name = ${serviceName}
        AND is_active = true
      LIMIT 1
    `

    if (result.length === 0) return null

    // Decrypt the key
    try {
      const decrypted = await decryptKey(result[0].api_key_encrypted, userId)
      return decrypted
    } catch (error) {
      console.error('Error decrypting API key:', error)
      return null
    }
  } catch (error) {
    console.error('Error fetching API key:', error)
    return null
  }
}

/**
 * Save user's API key (encrypted)
 */
export async function saveUserAPIKey(
  userId: string,
  serviceName: 'openai' | 'anthropic' | 'google',
  apiKey: string
): Promise<boolean> {
  if (!sql) return false

  try {
    // Encrypt the key before storing
    const encrypted = await encryptKey(apiKey, userId)

    await sql`
      INSERT INTO user_api_keys (user_id, service_name, api_key_encrypted, is_active)
      VALUES (${userId}, ${serviceName}, ${encrypted}, true)
      ON CONFLICT (user_id, service_name)
      DO UPDATE SET
        api_key_encrypted = EXCLUDED.api_key_encrypted,
        is_active = true,
        updated_at = NOW()
    `

    return true
  } catch (error) {
    console.error('Error saving API key:', error)
    return false
  }
}

/**
 * Delete user's API key
 */
export async function deleteUserAPIKey(
  userId: string,
  serviceName: 'openai' | 'anthropic' | 'google'
): Promise<boolean> {
  if (!sql) return false

  try {
    await sql`
      UPDATE user_api_keys
      SET is_active = false, updated_at = NOW()
      WHERE user_id = ${userId} AND service_name = ${serviceName}
    `
    return true
  } catch (error) {
    console.error('Error deleting API key:', error)
    return false
  }
}

/**
 * Generate caption using OpenAI (if API key provided)
 */
export async function generateCaptionWithOpenAI(
  apiKey: string,
  prompt: string,
  tone: string,
  platform: string
): Promise<string | null> {
  try {
    // Dynamic import to avoid bundling OpenAI in client
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use cheaper model
      messages: [
        {
          role: 'system',
          content: `You are a social media caption expert. Create engaging, platform-optimized captions for ${platform}. Consider the platform's character limits, audience expectations, and best practices. Include relevant hashtags and emojis where appropriate.`
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.8
    })

    return completion.choices[0].message.content || null
  } catch (error) {
    console.error('OpenAI API error:', error)
    return null
  }
}

/**
 * Generate caption using Anthropic Claude (if API key provided)
 */
export async function generateCaptionWithAnthropic(
  apiKey: string,
  prompt: string,
  tone: string,
  platform: string
): Promise<string | null> {
  try {
    // Dynamic import to avoid bundling Anthropic in client
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const anthropic = new Anthropic({ apiKey })

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use cheaper model
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return content.text
    }
    return null
  } catch (error) {
    console.error('Anthropic API error:', error)
    return null
  }
}

/**
 * Try to generate caption with external AI, fallback to null if fails
 */
export async function tryExternalAIGeneration(
  userId: string,
  prompt: string,
  tone: string,
  platform: string
): Promise<string | null> {
  // Try OpenAI first
  const openaiKey = await getUserAPIKey(userId, 'openai')
  if (openaiKey) {
    const result = await generateCaptionWithOpenAI(openaiKey, prompt, tone, platform)
    if (result) {
      // Update usage stats
      await updateAPIKeyUsage(userId, 'openai')
      return result
    }
  }

  // Try Anthropic as fallback
  const anthropicKey = await getUserAPIKey(userId, 'anthropic')
  if (anthropicKey) {
    const result = await generateCaptionWithAnthropic(anthropicKey, prompt, tone, platform)
    if (result) {
      await updateAPIKeyUsage(userId, 'anthropic')
      return result
    }
  }

  return null // No keys or all failed - use template fallback
}

/**
 * Update API key usage stats
 */
async function updateAPIKeyUsage(userId: string, serviceName: string): Promise<void> {
  if (!sql) return

  try {
    await sql`
      UPDATE user_api_keys
      SET usage_count = usage_count + 1,
          last_used_at = NOW(),
          updated_at = NOW()
      WHERE user_id = ${userId} AND service_name = ${serviceName}
    `
  } catch (error) {
    console.error('Error updating API key usage:', error)
  }
}
