import { Property } from 'src/property/entities/property.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum InquiryStatus {
  'PENDING' = 'pending',
  'RESPONDED' = 'responded',
}

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  property: Property;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  receiver: User; //agent or owner

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: InquiryStatus,
    default: InquiryStatus.PENDING,
  })
  status: InquiryStatus;

  @CreateDateColumn()
  createdAt: Date;
}
