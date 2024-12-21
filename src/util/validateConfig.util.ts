export function validatePort(port: string | number) {
  try {
    if (port) {
      return parseInt(String(port));
    } else {
      return parseInt(process.env.PORT ?? '3000');
    }
  } catch (error) {
    console.error(error);

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
  return jwtSecret ?? 'secret';
}

export function validateConfig(config: Record<string, any>) {
  const { PORT, DATABASE_URI, JWT_SECRET } = config;

  return {
    PORT: validatePort(PORT),
    DATABASE_URI: validateDBUri(DATABASE_URI),
    JWT_SECRET: validateJWTSecret(JWT_SECRET),
  };
}
