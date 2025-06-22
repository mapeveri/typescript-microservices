import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmOrderEntitySchema } from './infrastructure/persistence/mikro-orm/entities/MikroOrmOrderEntitySchema';
import { controllers } from './app/controllers';
import { commands } from './application/command';
import { repositories } from './infrastructure/persistence/mikro-orm/repositories';
import { SharedModule } from '@app/shared';
import { queries } from './application/query';
import { entitySchemas } from './infrastructure/persistence/mikro-orm/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: [...entitySchemas],
        entitiesTs: [...entitySchemas],
        forceUndefined: true,
        clientUrl: `mongodb://${configService.get('MONGO_ROOT_USERNAME')}:${configService.get('MONGO_ROOT_PASSWORD')}@${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}`,
        dbName: configService.get('ORDER_SERVICE_DATABASE'),
        driver: MongoDriver,
      }),
    }),
    MikroOrmModule.forFeature([MikroOrmOrderEntitySchema]),
    CqrsModule.forRoot(),
  ],
  controllers,
  providers: [...commands, ...queries, ...repositories],
})
export class OrderServiceModule {}
