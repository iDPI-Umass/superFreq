import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
const PRIVATE_DATABASE_URL = "postgres://postgres.rhibvhnquyqpnvchwuvm:HXEqX2rrrPlIxmFi@aws-0-us-east-1.pooler.supabase.com:6543/postgres";
const { Pool } = pg;
const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: PRIVATE_DATABASE_URL
      // database: 'postgres',
      // host: 'aws-0-us-east-1.pooler.supabase.com',
      // user: 'postgres.rhibvhnquyqpnvchwuvm',
      // port: 6543,
      // password: PRIVATE_DATABASE_PASSWORD,
      // max: 10,
    })
  })
});
export {
  db as d
};
