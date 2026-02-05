import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, visitStatus } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PropertyService } from 'src/property/property.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
    private readonly propertyService: PropertyService,
  ) {}

  async requestVisit(dto: CreateBookingDto, user: User) {
    const property = await this.propertyService.findOne(dto.propertyId);
    if (!property || !property.isApproved) {
      throw new NotFoundException('property not avcailable');
    }

    const visit = this.repo.create({
      property,
      user,
      owner: property.owner,
      visitDateTime: new Date(dto.visitDateTime),
    });

    return await this.repo.save(visit);
  }

  async updateVisitStatus(id: number, status: visitStatus, user: User) {
    const visit = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        property: true,
      },
    });
    if (!visit) throw new NotFoundException('visit not found');

    if (visit.owner.id !== user.id) {
      throw new UnauthorizedException('you cannot perform this action');
    }

    // 🔒 IMPORTANT PART: prevent double booking
    if (status === visitStatus.APPROVED) {
      const conflict = await this.repo.findOne({
        where: {
          property: { id: visit.property.id },
          visitDateTime: visit.visitDateTime,
          status: visitStatus.APPROVED,
        },
      });

      if (conflict) {
        throw new UnauthorizedException(
          'This time slot has already been approved for this property',
        );
      }
    }
    visit.status = status;
    return await this.repo.save(visit);
  }

  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
