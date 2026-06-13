import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { TurfsService } from '../turfs/turfs.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private turfsService: TurfsService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const turf = await this.turfsService.findOne(createBookingDto.turfId);
    
    // Check if turf is available
    if (!turf.isAvailable) {
      throw new ForbiddenException('Turf is not available for booking');
    }

    // Calculate hours
    const hours = this.calculateHours(createBookingDto.startTime, createBookingDto.endTime);
    const totalAmount = turf.pricePerHour * hours;

    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      userId,
      totalAmount,
      status: BookingStatus.PENDING,
    });
    
    return this.bookingsRepository.save(booking);
  }

  async findAll(query?: any): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: query,
      relations: {user : true, turf: true},
      order: { createdAt: 'DESC' },
    });
  }

  async findUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { userId },
      relations: {turf: true},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: {user : true, turf: true},
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: string, status: BookingStatus, userRole?: string): Promise<Booking> {
    const booking = await this.findOne(id);
    
    // Only admin/employee can update status, customer can only cancel if pending
    if (userRole === 'customer' && status !== BookingStatus.CANCELLED) {
      throw new ForbiddenException('Customers can only cancel bookings');
    }
    
    if (userRole === 'customer' && booking.status !== BookingStatus.PENDING) {
      throw new ForbiddenException('Only pending bookings can be cancelled');
    }

    booking.status = status;
    return this.bookingsRepository.save(booking);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }

  private calculateHours(startTime: string, endTime: string): number {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const minutes = parseInt(startTime.split(':')[1]) || 0;
    const endMinutes = parseInt(endTime.split(':')[1]) || 0;
    
    let hours = end - start;
    if (endMinutes > minutes) {
      hours += (endMinutes - minutes) / 60;
    }
    
    return hours;
  }
}