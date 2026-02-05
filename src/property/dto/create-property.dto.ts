import {
  IsEnum,
  IsNumber,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';
import { propertyType } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsEnum(propertyType)
  type: propertyType;

  @IsOptional()
  images?: any;
}
