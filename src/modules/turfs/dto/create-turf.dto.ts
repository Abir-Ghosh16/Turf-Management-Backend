import { IsString, IsNumber, IsOptional, IsBoolean, IsTimeZone } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTurfDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  location!: string;

  @IsNumber()
  @Type(() => Number)
  pricePerHour!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsString()
  openTime!: string;

  @IsString()
  closeTime!: string;
}