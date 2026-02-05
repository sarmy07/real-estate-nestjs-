import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/provider/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly hashingProvider: HashingProvider,
  ) {}
  async create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return await this.repo.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findUserByEmail(email: string) {
    return await this.repo.findOne({
      where: {
        email,
      },
    });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: {
        id,
      },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const hashed = refreshToken
      ? await this.hashingProvider.hashPassword(refreshToken)
      : null;

    await this.repo.update(userId, { refreshToken: hashed });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
