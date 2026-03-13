import { DataSource } from 'typeorm';
import { envs } from '../../config/envs';
import { LostPetEntity } from '../entities/lost-pet.entity';
import { FoundPetEntity } from '../entities/found-pet.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [LostPetEntity, FoundPetEntity],
  migrations: ['dist/core/db/migrations/*'],
  synchronize: false,
});

export default AppDataSource;