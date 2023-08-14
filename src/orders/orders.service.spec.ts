import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { OrderEntity } from './entities/order.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let dbService: InMemoryDBService<OrderEntity>;
  const mockedOrders = [
    {
      id: '1691622645898',
      product: 'Painkiller',
      quantity: 3,
      integrationName: 'test',
      customerInfo: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'Cityville',
        state: 'State',
        zipCode: '12345',
        country: 'Country',
      },
    },
  ] as OrderEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: InMemoryDBService,
          useValue: {
            create: jest.fn(),
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    dbService = module.get<InMemoryDBService<OrderEntity>>(InMemoryDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new order', async () => {
    const orderDto = mockedOrders[0];
    dbService.create = jest.fn().mockResolvedValue(orderDto);

    const result = await service.createOrder(orderDto);

    expect(result).toEqual(orderDto);
    expect(dbService.create).toHaveBeenCalledWith(orderDto);
  });

  it('should get orders by integration name', async () => {
    dbService.query = jest.fn().mockResolvedValue(mockedOrders);

    const result = await service.findAllOrdersByIntegrationName('test');

    expect(result).toEqual(mockedOrders);
    expect(dbService.query).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should get order by id and integration name', async () => {
    dbService.query = jest.fn().mockResolvedValue(mockedOrders);

    const result = await service.findOneOrder('test', '1691622645898');

    expect(result).toEqual(mockedOrders[0]);
    expect(dbService.query).toHaveBeenCalledWith(expect.any(Function));
  });
});
