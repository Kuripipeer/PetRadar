import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { LostPetsService } from './lost-pets.service';
import { logger } from 'src/config/logger';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async create(@Body() createLostPetDto: CreateLostPetDto) {
    logger.info(
      `[LostPetsController] Creando mascota perdida: ${JSON.stringify(createLostPetDto)}`,
    );
    return await this.lostPetsService.create(createLostPetDto);
  }

  @Get()
  async findAll() {
    logger.info('[LostPetsController] Consultando mascotas perdidas activas');
    return await this.lostPetsService.findAll();
  }
}
