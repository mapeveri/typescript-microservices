import { Module } from '@nestjs/common';
import { buses } from '@app/shared/infrastructure/bus';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { NestErrorFilter } from '@app/shared/infrastructure/exception/NestErrorFilter';
import { FILE_STORAGE } from '@app/shared/domain/storage/FileStorage';
import { LocalFileStorage } from '@app/shared/infrastructure/storage/LocalFileStorage';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: configService.get('RABBITMQ_EXCHANGE')!,
            type: 'topic',
            options: {
              durable: true,
            },
          },
        ],
        uri: configService.get('RABBITMQ_HOST')!,
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [
    ...buses,
    {
      provide: APP_FILTER,
      useClass: NestErrorFilter,
    },
    {
      provide: FILE_STORAGE,
      useClass: LocalFileStorage,
    },
  ],
  exports: [...buses, RabbitMQModule, FILE_STORAGE],
})
export class SharedModule {}
