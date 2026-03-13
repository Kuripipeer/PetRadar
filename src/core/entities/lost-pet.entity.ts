import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lost_pets')
export class LostPetEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 50 })
  species: string;

  @Column('varchar', { length: 100 })
  breed: string;

  @Column('varchar', { length: 50 })
  color: string;

  @Column('varchar', { length: 20 })
  size: string;

  @Column('text')
  description: string;

  @Column('varchar', { nullable: true })
  photo_url?: string;

  @Column('varchar', { length: 100 })
  owner_name: string;

  @Column('varchar', { length: 150 })
  owner_email: string;

  @Column('varchar', { length: 30 })
  owner_phone: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Column('varchar', { length: 255 })
  address: string;

  @Column('timestamp')
  lost_date: Date;

  @Column('boolean', { default: true })
  is_active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}