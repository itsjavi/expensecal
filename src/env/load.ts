import { config } from 'dotenv'
import path from 'node:path'

const projectRoot = process.cwd()
const envName = process.env['APP_ENV'] || 'development'
const envFiles = [
  '.env',
  `.env.${envName}`,
  `.env.local`,
]

for (const file of envFiles) {
  config({ path: path.resolve(projectRoot, file) })
}
