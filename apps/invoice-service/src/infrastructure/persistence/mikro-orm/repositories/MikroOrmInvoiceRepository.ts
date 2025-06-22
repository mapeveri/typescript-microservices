import { InvoiceRepository } from '../../../../domain/invoice/InvoiceRepository';
import { Injectable } from '@nestjs/common';
import { InvoiceId } from '../../../../domain/invoice/InvoiceId';
import { Invoice } from '../../../../domain/invoice/Invoice';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { MikroOrmInvoiceEntitySchema } from '../entities/MikroOrmInvoiceEntitySchema';
import { OrderId } from '../../../../domain/invoice/OrderId';

@Injectable()
export class MikroOrmInvoiceRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(MikroOrmInvoiceEntitySchema)
    private readonly invoiceRepository: EntityRepository<Invoice>,
  ) {}

  async findById(id: InvoiceId): Promise<Invoice | undefined> {
    const invoice = await this.invoiceRepository.findOne({ id });

    if (!invoice) return undefined;
    return invoice;
  }

  async findByOrderId(orderId: OrderId): Promise<Invoice | undefined> {
    const invoice = await this.invoiceRepository.findOne({ orderId });

    if (!invoice) return undefined;
    return invoice;
  }

  async save(invoice: Invoice): Promise<void> {
    return this.invoiceRepository.getEntityManager().persistAndFlush(invoice);
  }
}
