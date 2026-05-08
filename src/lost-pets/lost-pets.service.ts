import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPetEntity } from '../core/entities/lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { CacheService } from '../cache/cache.service';

const CACHE_KEY_LOST_PETS = 'lost-pets:active';
const CACHE_TTL_SECONDS = 60;
@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPetEntity)
    private readonly lostPetRepository: Repository<LostPetEntity>,
    private readonly cacheService: CacheService,
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

    const savedLostPet = await this.lostPetRepository.save(lostPet);
    await this.cacheService.del(CACHE_KEY_LOST_PETS);
    return savedLostPet;
  }

  async findAll() {
    const cachedLostPets = await this.cacheService.get<LostPetEntity[]>(CACHE_KEY_LOST_PETS);
    if (cachedLostPets) return cachedLostPets;

    const lostPets = await this.lostPetRepository.find({
      where: { is_active: true },
      order: { id: 'DESC' },
    });

    await this.cacheService.set(CACHE_KEY_LOST_PETS, lostPets, CACHE_TTL_SECONDS);
    return lostPets;
  }
}
