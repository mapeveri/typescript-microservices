import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { subscribers } from './app/subscribers';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import { entitySchemas } from './infrastructure/persistence/mikro-orm/entities';
import { controllers } from './app/controllers';
import { commands } from './application/command';
import { services } from './infrastructure/persistence/mikro-orm/services';
import { repositories } from './infrastructure/persistence/mikro-orm/repositories';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    SharedModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: [...entitySchemas],
        entitiesTs: [...entitySchemas],
        forceUndefined: true,
        allowGlobalContext: true,
        clientUrl: `mongodb://${configService.get('MONGO_ROOT_USERNAME')}:${configService.get('MONGO_ROOT_PASSWORD')}@${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}`,
        dbName: configService.get('INVOICE_SERVICE_DATABASE'),
        driver: MongoDriver,
      }),
    }),
    MikroOrmModule.forFeature([...entitySchemas]),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('RABBITMQ_HOST')!,
        connectionInitOptions: { wait: false },
        queues: [
          {
            name: configService.get('RABBITMQ_ORDER_PROJECTION_QUEUE')!,
            createQueueIfNotExists: true,
            exchange: configService.get('RABBITMQ_EXCHANGE')!,
            routingKey: 'order.*',
          },
          {
            name: configService.get('RABBITMQ_SEND_INVOICE_QUEUE')!,
            createQueueIfNotExists: true,
            exchange: configService.get('RABBITMQ_EXCHANGE')!,
            routingKey: 'order.OrderStatusWasChangedEvent',
          },
        ],
      }),
    }),
  ],
  controllers,
  providers: [...subscribers, ...services, ...repositories, ...commands],
})
export class InvoiceServiceModule {}
