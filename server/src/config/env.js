const dotenv = require('dotenv');
const joi = require('joi');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(5000),
  DATABASE_URL: joi.string().required().description('Database connection URL'),
  REDIS_URL: joi.string().required().description('Redis connection URL'),
  JWT_SECRET: joi.string().required().description('JWT secret key'),
  JWT_EXPIRES_IN: joi.string().default('1d').description('JWT token expiry period'),
  CLOUDINARY_CLOUD_NAME: joi.string().allow('').default(''),
  CLOUDINARY_API_KEY: joi.string().allow('').default(''),
  CLOUDINARY_API_SECRET: joi.string().allow('').default(''),
  SMTP_HOST: joi.string().allow(''),
  SMTP_PORT: joi.number().default(587),
  SMTP_USER: joi.string().allow(''),
  SMTP_PASSWORD: joi.string().allow(''),
  SMTP_FROM: joi.string().email().default('noreply@hrms.com'),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    url: envVars.DATABASE_URL,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USER,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.SMTP_FROM,
  },
};
