import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { FoundPetsService } from './found-pets.service';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  async create(@Body() createFoundPetDto: CreateFoundPetDto) {
    return await this.foundPetsService.create(createFoundPetDto);
  }

  @Get()
  async findAll() {
    return await this.foundPetsService.findAll();
  }
}