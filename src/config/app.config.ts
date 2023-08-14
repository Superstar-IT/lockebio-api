import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 5000,
  apiPrefix: process.env.API_PREFIX || 'api/v1/',
  accessToken: process.env.ACCESS_TOKEN,
  pharmacyMockApiServer: process.env.PHARMACY_MOCK_API_SERVER,
  cacheTTL: parseInt(process.env.CACHE_TTL) || 60000,
}));
