const Redis = require('ioredis');
const config = require('./env');
const logger = require('./logger');

let redisClient;

try {
  redisClient = new Redis(config.redis.url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redisClient.on('connect', () => {
    logger.info('Redis connected successfully.');
  });

  redisClient.on('error', (err) => {
    logger.warn(`Redis connection error: ${err.message}. Retrying...`);
  });
} catch (error) {
  logger.error('Failed to initialize Redis client:', error);
}

module.exports = redisClient;
