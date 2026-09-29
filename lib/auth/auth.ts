import 'server-only'

import { eq } from 'drizzle-orm'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { twoFactor } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { getDatabase } from '@/db/client'
import * as databaseSchema from '@/db/schema'
import { sessions, users } from '@/db/schema'
import { sendPasswordResetEmail } from '@/lib/auth/email'
import { recordAuthAuditEvent } from '@/lib/auth/audit'
import { AUTH_COOKIE_PREFIX, authCookieAttributes } from '@/lib/auth/cookie-policy'
import { ADMIN_ROLES } from '@/lib/auth/permissions'
import { AUTH_BASE_URL, AUTH_SECRET } from '@/lib/auth/runtime-config'

const isProduction = process.env.NODE_ENV === 'production'

export const auth = betterAuth({
  appName: 'KODİL Yönetim',
  baseURL: AUTH_BASE_URL,
  secret: AUTH_SECRET,
  database: drizzleAdapter(getDatabase({ allowUnconfigured: true }), {
    provider: 'mysql',
    schema: {
      ...databaseSchema,
      user: databaseSchema.users,
      session: databaseSchema.sessions,
      account: databaseSchema.accounts,
      verification: databaseSchema.verifications,
      twoFactor: databaseSchema.twoFactors,
      rateLimit: databaseSchema.authRateLimits,
    },
  }),
  trustedOrigins: [AUTH_BASE_URL],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 30 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({
        email: user.email,
        displayName: user.name,
        resetUrl: url,
      }).catch((error) => {
        console.error('Parola sıfırlama e-postası gönderilemedi.', error)
      })
    },
    onPasswordReset: async ({ user }) => {
      await recordAuthAuditEvent({
        actorId: user.id,
        action: 'auth.password_reset',
        entityType: 'user',
        entityId: user.id,
      })
    },
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  user: {
    fields: {
      name: 'displayName',
    },
    additionalFields: {
      role: {
        type: [...ADMIN_ROLES],
        required: true,
        defaultValue: 'editor',
        input: false,
      },
      status: {
        type: ['invited', 'active', 'suspended'],
        required: true,
        defaultValue: 'invited',
        input: false,
      },
      lastLoginAt: {
        type: 'date',
        required: false,
        input: false,
        returned: false,
      },
    },
  },
  session: {
    expiresIn: 8 * 60 * 60,
    updateAge: 15 * 60,
    fields: {
      token: 'token',
    },
  },
  databaseHooks: {
    user: {
      update: {
        after: async (user, context) => {
          if (context?.path !== '/two-factor/verify-totp') return
          await getDatabase().delete(sessions).where(eq(sessions.userId, user.id))
          await recordAuthAuditEvent({
            actorId: user.id,
            action: 'auth.mfa_enrolled_sessions_revoked',
            entityType: 'user',
            entityId: user.id,
          })
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const [user] = await getDatabase()
            .select({ status: users.status })
            .from(users)
            .where(eq(users.id, session.userId))
            .limit(1)

          return user?.status === 'active'
        },
        after: async (session) => {
          await getDatabase()
            .update(users)
            .set({ lastLoginAt: new Date(), updatedAt: new Date() })
            .where(eq(users.id, session.userId))
          await recordAuthAuditEvent({
            actorId: session.userId,
            action: 'auth.session_created',
            entityType: 'session',
            entityId: session.id,
          })
        },
      },
      delete: {
        before: async (session) => {
          await recordAuthAuditEvent({
            actorId: session.userId,
            action: 'auth.session_deleted',
            entityType: 'session',
            entityId: session.id,
          })
        },
      },
    },
  },
  rateLimit: {
    enabled: true,
    storage: 'database',
    window: 60,
    max: 60,
    customRules: {
      '/sign-in/email': { window: 5 * 60, max: 5 },
      '/request-password-reset': { window: 15 * 60, max: 3 },
      '/two-factor/*': { window: 5 * 60, max: 5 },
    },
  },
  advanced: {
    cookiePrefix: AUTH_COOKIE_PREFIX,
    useSecureCookies: isProduction,
    disableCSRFCheck: false,
    disableOriginCheck: false,
    defaultCookieAttributes: authCookieAttributes(isProduction),
    database: {
      generateId: 'uuid',
    },
  },
  plugins: [
    twoFactor({
      issuer: 'KODİL Yönetim',
      twoFactorTable: 'twoFactor',
      twoFactorCookieMaxAge: 10 * 60,
      trustDeviceMaxAge: 8 * 60 * 60,
      accountLockout: {
        enabled: true,
        maxFailedAttempts: 5,
        durationSeconds: 15 * 60,
      },
      schema: {
        user: {
          fields: {
            twoFactorEnabled: 'mfaEnabled',
          },
        },
      },
    }),
    nextCookies(),
  ],
})

export type AuthSession = typeof auth.$Infer.Session
