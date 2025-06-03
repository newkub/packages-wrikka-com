# Authentication Guide

This guide covers authentication and authorization patterns for your application's backend.

## Authentication Strategies

### 1. Session-Based Authentication

#### Setup with Express and Express-Session

```typescript
// server/middleware/session.ts
import session from 'express-session'
import connectRedis from 'connect-redis'
import { createClient } from 'redis'

export const RedisStore = connectRedis(session)

export const sessionConfig = {
  store: new RedisStore({
    client: createClient({ url: process.env.REDIS_URL }),
    prefix: 'sess:',
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}
```

#### Protecting Routes

```typescript
// server/middleware/auth.ts
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  next()
}
```

### 2. JWT Authentication

#### JWT Service

```typescript
// server/services/jwt.ts
import jwt from 'jsonwebtoken'

import { User } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

export const generateTokens = (user: Pick<User, 'id' | 'email' | 'role'>) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  )
  
  return { accessToken, refreshToken }
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
  } catch (error) {
    return null
  }
}
```

#### Refresh Token Endpoint

```typescript
// server/routes/auth.ts
import { Router } from 'express'
import { generateTokens, verifyToken } from '../services/jwt'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' })
  }
  
  const payload = verifyToken(refreshToken)
  
  if (!payload || !payload.userId) {
    return res.status(403).json({ message: 'Invalid refresh token' })
  }
  
  // Verify refresh token is in the database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true }
  })
  
  if (!user) {
    return res.status(403).json({ message: 'User not found' })
  }
  
  // Generate new tokens
  const tokens = generateTokens(user)
  
  // Update refresh token in database (optional)
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken }
  })
  
  res.json(tokens)
})

export default router
```

### 3. OAuth 2.0 / OpenID Connect

#### Google OAuth Example

```typescript
// server/services/oauth.ts
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../lib/prisma'

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
})

export const getGoogleAuthURL = () => {
  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  })
}

export const getGoogleUser = async (code: string) => {
  const { tokens } = await googleClient.getToken(code)
  googleClient.setCredentials(tokens)
  
  const { data } = await googleClient.request({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
  })
  
  // Find or create user in your database
  let user = await prisma.user.findUnique({
    where: { email: data.email },
  })
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        avatar: data.picture,
        authProvider: 'GOOGLE',
        authProviderId: data.sub,
      },
    })
  }
  
  return user
}
```

## Password Hashing

```typescript
// server/utils/hash.ts
import { hash, compare } from 'bcryptjs'

export const hashPassword = async (password: string) => {
  return await hash(password, 12)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await compare(password, hashedPassword)
}
```

## Rate Limiting

```typescript
// server/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})
```

## Security Headers

```typescript
// server/middleware/security.ts
import helmet from 'helmet'
import { RequestHandler } from 'express'

export const securityMiddleware: RequestHandler[] = [
  // Basic security headers
  helmet(),
  
  // Content Security Policy
  (req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://your-api-domain.com;"
    )
    next()
  },
  
  // Prevent clickjacking
  (req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY')
    next()
  },
  
  // Enable HSTS in production
  (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    }
    next()
  },
]
```

## Two-Factor Authentication (2FA)

### Setup with Speakeasy

```typescript
// server/services/twoFactorAuth.ts
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { prisma } from '../lib/prisma'

export const generateSecret = (email: string) => {
  const secret = speakeasy.generateSecret({
    name: `Your App (${email})`,
    issuer: 'Your App Name',
  })
  
  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  }
}

export const generateQRCode = async (otpauthUrl: string) => {
  try {
    return await QRCode.toDataURL(otpauthUrl)
  } catch (error) {
    console.error('Error generating QR code:', error)
    return null
  }
}

export const verifyToken = (token: string, secret: string) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Allow 30 seconds before/after current time
  })
}

// Save 2FA secret to user
export const enable2FA = async (userId: string, secret: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret, twoFactorEnabled: true },
  })
}

// Verify 2FA token
export const verifyTwoFactorToken = async (userId: string, token: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true },
  })
  
  if (!user?.twoFactorSecret) {
    throw new Error('2FA not set up for this user')
  }
  
  return verifyToken(token, user.twoFactorSecret)
}
```

## API Key Authentication

### Generate API Keys

```typescript
// server/services/apiKey.ts
import { randomBytes } from 'crypto'
import { prisma } from '../lib/prisma'

export const generateApiKey = () => {
  return randomBytes(32).toString('hex')
}

export const hashApiKey = (apiKey: string) => {
  // Simple hash for demonstration - use a proper hashing function in production
  return require('crypto').createHash('sha256').update(apiKey).digest('hex')
}

export const validateApiKey = async (apiKey: string) => {
  const hashedKey = hashApiKey(apiKey)
  
  const key = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    include: { user: true },
  })
  
  if (!key || key.revoked) {
    return null
  }
  
  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsed: new Date() },
  })
  
  return key.user
}
```

## Role-Based Access Control (RBAC)

### Define Roles and Permissions

```typescript
// server/types/roles.ts
export enum Role {
  USER = 'USER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

export const Permissions = {
  // User permissions
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Content permissions
  CONTENT_CREATE: 'content:create',
  CONTENT_READ: 'content:read',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  
  // Admin permissions
  ADMIN_ACCESS: 'admin:access',
}

export const RolePermissions: Record<Role, string[]> = {
  [Role.USER]: [
    Permissions.USER_READ,
    Permissions.USER_UPDATE,
    Permissions.CONTENT_READ,
  ],
  [Role.EDITOR]: [
    ...RolePermissions[Role.USER],
    Permissions.CONTENT_CREATE,
    Permissions.CONTENT_UPDATE,
  ],
  [Role.ADMIN]: [
    ...RolePermissions[Role.EDITOR],
    Permissions.USER_DELETE,
    Permissions.CONTENT_DELETE,
    Permissions.ADMIN_ACCESS,
  ],
}

export const hasPermission = (userRole: Role, requiredPermission: string) => {
  return RolePermissions[userRole]?.includes(requiredPermission) || false
}
```

### Protect Routes with RBAC

```typescript
// server/middleware/rbac.ts
import { NextFunction, Request, Response } from 'express'
import { Permission, hasPermission, Role } from '../types/roles'

export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming you've attached the user to the request in your auth middleware
    const userRole = req.user?.role as Role
    
    if (!userRole || !hasPermission(userRole, permission)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
    }
    
    next()
  }
}

// Usage in routes
router.get(
  '/admin/users',
  authenticate, // Your auth middleware
  requirePermission(Permissions.USER_READ),
  userController.getAllUsers
)
```

## Session Management

### Track Active Sessions

```typescript
// server/models/Session.ts
import { prisma } from '../lib/prisma'

export const createSession = async (userId: string, userAgent?: string, ipAddress?: string) => {
  return await prisma.session.create({
    data: {
      userId,
      userAgent,
      ipAddress,
      valid: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })
}

export const invalidateSession = async (sessionId: string) => {
  return await prisma.session.update({
    where: { id: sessionId },
    data: { valid: false, expiresAt: new Date() },
  })
}

export const invalidateAllSessions = async (userId: string, excludeSessionId?: string) => {
  const where: any = { userId, valid: true }
  
  if (excludeSessionId) {
    where.NOT = { id: excludeSessionId }
  }
  
  return await prisma.session.updateMany({
    where,
    data: { valid: false, expiresAt: new Date() },
  })
}

export const getActiveSessions = async (userId: string) => {
  return await prisma.session.findMany({
    where: {
      userId,
      valid: true,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })
}
```

## Rate Limiting for Authentication Endpoints

```typescript
// server/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'

// Rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by IP + username for login attempts
    return req.ip + ':' + (req.body.email || req.body.username || 'unknown')
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later',
    })
  },
})

// Rate limiting for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by API key or IP
    return req.headers['x-api-key']?.toString() || req.ip || 'unknown'
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
    })
  },
})

// Dynamic rate limiting based on user status
export const dynamicRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Apply different rate limits based on user status
  const isAuthenticated = !!req.user
  const isAdmin = req.user?.role === 'ADMIN'
  
  // Higher limits for authenticated users, even higher for admins
  const max = isAdmin ? 1000 : isAuthenticated ? 200 : 100
  
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max,
    standardHeaders: true,
    legacyHeaders: false,
  })(req, res, next)
}
```

## Security Best Practices

1. **Use HTTPS** in production to encrypt all traffic
2. **Set Secure and HttpOnly flags** on cookies
3. **Implement CSRF protection** for state-changing operations
4. **Use secure password hashing** (bcrypt, Argon2, PBKDF2)
5. **Validate and sanitize all user input**
6. **Implement proper CORS** configuration
7. **Set security headers** (helmet.js can help with this)
8. **Rate limit authentication endpoints** to prevent brute force attacks
9. **Log authentication attempts** for security monitoring
10. **Regularly rotate secrets** (JWT secrets, API keys, etc.)
11. **Implement account lockout** after failed attempts
12. **Use secure password policies** (minimum length, complexity requirements)
13. **Implement password reset securely** with expiring tokens
14. **Monitor for suspicious activity** (login from new devices/locations)
15. **Keep dependencies updated** to patch security vulnerabilities

## Testing Authentication

### Unit Tests

```typescript
// __tests__/auth.test.ts
import { generateTokens, verifyToken } from '../../server/services/jwt'

describe('JWT Service', () => {
  const testUser = { id: '1', email: 'test@example.com', role: 'USER' }
  
  test('should generate and verify a token', () => {
    const { accessToken } = generateTokens(testUser)
    const payload = verifyToken(accessToken)
    
    expect(payload).toBeDefined()
    expect(payload?.userId).toBe(testUser.id)
    expect(payload?.email).toBe(testUser.email)
  })
  
  test('should return null for invalid token', () => {
    const payload = verifyToken('invalid.token.here')
    expect(payload).toBeNull()
  })
})
```

### Integration Tests

```typescript
// __tests__/auth.integration.test.ts
describe('Auth API', () => {
  let app: Express
  
  beforeAll(async () => {
    // Set up test database and app
    app = await createTestApp()
  })
  
  afterAll(async () => {
    // Clean up test database
    await resetTestDatabase()
  })
  
  test('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User',
    }
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201)
    
    expect(response.body).toHaveProperty('user')
    expect(response.body.user.email).toBe(userData.email)
    expect(response.body).toHaveProperty('accessToken')
  })
  
  test('should not register with existing email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User',
    }
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400)
    
    expect(response.body.message).toContain('already exists')
  })
  
  test('should login with correct credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'SecurePass123!',
    }
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200)
    
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
  })
  
  test('should not login with incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .expect(401)
    
    expect(response.body.message).toContain('Invalid credentials')
  })
})
```

## Conclusion

This guide covers the essential aspects of authentication and authorization for your application. Remember to:

1. **Choose the right authentication strategy** for your use case
2. **Implement proper security measures** to protect user data
3. **Follow best practices** for password hashing and token management
4. **Implement rate limiting** to prevent abuse
5. **Test thoroughly** to ensure security and reliability
6. **Stay updated** with the latest security advisories and update your dependencies regularly

For production applications, consider using established authentication services like:
- Auth0
- Firebase Authentication
- AWS Cognito
- Okta

These services can help reduce the security burden and provide additional features like multi-factor authentication, social logins, and more.
