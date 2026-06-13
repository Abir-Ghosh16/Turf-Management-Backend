import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('turfs')
export class Turf {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column()
  location!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerHour!: number;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @Column({ type: 'time' })
  openTime!: string;

  @Column({ type: 'time' })
  closeTime!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.turf)
  bookings!: Booking[];
}