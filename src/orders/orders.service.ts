import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';

import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private orderDBService: InMemoryDBService<OrderEntity>) {}

  async createOrder(createOrderDto: OrderEntity): Promise<OrderEntity> {
    return await this.orderDBService.create(createOrderDto);
  }

  async findAllOrdersByIntegrationName(
    integrationName: string,
  ): Promise<OrderEntity[]> {
    return await this.orderDBService.query(
      (order) => order.integrationName === integrationName,
    );
  }

  async findOneOrder(
    integrationName: string,
    id: string,
  ): Promise<OrderEntity> {
    const [order] = await this.orderDBService.query(
      (order) => order.id === id && order.integrationName === integrationName,
    );
    return order;
  }
}
