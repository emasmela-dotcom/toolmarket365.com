import bcrypt from 'bcryptjs'
import { createHash, randomUUID } from 'crypto'

export const SESSION_COOKIE_NAME = 'msm_session'
export const SESSION_TTL_DAYS = 30
export const RESET_TTL_MINUTES = 30

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  // Pragmatic check (not RFC-perfect).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongEnoughPassword(pw: string): boolean {
  return typeof pw === 'string' && pw.length >= 8
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

export function randomToken(): string {
  // URL-safe token
  return Buffer.from(randomUUID() + randomUUID()).toString('base64url')
}

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function nowPlusDays(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

export function nowPlusMinutes(minutes: number): Date {
  const d = new Date()
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

