import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen'
});

async function resetSchema() {
    const client = await pool.connect();
    try {
        console.log("Dropping memories table to reset schema...");
        await client.query("DROP TABLE IF EXISTS memories");
        console.log("✅ Table dropped.");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        client.release();
        await pool.end();
    }
}

resetSchema();
