import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface OrderEntity extends InMemoryDBEntity {
  integrationName: string;
  product: string;
  quantity: number;
  customerInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
