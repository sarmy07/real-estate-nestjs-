import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

export class BcryptProvider extends HashingProvider {
  async hashPassword(password: string) {
    return await bcrypt.hash(password);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
