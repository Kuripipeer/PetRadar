import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPetEntity } from '../core/entities/found-pet.entity';
import { LostPetEntity } from '../core/entities/lost-pet.entity';
import { EmailModule } from '../email/email.module';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoundPetEntity, LostPetEntity]),
    EmailModule,
  ],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
})
export class FoundPetsModule {}