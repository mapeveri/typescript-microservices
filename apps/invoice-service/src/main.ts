import { NestFactory } from '@nestjs/core';
import { InvoiceServiceModule } from './invoice-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InvoiceServiceModule);

  const config = new DocumentBuilder()
    .setTitle('Invoice service')
    .setDescription('The Invoice service API ')
    .setVersion('1.0')
    .addTag('Invoice')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.SERVER_PORT_INVOICE_SERVICE ?? 5000);
}

void bootstrap();
