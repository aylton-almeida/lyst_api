import dotenv from 'dotenv';
dotenv.config();

export const envConfigs: any = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    define: {
      timestamp: true,
      underscore: true,
    },
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    define: {
      timestamp: true,
      underscore: true,
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      timestamp: true,
      underscore: true,
    },
  },
};
