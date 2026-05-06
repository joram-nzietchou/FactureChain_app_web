const redis = require('redis');
require('dotenv').config();

let redisClient = null;

const initRedis = async () => {
  // Désactiver Redis complètement
  console.log('⚠️ Redis désactivé (optionnel pour le développement)');
  return null;
  
  /* Code original commenté
  if (process.env.NODE_ENV === 'test') {
    return null;
  }
  
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  redisClient.on('error', (err) => console.error('Redis Error:', err));
  redisClient.on('connect', () => console.log('✅ Redis connecté'));
  
  await redisClient.connect();
  return redisClient;
  */
};

const getRedis = () => redisClient;

module.exports = { initRedis, getRedis };