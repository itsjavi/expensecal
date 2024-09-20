import "@/env/load"

import { createDrizzlePostgresClient } from "@/lib/db"
import { migrate } from 'drizzle-orm/postgres-js/migrator'

const [connection, db] = createDrizzlePostgresClient()

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: "./drizzle" })

// Don't forget to close the connection, otherwise the script will hang
await connection.end()

//----

// import * as schema from '@/domain/core/tables'
// import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js'
// import { migrate } from 'drizzle-orm/postgres-js/migrator'
// import postgres from 'postgres'

// // To use Neon from a non-serverless environment, you can use the PostgresJS driver,
// // as described in Neon’s official nodejs docs.

// const dbUrl = process.env.DATABASE_URL
// if (!dbUrl) {
//   throw new Error('[scripts/drizzle-migrate] DATABASE_URL is required')
// }

// const sql = postgres(dbUrl, { max: 1 })
// const db = drizzlePg(sql, { schema })

// await sql`select 1`
// await migrate(db, { migrationsFolder: `${process.cwd()}/drizzle` })
// await sql.end({
//   timeout: 3,
// })
// process.exit(0)
