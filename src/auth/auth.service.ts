import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
import { SigninDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly userService: UsersService,
    private readonly hahsingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userService.findUserByEmail(dto.email);
    if (existingUser)
      throw new BadRequestException(`${dto.email} already in use`);

    const hashed = await this.hahsingProvider.hashPassword(dto.password);

    const newUser = await this.userService.create({
      ...dto,
      password: hashed,
    });

    const { password, ...result } = newUser;
    return {
      user: result,
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException(`${dto.email} does not exist`);
    }

    const valid = await this.hahsingProvider.comparePassword(
      dto.password,
      user.password,
    );
    if (!valid) {
      throw new BadRequestException('invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);
    await this.userService.updateRefreshToken(user.id, refreshToken);

    const { password, ...result } = user;

    return {
      user: result,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    return await this.userService.updateRefreshToken(userId, null);
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.authConfiguration.secret,
      });

      const user = await this.userService.findOne(payload.id);
      if (!user) throw new UnauthorizedException('invalid refresh token');

      const valid = await this.hahsingProvider.comparePassword(
        user.refreshToken,
        dto.refreshToken,
      );
      if (!valid) throw new UnauthorizedException('invalid refresh token');

      const tokens = await this.generateTokens(user);
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new Error();
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
