import jwt from 'jsonwebtoken'
import type { JwtPayload } from '@/types'

const SECRET = process.env.JWT_SECRET!
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d'

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function extractToken(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}
