import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name);
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreatePropertyDto,
    files: Express.Multer.File[],
    user: User,
  ) {
    if (user.role !== 'agent') {
      throw new UnauthorizedException('only agents can create properties');
    }

    let uploadedImages: { url: string; publicId: string }[] = [];
    if (files && files.length > 0) {
      try {
        const results = await this.cloudinaryService.uploadImages(files);
        uploadedImages = results.map((res) => ({
          url: res.secure_url,
          publicId: res.public_id,
        }));
      } catch (error) {
        throw new InternalServerErrorException('Image upload failed');
      }
    }

    const property = this.repo.create({
      images: uploadedImages,
      ...dto,
      owner: user,
      isApproved: false,
    });

    return await this.repo.save(property);
  }

  async approveDisapprove(propertyId: number, user: User) {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('only admin can approve properties');
    }

    const property = await this.findOne(propertyId);
    if (!property) {
      throw new NotFoundException('property not found');
    }

    property.isApproved = !property.isApproved;
    return await this.repo.save(property);
  }

  async remove(id: number, user: User) {
    if (user.role !== 'agent') {
      throw new UnauthorizedException('only agents can remove properties');
    }

    const property = await this.findOne(id);
    if (!property) throw new NotFoundException('property not found');

    if (property?.images.length) {
      try {
        await Promise.all(
          property.imagesPublicId.map((publicId) =>
            this.cloudinaryService.deleteFile(publicId),
          ),
        );
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to delete property images',
        );
      }
    }
    await this.repo.remove(property);
    return { message: 'property deleted' };
  }

  findAll() {
    return `This action returns all property`;
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkIsApproved() {
    this.logger.warn('checking for approved properties');

    const property = await this.repo.find({
      where: {
        isApproved: true,
      },
    });
    if (!property.length) {
      this.logger.warn('no property approved yet');
    }

    this.logger.debug(`found ${property.length} approved proeprties`);
  }
}
