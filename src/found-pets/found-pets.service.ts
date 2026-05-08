import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { envs } from '../config/envs';
import { FoundPetEntity } from '../core/entities/found-pet.entity';
import { LostPetEntity } from '../core/entities/lost-pet.entity';
import { EmailService } from '../email/email.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { buildFoundPetMatchTemplate } from './templates/found-pet-match.template';
import { buildFoundPetNotificationTemplate } from './templates/found-pet-notification.template';
import { buildSinglePointMapUrl, buildStaticMapUrl } from './utils/mapbox.util';
import { CacheService } from 'src/cache/cache.service';
const CACHE_KEY_FOUND_PETS = 'found-pets:all';
const CACHE_KEY_LOST_PETS = 'lost-pets:active';
const CACHE_TTL_SECONDS = 60;

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPetEntity)
    private readonly foundPetRepository: Repository<FoundPetEntity>,

    @InjectRepository(LostPetEntity)
    private readonly lostPetRepository: Repository<LostPetEntity>,

    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {}

  async create(createFoundPetDto: CreateFoundPetDto) {
    const foundPet = this.foundPetRepository.create({
      species: createFoundPetDto.species,
      breed: createFoundPetDto.breed,
      color: createFoundPetDto.color,
      size: createFoundPetDto.size,
      description: createFoundPetDto.description,
      photo_url: createFoundPetDto.photo_url,
      finder_name: createFoundPetDto.finder_name,
      finder_email: createFoundPetDto.finder_email,
      finder_phone: createFoundPetDto.finder_phone,
      address: createFoundPetDto.address,
      found_date: new Date(createFoundPetDto.found_date),
      location: {
        type: 'Point',
        coordinates: [createFoundPetDto.lng, createFoundPetDto.lat],
      },
    });

    const savedFoundPet = await this.foundPetRepository.save(foundPet);
    await this.cacheService.del(CACHE_KEY_FOUND_PETS);
    await this.cacheService.del(CACHE_KEY_LOST_PETS);

    const matches = await this.findNearbyLostPets(
      createFoundPetDto.lng,
      createFoundPetDto.lat,
    );

    if (matches.length === 0) {
      const mapUrl = buildSinglePointMapUrl(
        createFoundPetDto.lng,
        createFoundPetDto.lat,
      );

      const html = buildFoundPetNotificationTemplate({
        foundAddress: createFoundPetDto.address,
        foundPet: {
          species: createFoundPetDto.species,
          breed: createFoundPetDto.breed,
          color: createFoundPetDto.color,
          size: createFoundPetDto.size,
          description: createFoundPetDto.description,
          photo_url: createFoundPetDto.photo_url,
        },
        finder: {
          name: createFoundPetDto.finder_name,
          email: createFoundPetDto.finder_email,
          phone: createFoundPetDto.finder_phone,
        },
        mapUrl,
      });

      try {
        await this.emailService.sendEmail(
          envs.MAIL_TO,
          '📍 Nueva mascota encontrada',
          html,
        );
      } catch (error) {
        console.error('Error sending general notification email:', error);
      }
    } else {
      for (const lostPet of matches) {
        const [lostLng, lostLat] = lostPet.location.coordinates;

        const mapUrl = buildStaticMapUrl(
          lostLng,
          lostLat,
          createFoundPetDto.lng,
          createFoundPetDto.lat,
        );

        const html = buildFoundPetMatchTemplate({
          ownerName: lostPet.owner_name,
          lostAddress: lostPet.address,
          foundAddress: createFoundPetDto.address,
          foundPet: {
            species: createFoundPetDto.species,
            breed: createFoundPetDto.breed,
            color: createFoundPetDto.color,
            size: createFoundPetDto.size,
            description: createFoundPetDto.description,
            photo_url: createFoundPetDto.photo_url,
          },
          finder: {
            name: createFoundPetDto.finder_name,
            email: createFoundPetDto.finder_email,
            phone: createFoundPetDto.finder_phone,
          },
          mapUrl,
          distance: Number(lostPet.distance),
        });

        try {
          await this.emailService.sendEmail(
            envs.MAIL_TO,
            '🐾 Posible coincidencia encontrada',
            html,
          );
        } catch (error) {
          console.error('Error sending match email:', error);
        }
      }
    }

    return {
      foundPet: savedFoundPet,
      matchesFound: matches.length,
      matches,
    };
  }

  async findAll() {
    const cachedFoundPets = await this.cacheService.get<FoundPetEntity[]>(CACHE_KEY_FOUND_PETS);
    if (cachedFoundPets) return cachedFoundPets;

    const foundPets = await this.foundPetRepository.find({
      order: { id: 'DESC' },
    });

    await this.cacheService.set(CACHE_KEY_FOUND_PETS, foundPets, CACHE_TTL_SECONDS);
    return foundPets;
  }

  private async findNearbyLostPets(lng: number, lat: number) {
    return await this.lostPetRepository
      .createQueryBuilder('lost_pet')
      .select([
        'lost_pet.id',
        'lost_pet.name',
        'lost_pet.species',
        'lost_pet.breed',
        'lost_pet.color',
        'lost_pet.size',
        'lost_pet.description',
        'lost_pet.photo_url',
        'lost_pet.owner_name',
        'lost_pet.owner_email',
        'lost_pet.owner_phone',
        'lost_pet.location',
        'lost_pet.address',
        'lost_pet.lost_date',
        'lost_pet.is_active',
        'lost_pet.created_at',
        'lost_pet.updated_at',
      ])
      .addSelect(
        `
        ST_Distance(
          lost_pet.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        )
        `,
        'distance',
      )
      .where('lost_pet.is_active = true')
      .andWhere(
        `
        ST_DWithin(
          lost_pet.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          500
        )
        `,
        { lng, lat },
      )
      .orderBy('distance', 'ASC')
      .getRawAndEntities()
      .then((result) =>
        result.entities.map((entity, index) => ({
          ...entity,
          distance: result.raw[index].distance,
        })),
      );
  }
}
