import { Pool } from 'pg';
import { LifeStatus } from '@lumen/shared';
import { mockPersona } from '../prompts/testAssembly';

export class StateSyncService {
    private pool: Pool;
    private stateCache: Map<string, LifeStatus> = new Map();
    private dirtyFlags: Map<string, boolean> = new Map();

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen'
        });

        // Background flush interval: every 10 seconds
        setInterval(() => {
            this.flushAllDirtyStates().catch(console.error);
        }, 10000);
    }

    /**
     * Creates a fallback generic Lumen state.
     */
    private createInitialState(): LifeStatus {
        return {
            isAlive: false,
            birthTime: Date.now(),
            age: 0,
            lifespan: 24 * 60 * 60 * 1000,
            generation: 1,
            name: "Unknown",
            gender: "non-binary",
            language: "en",
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
    }

    /**
     * Loads the Lumen state for a specific user.
     * Checks cache first. If not in cache, reads from PostgreSQL.
     */
    public async loadUserState(userId: string): Promise<LifeStatus> {
        if (this.stateCache.has(userId)) {
            return this.stateCache.get(userId)!;
        }

        try {
            const result = await this.pool.query(
                `SELECT id, state FROM lumens WHERE user_id = $1 ORDER BY last_updated DESC LIMIT 1`,
                [userId]
            );

            let state: LifeStatus;

            if (result.rows.length === 0) {
                // Return a default state if not found (UserService should have created it, but as a fallback)
                state = this.createInitialState();
            } else {
                state = result.rows[0].state as LifeStatus;
                state.id = result.rows[0].id.toString();
                // Ensure required fields
                if (!state.birthTime) state.birthTime = Date.now();
                if (typeof state.age !== 'number') state.age = 0;
            }

            this.stateCache.set(userId, state);
            this.dirtyFlags.set(userId, false);
            return state;
        } catch (error) {
            console.error(`[StateSyncService] Error loading state for user ${userId}:`, error);
            const fallback = this.createInitialState();
            this.stateCache.set(userId, fallback);
            return fallback;
        }
    }

    /**
     * Updates the memory cache for a specific user and marks it dirty.
     */
    public saveUserState(userId: string, state: LifeStatus): void {
        this.stateCache.set(userId, state);
        this.dirtyFlags.set(userId, true);
    }

    /**
     * Forces an immediate DB write for a specific user's state.
     */
    public async flushState(userId: string): Promise<void> {
        const isDirty = this.dirtyFlags.get(userId);
        if (!isDirty) return;

        const state = this.stateCache.get(userId);
        if (!state) return;

        try {
            // Upsert based on tracking the latest lumen per user or generic logic:
            // Since a user usually has one active lumen, update the latest one.
            await this.pool.query(
                `UPDATE lumens 
                 SET state = $1, is_alive = $2, last_updated = $3
                 WHERE user_id = $4 AND id = (
                     SELECT id FROM lumens WHERE user_id = $4 ORDER BY last_updated DESC LIMIT 1
                 )`,
                [JSON.stringify(state), state.isAlive, Date.now(), userId]
            );

            // Note: If no row matched (e.g. they don't have a lumen yet despite UserService),
            // this UPDATE does nothing. UserService ensureLumen guarantees existence on login,
            // so we assume the row is there.

            this.dirtyFlags.set(userId, false);
            // console.log(`[StateSyncService] Flushed state for user ${userId} to DB`);
        } catch (error) {
            console.error(`[StateSyncService] Error flushing state for user ${userId}:`, error);
        }
    }

    /**
     * Sweeps all connected dirty states into Postgres.
     */
    private async flushAllDirtyStates(): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const [userId, isDirty] of this.dirtyFlags.entries()) {
            if (isDirty) {
                promises.push(this.flushState(userId));
            }
        }
        await Promise.allSettled(promises);
    }

    /**
     * Retrieves the state from memory cache synchronously.
     * Undefined if not loaded, so always load before tick.
     */
    public getStateFromCache(userId: string): LifeStatus | undefined {
        return this.stateCache.get(userId);
    }

    /**
     * Cleanup on disconnect: flush then remove
     */
    public async unloadUser(userId: string): Promise<void> {
        await this.flushState(userId);
        this.stateCache.delete(userId);
        this.dirtyFlags.delete(userId);
    }
}
