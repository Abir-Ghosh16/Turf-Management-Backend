import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CUSTOMER)
  async getStats(@Request() req) {
    const { role, userId } = req.user;
    
    switch(role) {
      case UserRole.ADMIN:
        return this.dashboardService.getAdminStats();
      case UserRole.EMPLOYEE:
        return this.dashboardService.getEmployeeStats();
      case UserRole.CUSTOMER:
        return this.dashboardService.getCustomerStats(userId);
      default:
        return {};
    }
  }
}