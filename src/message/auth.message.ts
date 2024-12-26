export enum AuthMessage {
  SUCCESS_LOGIN = 'Login successful',
  SUCCESS_ACCESS_TOKEN = 'Access token acquired',

  NO_TOKEN_PROVIDED = 'No token provided',
  UNAUTHORIZED = 'Unauthorized',
  INVALID_JWT = 'Invalid JWT',
  ACCESS_TOKEN_EXPIRED = 'Access token expired',
}
