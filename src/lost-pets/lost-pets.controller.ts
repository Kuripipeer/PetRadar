import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { LostPetsService } from './lost-pets.service';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async create(@Body() createLostPetDto: CreateLostPetDto) {
    return await this.lostPetsService.create(createLostPetDto);
  }

  @Get()
  async findAll() {
    return await this.lostPetsService.findAll();
  }
}