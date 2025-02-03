import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

dotenv.config({
  path: '.env.local'
})

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set')
}

const migrationClient = postgres(process.env.POSTGRES_URL, { max: 1 })

const db = drizzle(migrationClient)

async function main() {
  try {
    console.log('⏳ Running migrations...')

    const start = Date.now()
    await migrate(db, { migrationsFolder: 'drizzle' })
    const end = Date.now()

    console.log(`✅ Migrations completed in ${end - start} ms`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error running migrations:')
    console.error(error)
    process.exit(1)
  }
}

main()
