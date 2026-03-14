import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPetEntity } from '../core/entities/lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPetEntity)
    private readonly lostPetRepository: Repository<LostPetEntity>,
  ) {}

  async create(createLostPetDto: CreateLostPetDto) {
    const lostPet = this.lostPetRepository.create({
      name: createLostPetDto.name,
      species: createLostPetDto.species,
      breed: createLostPetDto.breed,
      color: createLostPetDto.color,
      size: createLostPetDto.size,
      description: createLostPetDto.description,
      photo_url: createLostPetDto.photo_url,
      owner_name: createLostPetDto.owner_name,
      owner_email: createLostPetDto.owner_email,
      owner_phone: createLostPetDto.owner_phone,
      address: createLostPetDto.address,
      lost_date: new Date(createLostPetDto.lost_date),
      is_active: true,
      location: {
        type: 'Point',
        coordinates: [createLostPetDto.lng, createLostPetDto.lat],
      },
    });

    return await this.lostPetRepository.save(lostPet);
  }

  async findAll() {
    return await this.lostPetRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}