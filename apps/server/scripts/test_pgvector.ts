import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen'
});

async function testGenericVector() {
    const client = await pool.connect();
    try {
        console.log("Ensuring vector extension...");
        await client.query("CREATE EXTENSION IF NOT EXISTS vector");

        const ext = await client.query("SELECT * FROM pg_extension WHERE extname = 'vector'");
        console.log("Extension installed:", (ext.rowCount || 0) > 0);

        await client.query("CREATE TABLE IF NOT EXISTS test_items (id SERIAL PRIMARY KEY, embedding vector(3));");

        // Clear table
        await client.query("DELETE FROM test_items");

        console.log("Inserting vector [1,1,1]...");
        await client.query("INSERT INTO test_items (embedding) VALUES ('[1,1,1]')");

        console.log("Querying nearest to [1,1,1]...");
        const res = await client.query("SELECT * FROM test_items ORDER BY embedding <=> '[1,1,1]' LIMIT 1");
        console.log("Result:", res.rows);

    } catch (e) {
        console.error("Error:", e);
    } finally {
        client.release();
        pool.end();
    }
}

testGenericVector().catch(console.error);
