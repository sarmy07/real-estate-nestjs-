import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  propertyId: number;

  @IsDateString()
  visitDateTime: string;
}
