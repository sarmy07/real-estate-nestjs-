import { Booking } from 'src/booking/entities/booking.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Inquiry } from 'src/inquiries/entities/inquiry.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum propertyType {
  RENT = 'rent',
  SALE = 'sale',
}

export enum propertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented',
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: propertyType,
  })
  type: propertyType;

  @Column({
    type: 'enum',
    enum: propertyStatus,
    default: propertyStatus.AVAILABLE,
  })
  status: propertyStatus;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  price: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  images: string[];

  @Column('text', { array: true, nullable: true })
  imagesPublicId: string[];

  @ManyToOne(() => User, (u) => u.properties, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Favorite, (f) => f.property)
  favorites: Favorite[];

  @OneToMany(() => Inquiry, (i) => i.property)
  inquiries: Inquiry[];

  @OneToMany(() => Booking, (b) => b.property)
  bookings: Booking[];

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
