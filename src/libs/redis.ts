import Redis from 'ioredis';
import { isNil } from 'lodash';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  host: process.env.REDIS_HOST || undefined,
  port: !isNil(process.env.REDIS_PORT) ? Number.parseInt(process.env.REDIS_PORT) : undefined,
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  db: !isNil(process.env.REDIS_DB) ? Number.parseInt(process.env.REDIS_DB) : undefined,
  keyPrefix: process.env.REDIS_KEYPREFIX || 'nextapp:',
});
