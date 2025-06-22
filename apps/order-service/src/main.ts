import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);

  const config = new DocumentBuilder()
    .setTitle('Order service')
    .setDescription('The Order service API ')
    .setVersion('1.0')
    .addTag('Order')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.SERVER_PORT_ORDER_SERVICE ?? 4000);
}

void bootstrap();
