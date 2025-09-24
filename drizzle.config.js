
export default {
  schema: "./schema.ts",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.process.env.DATABASE_URL,
  },
};
