import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry, InquiryStatus } from './entities/inquiry.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PropertyService } from 'src/property/property.service';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly repo: Repository<Inquiry>,
    private readonly propertyService: PropertyService,
  ) {}

  async create(dto: CreateInquiryDto, propertyId: number, user: User) {
    const property = await this.propertyService.findOne(propertyId);
    if (!property) throw new NotFoundException('property not found');

    if (property.owner.id === user.id) {
      throw new BadRequestException(
        'you cannot make inquiry on your own property',
      );
    }

    const inquiry = this.repo.create({
      property,
      sender: user,
      receiver: property.owner,
      message: dto.message,
    });
    await this.repo.save(inquiry);
    return { message: 'You have made an inquiry' };
  }

  async getMySentInquiries(user: User) {
    return await this.repo.findOne({
      where: {
        sender: {
          id: user.id,
        },
      },
      relations: ['property'],
    });
  }

  async getMyReceivedInquiries(user: User) {
    return await this.repo.findOne({
      where: {
        receiver: {
          id: user.id,
        },
      },
      relations: ['property'],
    });
  }

  async markedAsRespond(propertyId: number, user: User) {
    const inquiry = await this.findOne(propertyId);
    if (!inquiry) throw new NotFoundException('inquiry not found');

    if (inquiry.receiver.id !== user.id) {
      throw new UnauthorizedException();
    }

    inquiry.status = InquiryStatus.RESPONDED;
    return await this.repo.save(inquiry);
  }

  findAll() {
    return `This action returns all inquiries`;
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateInquiryDto: UpdateInquiryDto) {
    return `This action updates a #${id} inquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiry`;
  }
}
