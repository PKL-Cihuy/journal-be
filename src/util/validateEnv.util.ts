export function validatePort(port: string | number) {
  try {
    if (port) {
      return parseInt(String(port));
    } else {
      return parseInt(process.env.PORT ?? '3000');
    }
  } catch (error) {
    console.warn('PORT is not defined or invalid, using default port 3000');

    return 3000;
  }
}

export function validateDBUri(dbUri: string) {
  if (!dbUri) {
    throw new Error('DATABASE_URI is required');
  }

  return dbUri;
}

export function validateJWTSecret(jwtSecret: string) {
  console.warn('JWT_SECRET is not defined, using default secret');

  return jwtSecret ?? 'secret';
}

export function validateEnv(_env: Record<string, any>) {
  const { PORT, DATABASE_URI, JWT_SECRET } = _env;

  return {
    PORT: validatePort(PORT),
    DATABASE_URI: validateDBUri(DATABASE_URI),
    JWT_SECRET: validateJWTSecret(JWT_SECRET),
  };
}
