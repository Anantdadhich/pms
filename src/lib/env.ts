/**
 * Environment variable validation
 * Import this at the top of your app to fail fast if required env vars are missing.
 */

function requireEnv(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(
            `❌ Missing required environment variable: ${name}\n` +
            `   Please check your .env file or deployment configuration.`
        )
    }
    return value
}

function optionalEnv(name: string, defaultValue: string): string {
    return process.env[name] || defaultValue
}

// Database
export const DATABASE_URL = requireEnv('DATABASE_URL')

// Clerk Authentication
export const CLERK_SECRET_KEY = requireEnv('CLERK_SECRET_KEY')
export const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = requireEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')

// Clerk URLs (with defaults)
export const NEXT_PUBLIC_CLERK_SIGN_IN_URL = optionalEnv('NEXT_PUBLIC_CLERK_SIGN_IN_URL', '/sign-in')
export const NEXT_PUBLIC_CLERK_SIGN_UP_URL = optionalEnv('NEXT_PUBLIC_CLERK_SIGN_UP_URL', '/sign-up')

// App
export const NODE_ENV = optionalEnv('NODE_ENV', 'development')
export const IS_PRODUCTION = NODE_ENV === 'production'
