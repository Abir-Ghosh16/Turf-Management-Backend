import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { BookingsModule } from '../bookings/bookings.module';
import { UsersModule } from '../users/users.module';
import { TurfsModule } from '../turfs/turfs.module';

@Module({
  imports: [BookingsModule, UsersModule, TurfsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}