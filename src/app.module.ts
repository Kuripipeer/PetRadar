import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { EmailModule } from './email/email.module';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { LostPetsModule } from './lost-pets/lost-pets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    EmailModule,
    LostPetsModule,
    FoundPetsModule,
  ],
})
export class AppModule {}