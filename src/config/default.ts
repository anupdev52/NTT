// config/default.ts

import { ConfigObject } from '@nestjs/config';

const config: ConfigObject = {
  mongoUri: process.env.MONGO_URI || 'your-mongo-URL',
  anotherVariable: process.env.ANOTHER_VARIABLE || 'default-value',
};

export default config;
