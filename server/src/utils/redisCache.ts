
import redis from "../config/redis";

// Create or Update
export async function redisSet(key: string, value: any, ttlSeconds = 60) {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds) {
        await redis.set(key, stringValue, "EX", ttlSeconds);
    } else {
        await redis.set(key, stringValue);
    }
}

// Read
export async function redisGet<T = any>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
}

// Delete
export async function redisDel(key: string) {
    await redis.del(key);
}

// Check if exists
export async function redisExists(key: string): Promise<boolean> {
    const exists = await redis.exists(key);
    return exists === 1;
}
