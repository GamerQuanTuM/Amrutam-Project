import Redis from "ioredis";
import env from "./env.config";

const redis = new Redis({
  host: env.REDIS_HOST || "127.0.0.1",
  port: Number(env.REDIS_PORT) || 6379,
  password: env.REDIS_PASSWORD || undefined,
  username: env.REDIS_USERNAME || undefined,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export async function checkRedisConnection(): Promise<boolean> {
  try {
    const pong = await redis.ping();
    return pong === "PONG";
  } catch (error) {
    console.error("❌ Redis connection check failed:", error);
    return false;
  }
}

export default redis;




