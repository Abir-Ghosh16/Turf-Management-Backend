import { Injectable } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { UsersService } from '../users/users.service';
import { TurfsService } from '../turfs/turfs.service';
import { BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class DashboardService {
  constructor(
    private bookingsService: BookingsService,
    private usersService: UsersService,
    private turfsService: TurfsService,
  ) {}

  async getAdminStats() {
    const [allBookings, totalUsers, totalTurfs] = await Promise.all([
      this.bookingsService.findAll(),
      this.usersService.findAll(),
      this.turfsService.findAll(),
    ]);

    const recentBookings = await this.bookingsService.findAll({ take: 10 });

    return {
      totalBookings: allBookings.length,
      totalUsers: totalUsers.length,
      totalTurfs: totalTurfs.length,
      totalRevenue: allBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0),
      recentBookings: recentBookings.slice(0, 10),
    };
  }

  async getEmployeeStats() {
    const bookings = await this.bookingsService.findAll({ status: BookingStatus.CONFIRMED });
    const todayBookings = bookings.filter(b => 
      new Date(b.bookingDate).toDateString() === new Date().toDateString()
    );

    return {
      todayBookings: todayBookings.length,
      totalConfirmedBookings: bookings.length,
      upcomingBookings: bookings.filter(b => new Date(b.bookingDate) > new Date()).length,
    };
  }

  async getCustomerStats(userId: string) {
    const bookings = await this.bookingsService.findUserBookings(userId);
    
    return {
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter(b => 
        new Date(b.bookingDate) > new Date() && b.status !== BookingStatus.CANCELLED
      ).length,
      completedBookings: bookings.filter(b => b.status === BookingStatus.COMPLETED).length,
      totalSpent: bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0),
    };
  }
}