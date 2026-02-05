import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: parseInt(process.env.JWT_EXPIRES ?? '1h'),
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN ?? '1d'),
}));
