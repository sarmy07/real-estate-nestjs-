export abstract class HashingProvider {
  abstract hashPassword(password: string);

  abstract comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
