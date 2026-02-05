import { Property } from 'src/property/entities/property.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
// @Unique(['user', 'property'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.favourites, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Property, (p) => p.favorites, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;
}
