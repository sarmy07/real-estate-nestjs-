import { Exclude } from 'class-transformer';
import { Booking } from 'src/booking/entities/booking.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Inquiry } from 'src/inquiries/entities/inquiry.entity';
import { Property } from 'src/property/entities/property.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum userRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.USER,
  })
  role: userRole;

  @Column({
    nullable: true,
  })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => Property, (p) => p.owner)
  properties: Property[];

  @OneToMany(() => Favorite, (f) => f.user)
  favourites: Favorite[];

  @OneToMany(() => Inquiry, (i) => i.sender)
  sentInquiries: Inquiry;

  @OneToMany(() => Inquiry, (i) => i.receiver)
  receivedInquiries: Inquiry;

  @OneToMany(() => Booking, (b) => b.user)
  sentBookings: Booking[];

  @OneToMany(() => Booking, (b) => b.owner)
  receivedBookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
