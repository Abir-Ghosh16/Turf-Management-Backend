import { IsString, IsDateString, IsTimeZone, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  turfId!: string;

  @IsDateString()
  bookingDate!: string;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsOptional()
  @IsString()
  paymentId?: string;

  
}