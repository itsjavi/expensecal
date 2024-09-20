import 'server-only'

import 'dotenv/config'
import { z } from 'zod'

const envVarsSchema = z.object({
  APP_URL: z.string().url(),
  APP_ENV: z.enum(['development', 'production', 'preview']),
  // mailing
  // RESEND_API_KEY: z.string(),
  // db
  DATABASE_URL: z.string().url(),
  // redis cache
  // UPSTASH_REDIS_REST_URL: z.string().url(),
  // UPSTASH_REDIS_REST_TOKEN: z.string(),
  // auth
  // NEXTAUTH_URL: z.string().url(),
  AUTH_SECRET: z.string(),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
})

const envVars = envVarsSchema.parse(process.env)

export type EnvVars = z.infer<typeof envVarsSchema>

export default envVars
