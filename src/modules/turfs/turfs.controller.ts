import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TurfsService } from './turfs.service';
import { CreateTurfDto } from './dto/create-turf.dto';
import { UpdateTurfDto } from './dto/update-turf.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('turfs')
export class TurfsController {
  constructor(private readonly turfsService: TurfsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createTurfDto: CreateTurfDto) {
    return this.turfsService.create(createTurfDto);
  }

  @Get()
  findAll() {
    return this.turfsService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.turfsService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turfsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateTurfDto: UpdateTurfDto) {
    return this.turfsService.update(id, updateTurfDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.turfsService.remove(id);
  }
}