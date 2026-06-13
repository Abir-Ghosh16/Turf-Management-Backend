import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turf } from './entities/turf.entity';
import { CreateTurfDto } from './dto/create-turf.dto';
import { UpdateTurfDto } from './dto/update-turf.dto';

@Injectable()
export class TurfsService {
  constructor(
    @InjectRepository(Turf)
    private turfsRepository: Repository<Turf>,
  ) {}

  async create(createTurfDto: CreateTurfDto): Promise<Turf> {
    const turf = this.turfsRepository.create(createTurfDto);
    return this.turfsRepository.save(turf);
  }

  async findAll(): Promise<Turf[]> {
    return this.turfsRepository.find();
  }

  async findOne(id: string): Promise<Turf> {
    const turf = await this.turfsRepository.findOne({ where: { id } });
    if (!turf) {
      throw new NotFoundException(`Turf with ID ${id} not found`);
    }
    return turf;
  }

  async update(id: string, updateTurfDto: UpdateTurfDto): Promise<Turf> {
    const turf = await this.findOne(id);
    Object.assign(turf, updateTurfDto);
    return this.turfsRepository.save(turf);
  }

  async remove(id: string): Promise<void> {
    const turf = await this.findOne(id);
    await this.turfsRepository.remove(turf);
  }

  async findAvailable(): Promise<Turf[]> {
    return this.turfsRepository.find({ where: { isAvailable: true } });
  }
}