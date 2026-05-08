import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { FoundPetsService } from './found-pets.service';
import { logger } from 'src/config/logger';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  async create(@Body() createFoundPetDto: CreateFoundPetDto) {
    logger.info(
      `[FoundPetsController] Creando mascota encontrada: ${JSON.stringify(createFoundPetDto)}`,
    );
    return await this.foundPetsService.create(createFoundPetDto);
  }

  @Get()
  async findAll() {
    logger.info('[FoundPetsController] Consultando mascotas encontradas');
    return await this.foundPetsService.findAll();
  }
}
