import { Property } from 'src/property/entities/property.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

export enum visitStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RESCHEDULED = 'rescheduled',
  CANCELLED = 'cancelled',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, (p) => p.bookings, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @ManyToOne(() => User, (u) => u.sentBookings, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => User, (u) => u.receivedBookings, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @Column({
    type: 'enum',
    enum: visitStatus,
    default: visitStatus.PENDING,
  })
  status: visitStatus;

  @Column({
    type: 'timestamp',
  })
  visitDateTime: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;
}
