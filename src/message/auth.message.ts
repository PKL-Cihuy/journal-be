export enum AuthMessage {
  LOGIN_SUCCESS = 'Login successful',
  ACCESS_TOKEN_SUCCESS = 'Access token acquired',

  NO_TOKEN_PROVIDED = 'No token provided',
  UNAUTHORIZED = 'Unauthorized',
  INVALID_JWT = 'Invalid JWT',
  ACCESS_TOKEN_EXPIRED = 'Access token expired',
}
