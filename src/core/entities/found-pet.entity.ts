import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('found_pets')
export class FoundPetEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  species: string;

  @Column('varchar', { length: 100, nullable: true })
  breed?: string;

  @Column('varchar', { length: 50 })
  color: string;

  @Column('varchar', { length: 20 })
  size: string;

  @Column('text')
  description: string;

  @Column('varchar', { nullable: true })
  photo_url?: string;

  @Column('varchar', { length: 100 })
  finder_name: string;

  @Column('varchar', { length: 150 })
  finder_email: string;

  @Column('varchar', { length: 30 })
  finder_phone: string;

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
  found_date: Date;

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