import { Pool } from '@neondatabase/serverless'
import { drizzle as drizzleNeonDriver } from 'drizzle-orm/neon-serverless'
import { drizzle as drizzlePostgresDriver } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { isDevelopmentEnv } from '@/env'
import envVars from '@/env/vars'
import * as schema from '@/models/schema'
import { type Column, sql } from 'drizzle-orm'
import { singleton } from './utils'

function createPostgresConnection() {
  return postgres(envVars.DATABASE_URL, { max: 100 })
}

function createNeonPooledConnection() {
  return new Pool({
    connectionString: envVars.DATABASE_URL,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 3000,
  })
}

export function createDrizzlePostgresClient(): [postgres.Sql<{}>, ReturnType<typeof drizzlePostgresDriver>] {
  const conn = createPostgresConnection()
  return [
    conn,
    drizzlePostgresDriver(conn, {
      schema,
      // , logger: true
    }),
  ]
}

export function createDrizzleNeonPooledClient(): [Pool, ReturnType<typeof drizzleNeonDriver>] {
  const conn = createNeonPooledConnection()
  return [conn, drizzleNeonDriver(conn, { schema })]
}

function _createDrizzleClient() {
  if (isDevelopmentEnv()) {
    return createDrizzlePostgresClient()
  }
  return createDrizzleNeonPooledClient()
}

const [dbConnection, db] = singleton('drizzle_db', _createDrizzleClient)

export { db, dbConnection, sql }

export function jsonbSet__unsafe(field: Column, path: string, value: string | number) {
  const formattedPath = `'{${path.replace(/\./g, ',')}}'`
  const formattedValue = `'${value}'`
  const query = sql.raw(`jsonb_set(${field.name}, ${formattedPath}, ${formattedValue}::jsonb)`)
  console.log(query.getSQL())
  return query
}
