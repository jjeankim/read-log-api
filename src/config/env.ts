import "dotenv/config";

const required = (key: string, value: string | undefined) => {
  if (!value) {
    throw new Error(`Missing required environment variable:${key}`);
  }
  return value;
};

export const env = {
  NODE_ENV : process.env.NODE_ENV || "development",

  DATABASE_URL : required("DATABASE_URL", process.env.DATABASE_URL),
  DIRECT_URL : process.env.DIRECT_URL,

  JWT_SECRET: required("JWT_SCRET", process.env.JWT_SECRET),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET",process.env.JWT_REFRESH_SECRET),
  PORT: Number(process.env.PORT) || 4000,
};
