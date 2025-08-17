import app from './app';
import config from './config/config';
import { checkRedisConnection } from './config/redis';
import { initCronJobs } from './cron';

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  // initCronJobs()
  checkRedisConnection().then((connected) => console.log("Connected To Redis", connected)).catch((error) => console.error("Failed to coonnect to Redis", error))
});