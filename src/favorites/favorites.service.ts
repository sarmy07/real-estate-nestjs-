import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { PropertyService } from 'src/property/property.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,
    private readonly propertyService: PropertyService,
    private readonly userService: UsersService,
  ) {}

  async toggleFavorite(userId: number, propertyId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('user not found');

    const property = await this.propertyService.findOne(propertyId);
    if (!property) throw new NotFoundException('property not found');

    const existing = await this.repo.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });

    if (existing) {
      await this.repo.remove(existing);
      return await this.repo.save(existing);
    }

    const newFavorite = await this.repo.create({
      user,
      property,
    });
    await this.repo.save(newFavorite);
    return { message: 'proeprty added to favorites' };
  }

  async fetchUserFavorites(userId: number) {
    return await this.repo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        property: true,
      },
    });
  }

  create(createFavoriteDto: CreateFavoriteDto) {
    return 'This action adds a new favorite';
  }

  findAll() {
    return `This action returns all favorites`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favorite`;
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  remove(id: number) {
    return `This action removes a #${id} favorite`;
  }
}
