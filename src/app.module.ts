import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [LostPetsModule, FoundPetsModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
