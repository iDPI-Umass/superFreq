import type { DB } from 'kysely-codegen'
import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

import { PRIVATE_DATABASE_URL } from '$env/static/private'

const { Pool } = pg

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
        connectionString: PRIVATE_DATABASE_URL,
        // database: 'postgres',
        // host: 'aws-0-us-east-1.pooler.supabase.com',
        // user: 'postgres.rhibvhnquyqpnvchwuvm',
        // port: 6543,
        // password: PRIVATE_DATABASE_PASSWORD,
        // max: 10,
        }),
    }),
})

//jkhjkl