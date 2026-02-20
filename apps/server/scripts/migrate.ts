import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen'
});

async function runMigrations() {
    const client = await pool.connect();
    try {
        console.log("Running schema migrations...");

        const sqlPath = path.join(__dirname, 'migrations', '01_multi_tenant_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await client.query(sql);
        console.log("✅ Schema migration 01_multi_tenant_schema.sql executed successfully.");
    } catch (e) {
        console.error("❌ Migration Error:", e);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
