import { Pool } from 'pg';
import { mockPersona } from '../prompts/testAssembly'; // A fallback persona
import { LifeStatus } from '@lumen/shared';

export class UserService {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen'
        });
    }

    /**
     * Upserts a user record into the PostgreSQL `users` table based on Firebase login metadata.
     */
    async syncUser(uid: string, email?: string, displayName?: string, photoUrl?: string) {
        try {
            await this.pool.query(
                `INSERT INTO users (id, email, display_name, photo_url)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (id) DO UPDATE SET
                    email = EXCLUDED.email,
                    display_name = EXCLUDED.display_name,
                    photo_url = EXCLUDED.photo_url;`,
                [uid, email || null, displayName || null, photoUrl || null]
            );
            console.log(`[UserService] Successfully synced user ${uid}`);
        } catch (error) {
            console.error('[UserService] Error syncing user:', error);
            throw error;
        }
    }

    /**
     * Checks if the user has an active Lumen in the `lumens` table.
     * If not, it provisions a new default/unborn Lumen for them.
     */
    async ensureLumen(userId: string) {
        try {
            const checkQuery = await this.pool.query(
                `SELECT id, is_alive FROM lumens WHERE user_id = $1 ORDER BY last_updated DESC LIMIT 1`,
                [userId]
            );

            if (checkQuery.rows.length === 0) {
                // Initialize default state for a Lumen
                const initialState: Partial<LifeStatus> = {
                    isAlive: false,
                    age: 0,
                    lifespan: 24 * 60 * 60 * 1000,
                    name: "Unknown",
                    generation: 1,
                    persona: {
                        ...mockPersona,
                        core: {
                            name: "Unknown",
                            gender: "non-binary",
                            lifespan: 24 * 60 * 60 * 1000,
                            language: "en"
                        }
                    }
                };

                const insertQuery = await this.pool.query(
                    `INSERT INTO lumens (user_id, state, is_alive, last_updated)
                     VALUES ($1, $2, $3, $4) RETURNING id`,
                    [userId, JSON.stringify(initialState), false, Date.now()]
                );

                console.log(`[UserService] Provisioned new Lumen (${insertQuery.rows[0].id}) for user ${userId}`);
                return { lumenId: insertQuery.rows[0].id, state: initialState };
            }

            console.log(`[UserService] Lumen already exists for user ${userId}`);
            return { lumenId: checkQuery.rows[0].id, status: 'existing' };
        } catch (error) {
            console.error('[UserService] Error ensuring lumen:', error);
            throw error;
        }
    }
}
